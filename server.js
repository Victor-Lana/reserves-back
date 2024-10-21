const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do middleware
app.use(cors());
app.use(express.json()); // Usando express.json() para parsing de JSON

// Configuração do Banco de Dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sistema-reservas',
    password: '3315',
    port: 5432,
});

// Rota para criar um novo administrador
app.post('/admins', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hashear a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar administrador:', error);
        res.status(500).json({ error: 'Erro ao criar administrador' });
    }
});


// Rota de Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        const admin = result.rows[0];

        // Verificar a senha
        const match = await bcrypt.compare(password, admin.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        // Gerar JWT
        const token = jwt.sign({ id: admin.id, username: admin.username }, 'seu-segredo-jwt', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Rota para listar todos os assentos disponíveis
app.get('/seats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM seats');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar assentos:', error);
        res.status(500).json({ error: 'Erro ao buscar assentos' });
    }
});

// Rota para listar todas as reservas
app.get('/reservations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservations');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        res.status(500).json({ error: 'Erro ao buscar reservas' });
    }
});

// Rota para criar uma nova reserva
app.post('/reservations', async (req, res) => {
    const { name, phone, people_count, reservation_date, reservation_time, table_id } = req.body;
    try {
        // Verificar se já existe uma reserva para o assento no mesmo horário
        const conflictingReservations = await pool.query(
            'SELECT * FROM reservations WHERE table_id = $1 AND reservation_date = $2 AND reservation_time BETWEEN $3 AND $3 + INTERVAL \'2 hours\'',
            [table_id, reservation_date, reservation_time]
        );
        
        if (conflictingReservations.rows.length > 0) {
            for (const reservation of conflictingReservations.rows) {
                await pool.query('UPDATE reservations SET status = $1 WHERE id = $2', ['lista de espera', reservation.id]);
            }
            res.status(409).json({ message: 'Conflito com outra reserva. Reservas conflitantes movidas para a lista de espera.' });
            return;
        }

        // Criar a nova reserva
        const result = await pool.query(
            'INSERT INTO reservations (name, phone, people_count, reservation_date, reservation_time, status, table_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, phone, people_count, reservation_date, reservation_time, 'pendente', table_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        res.status(500).json({ error: 'Erro ao criar reserva' });
    }
});

// Rota para atualizar o status de uma reserva para 'reservada'
app.put('/reservations/:id/accept', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
            ['reservada', id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao aceitar reserva:', error);
        res.status(500).json({ error: 'Erro ao aceitar reserva' });
    }
});

// Rota para mover uma reserva para a lista de espera
app.put('/reservations/:id/waitlist', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
            ['lista de espera', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reserva não encontrada.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao mover reserva para lista de espera:', error);
        res.status(500).json({ error: 'Erro ao mover reserva para lista de espera.' });
    }
});

// Rota para recusar uma reserva
app.put('/reservations/:id/decline', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
            ['recusado', id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao recusar reserva:', error);
        res.status(500).json({ error: 'Erro ao recusar reserva' });
    }
});

// Rota para confirmar uma reserva da lista de espera
app.patch('/reservations/:id/confirm', async (req, res) => {
    const reservationId = req.params.id;
    try {
        const reservation = await pool.query('SELECT * FROM reservations WHERE id = $1', [reservationId]);
        if (reservation.rows.length === 0 || reservation.rows[0].status !== 'lista de espera') {
            return res.status(400).json({ error: 'Reserva não encontrada ou não está na lista de espera.' });
        }

        await pool.query('UPDATE reservations SET status = $1 WHERE id = $2', ['reservada', reservationId]);

        res.json({ message: 'Reserva confirmada com sucesso!' });
    } catch (error) {
        console.error('Erro ao confirmar reserva:', error);
        res.status(500).json({ error: 'Erro ao confirmar reserva' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
