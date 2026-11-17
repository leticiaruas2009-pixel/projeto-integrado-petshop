-- Modelo Físico — Petshop
-- Apaga o banco antigo (se existir) e cria de novo
DROP DATABASE IF EXISTS petshop;
CREATE DATABASE petshop;
USE petshop;

CREATE TABLE Tutor (
    ID_Tutor INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Telefone VARCHAR(20),
    Email VARCHAR(100)
);

CREATE TABLE Pet (
    ID_Pet INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Especie VARCHAR(50) NOT NULL,
    Raca VARCHAR(50),
    Data_nascimento DATE,
    ID_Tutor INT NOT NULL,
    FOREIGN KEY (ID_Tutor) REFERENCES Tutor(ID_Tutor) ON DELETE CASCADE
);

CREATE TABLE Atendimento (
    ID_Atendimento INT AUTO_INCREMENT PRIMARY KEY,
    Servico VARCHAR(100) NOT NULL,
    Data_hora DATETIME NOT NULL,
    Valor DECIMAL(10,2) NOT NULL,
    ID_Pet INT NOT NULL,
    FOREIGN KEY (ID_Pet) REFERENCES Pet(ID_Pet) ON DELETE CASCADE
);

-- Dados de teste
INSERT INTO Tutor (Nome, Telefone, Email) VALUES ('Ana Souza', '(11) 99999-1111', 'ana@email.com');
INSERT INTO Pet (Nome, Especie, Raca, Data_nascimento, ID_Tutor) VALUES ('Thor', 'Cachorro', 'Labrador', '2021-03-10', 1);
INSERT INTO Atendimento (Servico, Data_hora, Valor, ID_Pet) VALUES ('Banho e tosa', '2026-11-08 14:00:00', 80.00, 1);