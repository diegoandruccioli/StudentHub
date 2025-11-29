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