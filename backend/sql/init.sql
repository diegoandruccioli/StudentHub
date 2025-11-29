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

-- 7. Creazione Tabella Impostazioni Utente (Relazione 1:1)
CREATE TABLE IF NOT EXISTS impostazioni_utente (
    id_utente INT PRIMARY KEY, -- La chiave primaria è anche chiave esterna (1 utente = 1 riga impostazioni)
    
    -- Modalità visualizzazione voti: 'DEFAULT' (blu) o 'RGB' (colori)
    tema_voti ENUM('DEFAULT', 'RGB') NOT NULL DEFAULT 'DEFAULT',
    
    -- Soglie per i colori (usate solo se tema_voti = 'RGB')
    -- Esempio: Se soglia_bassa = 20, allora voti < 20 sono ROSSI
    -- Esempio: Se soglia_alta = 27, allora voti >= 27 sono VERDI
    -- I voti nel mezzo (da 20 a 26) saranno GIALLI
    rgb_soglia_bassa INT DEFAULT 18 CHECK (rgb_soglia_bassa >= 18 AND rgb_soglia_bassa <= 30),
    rgb_soglia_alta INT DEFAULT 27 CHECK (rgb_soglia_alta >= 18 AND rgb_soglia_alta <= 30),
    
    -- Vincolo di coerenza: la soglia bassa deve essere minore o uguale alla alta
    CONSTRAINT chk_soglie CHECK (rgb_soglia_bassa <= rgb_soglia_alta),

    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE
);
    
---

-- 8. Creazione del Trigger per l'inserimento automatico
-- Usiamo il DELIMITER per dire a MySQL dove finisce il blocco di codice del trigger
DELIMITER //

CREATE TRIGGER after_utente_insert
AFTER INSERT ON utenti
FOR EACH ROW
BEGIN
    -- Appena viene creato un utente (NEW.id), crea la sua riga di impostazioni di default
    INSERT INTO impostazioni_utente (id_utente) 
    VALUES (NEW.id);
END; //

-- Ripristiniamo il delimitatore standard
DELIMITER ;