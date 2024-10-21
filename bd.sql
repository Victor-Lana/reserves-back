CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'disponível',
    position_x INT NOT NULL,
    position_y INT NOT NULL
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    people_count INT,
    reservation_date DATE,
    reservation_time TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    table_id INT REFERENCES seats(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password_hash) VALUES ('admin', '$2b$10$Eix5ZhEoQ6gY0B0w1T3OeuWW1/I3uFh7X1Xpy5B1YgXk8GQ1I87l6');
-- admin,suaSenhaSegura
INSERT INTO seats (table_number, capacity, status, position_x, position_y)
VALUES 
(1, 4, 'disponível', 100, 100),
(2, 6, 'disponível', 300, 100),
(3, 2, 'disponível', 500, 100),
(4, 8, 'disponível', 700, 100),
(5, 4, 'disponível', 100, 300),
(6, 6, 'disponível', 300, 300),
(7, 2, 'disponível', 500, 300),
(8, 8, 'disponível', 700, 300);

SELECT * FROM seats;
