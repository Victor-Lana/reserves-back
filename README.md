Documentação da API - Sistema de Reservas
Dependências
Esta API utiliza as seguintes dependências:

express: Framework web minimalista para Node.js.
cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing).
pg: Cliente PostgreSQL para Node.js.
bcrypt: Biblioteca para hashing de senhas.
jsonwebtoken: Biblioteca para geração e verificação de tokens JWT.
Instalação das Dependências
Para instalar as dependências, execute o seguinte comando no terminal:

bash
Copiar código
npm install express cors pg bcrypt jsonwebtoken
Configuração da API
Configuração do Servidor
Crie um arquivo .env para armazenar as variáveis de ambiente:

env
Copiar código
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=sistema-reservas
DB_PASSWORD=3315
DB_PORT=5432
JWT_SECRET=seu-segredo-jwt
Carregue as variáveis de ambiente no seu código:

javascript
Copiar código
require('dotenv').config();
Configuração do banco de dados:

A conexão com o banco de dados PostgreSQL é configurada da seguinte forma:

javascript
Copiar código
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
Iniciando o Servidor
Para iniciar o servidor, execute o comando:

bash
Copiar código
node index.js
Substitua index.js pelo nome do seu arquivo principal.

Rotas da API
1. Criar um Novo Administrador
URL: /admins

Método: POST

Corpo da Requisição:

json
Copiar código
{
    "username": "adminTeste",
    "password": "senhaSegura123"
}
Resposta de Sucesso:

json
Copiar código
{
    "id": 1,
    "username": "adminTeste",
    "password_hash": "$2b$10$...",
    "created_at": "2024-01-01T00:00:00Z"
}
2. Fazer Login
URL: /login

Método: POST

Corpo da Requisição:

json
Copiar código
{
    "username": "adminTeste",
    "password": "senhaSegura123"
}
Resposta de Sucesso:

json
Copiar código
{
    "token": "seu_token_jwt_aqui"
}
3. Listar Todos os Assentos
URL: /seats

Método: GET

Resposta:

json
Copiar código
[
    {
        "id": 1,
        "name": "Assento 1"
    },
    {
        "id": 2,
        "name": "Assento 2"
    }
]
4. Listar Todas as Reservas
URL: /reservations

Método: GET

Resposta:

json
Copiar código
[
    {
        "id": 1,
        "name": "Cliente 1",
        "status": "pendente"
    },
    {
        "id": 2,
        "name": "Cliente 2",
        "status": "reservada"
    }
]
5. Criar uma Nova Reserva
URL: /reservations

Método: POST

Corpo da Requisição:

json
Copiar código
{
    "name": "Cliente 1",
    "phone": "123456789",
    "people_count": 2,
    "reservation_date": "2024-10-21",
    "reservation_time": "18:00",
    "table_id": 1
}
Resposta de Sucesso:

json
Copiar código
{
    "id": 1,
    "name": "Cliente 1",
    "status": "pendente"
}
6. Atualizar o Status de uma Reserva
URL: /reservations/:id/accept

Método: PUT

Resposta de Sucesso:

json
Copiar código
{
    "id": 1,
    "status": "reservada"
}
7. Mover uma Reserva para a Lista de Espera
URL: /reservations/:id/waitlist

Método: PUT

Resposta de Sucesso:

json
Copiar código
{
    "id": 1,
    "status": "lista de espera"
}
8. Recusar uma Reserva
URL: /reservations/:id/decline

Método: PUT

Resposta de Sucesso:

json
Copiar código
{
    "id": 1,
    "status": "recusado"
}
9. Confirmar uma Reserva da Lista de Espera
URL: /reservations/:id/confirm

Método: PATCH

Resposta de Sucesso:

json
Copiar código
{
    "message": "Reserva confirmada com sucesso!"
}
