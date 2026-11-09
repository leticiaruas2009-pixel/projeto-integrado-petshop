-- Cria o banco (se ainda não existir) e entra nele
CREATE DATABASE IF NOT EXISTS petshop;
USE petshop;

-- Tabela dos donos dos animais
CREATE TABLE tutor (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- o MySQL gera o número sozinho
    nome VARCHAR(100) NOT NULL,         -- NOT NULL = obrigatório
    telefone VARCHAR(20),
    email VARCHAR(100)
);

-- Tabela dos animais (cada pet pertence a um tutor)
CREATE TABLE pet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    data_nascimento DATE,
    tutor_id INT NOT NULL,              -- a "etiqueta" que diz quem é o dono
    FOREIGN KEY (tutor_id) REFERENCES tutor(id) ON DELETE CASCADE
);

-- Tabela dos serviços feitos (cada atendimento é de um pet)
CREATE TABLE atendimento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servico VARCHAR(100) NOT NULL,
    data_hora DATETIME NOT NULL,
    valor DECIMAL(10,2) NOT NULL,       -- DECIMAL é o tipo certo para dinheiro
    pet_id INT NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);

-- Dados de teste
INSERT INTO tutor (nome, telefone, email) VALUES ('Ana Souza', '(11) 99999-1111', 'ana@email.com');
INSERT INTO pet (nome, especie, raca, data_nascimento, tutor_id) VALUES ('Thor', 'Cachorro', 'Labrador', '2021-03-10', 1);
INSERT INTO atendimento (servico, data_hora, valor, pet_id) VALUES ('Banho e tosa', '2026-11-08 14:00:00', 80.00, 1);