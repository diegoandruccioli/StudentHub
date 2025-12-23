SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studenthub_db`
--

-- --------------------------------------------------------

--
-- Pulizia delle tabelle esistenti prima dell'inserimento
--
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM obiettivi_sbloccati;
DELETE FROM esami;
DELETE FROM impostazioni_utente;
DELETE FROM obiettivi;
DELETE FROM livelli;
DELETE FROM utenti;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------

--
-- Dump dei dati per la tabella `utenti`
--

INSERT INTO `utenti` (`id`, `email`, `password`, `nome`, `cognome`, `ruolo`, `xp_totali`, `created_at`) VALUES
(1, 'reimici@studenthub.com', '$2b$10$2rbNJdYx5AMHHpZj.StUjOTU.TJn9wwEZATMUTlqKP2Gl5s5XUs5W', 'Rei', 'Mici', '0', 1146, '2025-12-23 09:02:23'),
(2, 'diegoandruccioli@studenthub.com', '$2b$10$Y/obgEJCf5SkKBp04gaTzu5u9RX/37uYyp.GmWeTReBBLLepnu4by', 'Diego', 'Andruccioli', '0', 1732, '2025-12-23 09:02:47'),
(3, 'giovannimorelli@studenthub.com', '$2b$10$bvhAk.X0gnMSbWVvy41wweyAY0qz0j/A0SSUKkF42p.n5Kf1AQuZO', 'Giovanni', 'Morelli', '0', 1412, '2025-12-23 09:03:04'),
(4, 'superadmin@studenthub.com', '$2b$10$9Rym/JIL9X.GybLomU7YvOhZLSu.qft9.zQBpk70TOY8Dfphu0ZYG', 'SuperAdmin', 'SuperAdmin', '2', 0, '2025-12-23 09:03:46'),
(5, 'admin@studenthub.com', '$2b$10$coQ56ySY1TjNTYhfU6oc3.i9fqkBtRBD5.41nJeUe659P22WXY4yC', 'Admin', 'Admin', '1', 0, '2025-12-23 09:04:00');

-- --------------------------------------------------------

--
-- Struttura della tabella `livelli`
--

--
-- Dump dei dati per la tabella `livelli`
--

INSERT INTO `livelli` (`id`, `numero`, `nome`, `descrizione`, `xp_min`, `xp_max`) VALUES
(1, 1, 'Matricola Dispersa', 'Hai appena iniziato il tuo viaggio.', 0, 499),
(2, 2, 'Studente Attento', 'Inizi a capire come funziona.', 500, 1499),
(3, 3, 'Veterano degli Appunti', 'Sai sempre dove trovare le dispense.', 1500, 2999),
(4, 4, 'Maestro dei CFU', 'I crediti non hanno segreti per te.', 3000, 4499),
(5, 5, 'Laureando Leggendario', 'La corona d\'alloro è vicina.', 4500, NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `obiettivi`
--

--
-- Dump dei dati per la tabella `obiettivi`
--

INSERT INTO `obiettivi` (`id`, `nome`, `descrizione`, `xp_valore`) VALUES
(1, 'Primo Passo', 'Registra il tuo primo esame superato', 150),
(2, 'Secchione', 'Ottieni la tua prima Lode', 300),
(3, 'Maratoneta', 'Supera 3 esami in un mese', 500),
(4, 'Giro di Boa', 'Raggiungi 90 CFU', 800);

-- --------------------------------------------------------

--
-- Struttura della tabella `esami`
--

--
-- Dump dei dati per la tabella `esami`
--

INSERT INTO `esami` (`id`, `id_utente`, `nome`, `voto`, `lode`, `cfu`, `data`, `xp_guadagnati`, `created_at`) VALUES
(1, 1, 'BASI DI DATI', 23, 0, 6, '2025-06-11', 138, '2025-12-23 09:11:59'),
(2, 1, 'ELEMENTI DI MATEMATICA PER L\'INFORMATICA', 18, 0, 6, '2025-01-20', 108, '2025-12-23 09:11:59'),
(3, 1, 'FONDAMENTI DI SISTEMI WEB', 27, 0, 6, '2025-06-16', 162, '2025-12-23 09:11:59'),
(4, 1, 'PROGRAMMAZIONE', 28, 0, 9, '2025-01-27', 252, '2025-12-23 09:11:59'),
(5, 1, 'RETI DI CALCOLATORI E PROGRAMMAZIONE DI RETE', 28, 0, 6, '2025-01-10', 168, '2025-12-23 09:11:59'),
(6, 1, 'SISTEMI VIRTUALIZZATI', 27, 0, 6, '2025-09-02', 162, '2025-12-23 09:11:59'),
(7, 1, 'SPERIMENTAZIONE FISICA, ELETTRONICA E SENSORISTICA PER INFORMATICA', 26, 0, 6, '2025-06-27', 156, '2025-12-23 09:11:59'),
(8, 2, 'BASI DI DATI', 30, 1, 6, '2025-06-11', 230, '2025-12-23 09:19:28'),
(9, 2, 'ELEMENTI DI ARCHITETTURE DEGLI ELABORATORI E SISTEMI OPERATIVI', 29, 0, 6, '2025-01-15', 174, '2025-12-23 09:19:28'),
(10, 2, 'ELEMENTI DI MATEMATICA PER L\'INFORMATICA', 28, 0, 6, '2025-01-20', 168, '2025-12-23 09:19:28'),
(11, 2, 'FONDAMENTI DI SISTEMI WEB', 30, 0, 6, '2025-06-16', 180, '2025-12-23 09:19:28'),
(12, 2, 'PROGRAMMAZIONE', 30, 0, 9, '2025-01-09', 270, '2025-12-23 09:19:28'),
(13, 2, 'RETI DI CALCOLATORI E PROGRAMMAZIONE DI RETE', 28, 0, 6, '2025-01-10', 168, '2025-12-23 09:19:28'),
(14, 2, 'SISTEMI VIRTUALIZZATI', 30, 1, 6, '2025-06-12', 230, '2025-12-23 09:19:28'),
(15, 2, 'SPERIMENTAZIONE FISICA, ELETTRONICA E SENSORISTICA PER INFORMATICA', 30, 0, 6, '2025-06-11', 180, '2025-12-23 09:19:28'),
(16, 2, 'Iot', 22, 0, 6, '2025-12-22', 132, '2025-12-23 09:22:04'),
(17, 3, 'BASI DI DATI', 30, 1, 6, '2025-06-11', 230, '2025-12-23 09:24:05'),
(18, 3, 'ELEMENTI DI ARCHITETTURE DEGLI ELABORATORI E SISTEMI OPERATIVI', 27, 0, 6, '2025-01-30', 162, '2025-12-23 09:24:05'),
(19, 3, 'ELEMENTI DI MATEMATICA PER L\'INFORMATICA', 30, 0, 6, '2025-01-29', 180, '2025-12-23 09:24:05'),
(20, 3, 'FONDAMENTI DI SISTEMI WEB', 28, 0, 6, '2025-06-16', 168, '2025-12-23 09:24:05'),
(21, 3, 'PROGRAMMAZIONE', 24, 0, 9, '2025-01-09', 216, '2025-12-23 09:24:05'),
(22, 3, 'RETI DI CALCOLATORI E PROGRAMMAZIONE DI RETE', 28, 0, 6, '2025-01-10', 168, '2025-12-23 09:24:05'),
(23, 3, 'SISTEMI VIRTUALIZZATI', 25, 0, 6, '2025-06-26', 150, '2025-12-23 09:24:05'),
(24, 3, 'SPERIMENTAZIONE FISICA, ELETTRONICA E SENSORISTICA PER INFORMATICA', 23, 0, 6, '2025-06-11', 138, '2025-12-23 09:24:05');

-- --------------------------------------------------------

--
-- Struttura della tabella `obiettivi_sbloccati`
--

--
-- Dump dei dati per la tabella `obiettivi_sbloccati`
--

INSERT INTO `obiettivi_sbloccati` (`id_utente`, `id_obiettivo`, `data_conseguimento`) VALUES
(2, 1, '2025-12-23'),
(2, 2, '2025-12-23'),
(2, 3, '2025-12-23');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
