-- 1. Creazione e Selezione del Database
CREATE DATABASE IF NOT EXISTS studenthub_db;
USE studenthub_db;

-- 2. Creazione Tabella Utenti
CREATE TABLE IF NOT EXISTS utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    -- Ruolo: 0=Studente, 1=Admin, 2=SuperAdmin
    ruolo ENUM('0', '1', '2') NOT NULL DEFAULT '0',
    xp_totali INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Creazione Tabella Livelli (Lookup Table)
CREATE TABLE IF NOT EXISTS livelli (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    descrizione VARCHAR(255),
    xp_min INT NOT NULL,
    xp_max INT NULL -- NULL indica "infinito" per l'ultimo livello
);

-- 4. Creazione Tabella Esami
CREATE TABLE IF NOT EXISTS esami (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    voto INT NOT NULL CHECK (voto >= 18 AND voto <= 30),
    lode BOOLEAN NOT NULL DEFAULT FALSE,
    cfu INT NOT NULL,
    data DATE NOT NULL,
    xp_guadagnati INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Vincolo Chiave Esterna: Se l'utente viene cancellato, cancella i suoi esami
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE
);

-- 5. Creazione Tabella Obiettivi (Badge Disponibili)
CREATE TABLE IF NOT EXISTS obiettivi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descrizione TEXT,
    xp_valore INT NOT NULL
);

-- 6. Creazione Tabella Ponte Obiettivi Sbloccati
CREATE TABLE IF NOT EXISTS obiettivi_sbloccati (
    id_utente INT NOT NULL,
    id_obiettivo INT NOT NULL,
    data_conseguimento DATE NOT NULL,
    
    -- Chiave Primaria Composta (evita duplicati dello stesso badge per lo stesso utente)
    PRIMARY KEY (id_utente, id_obiettivo),
    
    -- Vincoli Chiavi Esterne
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE,
    FOREIGN KEY (id_obiettivo) REFERENCES obiettivi(id) ON DELETE CASCADE
);

-- =======================================================
-- DATI INIZIALI (SEEDING)
-- =======================================================

-- Popolamento della tabella livelli (Esempio)
INSERT INTO livelli (numero, nome, descrizione, xp_min, xp_max) VALUES 
(1, 'Matricola Dispersa', 'Hai appena iniziato il tuo viaggio.', 0, 99),
(2, 'Studente Attento', 'Inizi a capire come funziona.', 100, 499),
(3, 'Veterano degli Appunti', 'Sai sempre dove trovare le dispense.', 500, 999),
(4, 'Maestro dei CFU', 'I crediti non hanno segreti per te.', 1000, 2499),
(5, 'Laureando Leggendario', 'La corona d\'alloro è vicina.', 2500, NULL);

-- Popolamento iniziale Obiettivi (Esempio)
INSERT INTO obiettivi (nome, descrizione, xp_valore) VALUES 
('Primo Passo', 'Registra il tuo primo esame superato', 50),
('Secchione', 'Ottieni la tua prima Lode', 100),
('Maratoneta', 'Supera 3 esami in un mese', 150),
('Giro di Boa', 'Raggiungi 90 CFU', 200);