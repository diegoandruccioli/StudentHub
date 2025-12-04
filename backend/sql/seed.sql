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

-- Pulisce la tabella esami per evitare duplicati se lanci lo script più volte (Opzionale)
-- TRUNCATE TABLE esami; 

INSERT INTO esami (id_utente, nome, voto, lode, cfu, data, xp_guadagnati) VALUES 
-- Primo Anno - Sessione Invernale
(1, 'Analisi Matematica T-1', 24, 0, 9, '2023-01-20', 216),
(1, 'Fondamenti di Informatica T-1', 28, 0, 12, '2023-02-15', 336),

-- Primo Anno - Sessione Estiva
(1, 'Architettura degli Elaboratori', 18, 0, 6, '2023-06-14', 108),
(1, 'Algebra e Geometria', 21, 0, 6, '2023-07-03', 126),

-- Primo Anno - Sessione Autunnale (Il recupero dello studente medio)
(1, 'Fisica Generale T', 20, 0, 6, '2023-09-12', 120),

-- Secondo Anno - Sessione Invernale
(1, 'Algoritmi e Strutture Dati', 27, 0, 9, '2024-01-25', 243),
(1, 'Sistemi Operativi', 30, 0, 9, '2024-02-10', 270),

-- Secondo Anno - Sessione Estiva
(1, 'Basi di Dati', 30, 1, 9, '2024-06-20', 320), -- 30 e Lode! (Bonus XP simulato)
(1, 'Reti di Calcolatori', 25, 0, 9, '2024-07-15', 225),

-- Terzo Anno (Attuale) - Sessione Invernale
(1, 'Ingegneria del Software', 29, 0, 9, '2025-01-18', 261),
(1, 'Tecnologie Web', 26, 0, 6, '2025-02-05', 156);