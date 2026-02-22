# StudentHub - Piattaforma di Gestione Carriera Universitaria 🎓

> **Nota Importante**: Questo file funge da copertina per il progetto. Per la documentazione completa, le specifiche tecniche dettagliate, l'analisi architettonica e la relazione richiesta dai professori, si prega di fare riferimento al file principale: 📄 **[report_studenthub.pdf](./report_studenthub.pdf)**

StudentHub è una piattaforma web interattiva progettata per trasformare la gestione della carriera universitaria in un'esperienza coinvolgente attraverso la Gamification. Sviluppato per il corso di **Ingegneria dei Sistemi Web** presso l'Università di Bologna.

## 🌟 Funzionalità principali

*   **Gestione Esami:** Inserimento, visualizzazione e tracciamento degli esami sostenuti (con voto, lode, CFU e data).
*   **Gamification:** Sistema di Livelli, Punti Esperienza (XP) e Obiettivi sbloccabili basati sul progresso accademico.
*   **Gestione Utenti e Ruoli:** Registrazione, login sicuro e profilazione (Studenti, Admin, SuperAdmin).
*   **Statistiche e Grafici:** Visualizzazione dell'andamento tramite grafici dedicati (grazie all'integrazione di Chart.js).
*   **Impostazioni e Personalizzazione:** Possibilità di personalizzare le soglie colore (RGB) in base al voto degli esami.

## 🏗 Architettura e funzionamento

L'architettura dell'applicazione segue un classico modello Client-Server:
*   **Frontend (Client):** Sviluppato in Vue.js 3, fornisce l'interfaccia utente interattiva (Single Page Application - SPA). Si interfaccia al backend tramite chiamate HTTP RESTful gestite con Axios.
*   **Backend (Server):** Basato su Node.js ed Express, implementa le logiche di business, espone le API REST protette tramite JWT, e comunica con il database relazionale per le operazioni CRUD.
*   **Database (Persistenza):** Un database MySQL 8.0 che memorizza gli utenti, le loro credenziali in modo sicuro (tramite hash), la progressione in game, gli esami e i token di refresh in sessione attiva.

**Flusso delle Richieste:** 
1. Il frontend invia una richiesta HTTP (protetta se necessario dal JWT Access Token).
2. L'API di backend la riceve, la valida tramite Zod, verifica il token, e interagisce con il DB.
3. Il DB risponde alle query SQL. Il backend restituisce il risultato JSON al Client.

## 💻 Stack tecnologico

| Componente | Tecnologia | Ruolo |
| :--- | :--- | :--- |
| **Frontend UI** | Vue 3 + Vite | Creazione interfaccia e framework SPA |
| **Routing** | Vue Router | Gestione navigazione client-side |
| **State Management** | Pinia | Gestione centralizzata stato globale |
| **Styling** | Tailwind CSS v4 | Classi di utility per un design responsivo veloce |
| **Chiamate HTTP** | Axios | Interfaccia per chiamate REST verso il backend |
| **Grafici** | Chart.js & vue-chartjs| Rendering dei grafici per le statistiche |
| **Backend Core** | Node.js + Express | Runtime e framework server-side API |
| **Linguaggio** | TypeScript | Tipizzazione statica su backend e frontend |
| **Database** | MySQL 8.0 | RDBMS per memorizzazione persistente |
| **Autenticazione** | JWT + bcrypt | Gestione identity, sicurezza password e sessione |
| **Validazione Dati** | Zod | Controllo tipizzazione e payload all'ingresso (API) |
| **Infrastruttura** | Docker & Compose | Containerizzazione degli ambienti applicativi |

## 📜 Regole e convenzioni seguite

### Frontend
*   **Ecosistema:** Basato su Vite per un HMR ultra rapido. Usa la Composition API di Vue 3 con `<script setup>`.
*   **Struttura:** Componenti UI in pacchetti e pagine divise razionalmente (`src/pages`, `src/components`). 
*   **Gestione di Stato:** Utilizzo massivo di Pinia per memorizzare informazioni dell'utente o stato dell'UI in maniera isolata.
*   **Estetica e Grafica:** Utilizzo di TailwindCSS configurato tramite `@tailwindcss/postcss` per componentizzazione di classi.

### Backend
*   **Pattern Architetturale:** Struttura MVC-oriented e suddivisa in controller, routes e utilities. Punto d'ingresso `server.ts`.
*   **Autenticazione e Sicurezza:** Uso di access e refresh tokens JWT, le password salvate sul DB usando hash (bcrypt). Gestione token scaduti e logout su base cookie o DB persistente (`refresh_tokens`). CORS configurato (`cors`) e pattern DDoS protection usando `express-rate-limit`.
*   **Gestione Errori e Tipo:** Validazione rigorosa degli I/O con le interfacce TS e parsing dinamico con Zod, minimizzando gli errori a runtime.

### Database
*   **Database Schema:** Relazionale. Schema preconfigurato nel file condiviso in `backend/sql/init.sql`. Include tabelle per `utenti`, `livelli`, `esami`, `obiettivi`, `obiettivi_sbloccati`, `impostazioni_utente`, e `refresh_tokens`.
*   **Performance:** Viene fatto un utilizzo efficiente degli indici (`CREATE INDEX`), inclusi gli indici per pulizia automatica token scaduti e recupero esami utente veloce.
*   **Inizializzazione:** Sono garantiti lo schema base e un seeding in `backend/sql/seed.sql` per fornire dati mock sin dalla partenza dei container o dal primo utilizzo.

### Docker
*   **Container Multipli:** Orchestrazione coordinata con definizioni YAML (`docker-compose.yml`), container separati (`studenthub-db`, `studenthub-backend` e `studenthub-frontend`).
*   **Rete Virtuale e Dipendenze:** Tutti lavorano sulla stessa custom bridge network (`studenthub-net`), garantendo la risoluzione dei nomi dei servizi e includendo `depends_on` uniti a test di `healthcheck` per una fase di startup coerente (Il DB parte prima del BE, il BE prima del FE).
*   **Volumi Persistenti:** Il servizio DB definisce correttamente un volume fisico (`db_data`) per prevenire perdite d'informazioni alla chiusura dei container.

## 📋 Prerequisiti

### Metodo Docker (Consigliato)
*   [Docker](https://docs.docker.com/get-docker/) installato
*   Docker Compose integrato

### Metodo Manuale
*   [Node.js](https://nodejs.org/) versione 18+ installato.
*   Istanza MySQL funzionante.
*   Conoscenze di base su comandi terminal per navigazione dir e npm script.

## 🚀 Avvio rapido (Quickstart)

### Metodo 1: Docker (scelta raccomandata)

1. Aprire il terminale nella root di progetto.
2. Controllare le variabili d'ambiente (nel file `.env.docker` o tramite override `backend/.env`). Assicurarsi di impostare una variabile per `DB_PASSWORD`.
3. Lancia il comando minimo: 
   ```bash
   docker compose up --build
   ```
4. Attendere i log di completamento (il DB esegue inizializzazioni ai primi setup).
*   **Frontend (App):** `http://localhost` (la porta 80 è l'esposizione al client definita sul docker)
*   **Backend (API):** `http://localhost:3010`

### Metodo 2: Avvio Manuale

1. **Database:** Aprire l'istanza locale MySQL. Creare il database ed eseguere `backend/sql/init.sql` come struttura prima di `backend/sql/seed.sql` come popolamento.
2. **Backend:** 
   *   Accedere alla cartella `backend`: `cd backend`
   *   Configurare il file `.env` a partire dal `.env.example`.
   *   Lanciare `npm install` e poi avviare con `npm run dev`.
   *   L'API sarà su `http://localhost:3000`.
3. **Frontend:**
   *   Aprire un nuovo terminale ed accedere alla cartella `cd frontend`
   *   Installare i modoli con `npm install` seguito dall'ambiente di dev `npm run dev`.
   *   Il frontend risponderà tramite Vite su `http://localhost:5173`.

## 📖 Guida Utente (Uso dell'app)

Sia navigando via Docker (`http://localhost`) che via Manuale (`http://localhost:5173`), la via d'accesso alla piattaforma rimane concettualmente identica all'utilizzo. 

1. **Accesso e Registrazione**: È possibile procedere usando i moduli d'iscrizione nell'Homepage, o accedere tramite uno degli utenti pre-caricati col 'seed'.
   * Demo Studente: `diegoandruccioli@studenthub.com`
   * Altri studenti test: `reimici@studenthub.com` / `giovannimorelli@studenthub.com`
   * Profili di Amministrazione: `superadmin@studenthub.com`, `admin@studenthub.com`
   * **Password**: `StudentHubRootPass2025!` (Corrispondente a default bcrypt in db) se non customizzata o prelevabile [DA COMPLETARE: INSERIRE PASSWORD SEED, SE SI PREFERISCE DIVERSA]
2. **Dashboard Carriera:** Sezione adibita all'aggiunta di Esami tramite form interattivi. Vengono gestiti crediti (CFU), data e valutazione, con flag automatizzati per le lodi al 30.
3. **Livelli & Obiettivi:** L'Hub presenta distintivi per livello raggiunto in base ai punti totalizzati. Con ogni esame o sblocchi d'obiettivo (es: prima lode, 90CFU totali) gli XP aumenteranno permettendo il Level-up.

## 🛠 Guida sviluppatori

### Script Node (`package.json`)
Sia per la cartella `frontend` che per la `backend`, si può sfruttare npm per funzioni interne:
*   **Frontend:**
    *   `npm run dev` → Lancia un server Vite ad altissime prestazioni per sviluppo 
    *   `npm run build` → Crea la build produzione compilata
    *   `npm run preview` → Servizio statico web sulla cartella di build generata
*   **Backend:**
    *   `npm run start` → Esegue `ts-node` sul server come runtime immediato
    *   `npm run dev` → Esegue il server `nodemon` che monitora modifiche ed hot-reload TS
    *   `npm run build` → Genera il bundle nativo via compilatore `tsc`

### Struttura Repository
```text
.
├── backend
│   ├── .env / .env.example    # Segreti DB e app, chiavi JWT
│   ├── package.json           # Dipendenze Node, Script npm (ts-node, tsc, express)
│   ├── server.ts              # Entry point primario
│   ├── sql
│   │   ├── init.sql           # Script di creazione struttura MySQL
│   │   └── seed.sql           # Script di inserimento dati fittizi
│   └── src                    # Logiche applicative, server controllers e modelli
├── frontend
│   ├── index.html             # Radice single-page
│   ├── package.json           # Script di build (vite) e Dipendenze GUI (Vue, Chartjs, Axios, Pinia, ecc..)
│   ├── postcss.config.js      # PostCSS config base per Tailwind
│   ├── src                    # Sorgenti GUI, pagine, routing
│   ├── tailwind.config.js     # Variabili stilistiche Tailwind
│   └── vite.config.ts         # Setup module bundler Vite
├── docker-compose.yml         # Regola l'orchestrazione container e i 3 servizi
├── .env                       # File Env base globale
├── .env.docker                # Env usate dal docker root
└── README.md                  # Questo file di documentazione
```

### Troubleshooting
*   **❌ Problema porta 3306/3308 occupata (Docker):** Assicurati che un'installazione di WAMP/XAMPP o un'istanza locale MySQL non siano in esecuzione occupando le porte di sviluppo o che un vecchio pod non l'abbia trattenuta (chiudi/ferma da `docker ps`).
*   **❌ Problemi di CORS API rifiuta traffico:** Re-imposta e rivedi esattamente il prefisso sul field `CORS_ORIGIN`. Per docker la configurazione standard `http://localhost`, controlla si allinei con porta del test e se usi dev è `http://localhost:5173`.
*   **❌ Errori mancato aggiornamento schema o DB non responsivo:** Rilevante in caso modifichiate file `init.sql`. Procedere come documentato cancellando il volume salvato tra le esecuzioni: comando di reset profondo col container db con `docker compose down -v`.
*   **❌ Comando DB non riconosciuto nell'host:** Il comando manuale ping DB va testato sui nodi, tuttavia è preferibile usare comandi internamente da container `docker compose exec db mysql -u root -p`.

## ⚙ Variabili d'ambiente

Configurazioni essenziali estratte dai file d'ambiente e richiamate dal file yml:

| Variabile | Contesto (File) | Descrizione | Esempio / Default | Obbligatoria |
| :--- | :--- | :--- | :--- | :---: |
| `DB_PASSWORD` | Backend & Root Compose | Password root del MySQL | `StudentHubRootPass2025!` | **Sì** |
| `DB_HOST` | Backend (o Compose env) | Indirizzo Host per l'URL Data | `localhost` / `db` | **Sì** |
| `DB_USER` | Backend | User configurato DB | `root` | **Sì** |
| `DB_NAME` | Backend | Schema DataStore | `studenthub_db` | **Sì** |
| `CORS_ORIGIN` | Backend | Restrizione host client su origini Access-Control | `http://localhost:5173` | **Sì** |
| `JWT_ACCESS_SECRET` | Backend | Secret Key per il rilascio dell'Access Jwt token | `0123... ` | **Sì** |
| `JWT_REFRESH_SECRET` | Backend | Secret Key per la convalida dei refresh auth token | `a1b2...` | **Sì** |
| `PORT` | Backend | Node binding port RESTful | `3000` | No |

## 📊 Stato del progetto

| Funzionalità | Stato | Dettaglio / Note |
| :--- | :---: | :--- |
| **Architettura Frontend (Vue + Vite + Tailwind)** | ✅ | Framework pronto. Interfacce responsives completate e componenti agganciabili |
| **Piattaforma Base Backend (Node + Express + TypeScript)** | ✅ | Endpoints base e ORM/Query setup completato |
| **Model DB (MySQL 8.0)** | ✅ | Relazioni definite (utenti -> esami, livelli, impostazioni), Init e Seed implementati |
| **Security, Access & Refresh Token, Auth System**| ✅ | Struttura protettiva JWT, CORS e hashing pass bcrypt operative |
| **Tracking Carriera e Gamification** | ✅ | Calcolo progressivo media, sistema livelli dinamico su soglie e inserimenti testati |
| **Dashboard ChartJS** | ✅ | Componenti statistici integrati sui model API con reattività Vue |
| **Distribuzione via Docker Multi-Service** | ✅ | Containerizzazione di backend, frontend e DB validata tramite compose |

## 📜 Licenza e Crediti

Il progetto è sviluppato per finalità accademiche, corso Ingegneria dei Sistemi Web - UniBo. Rimando alle disposizioni per il copyright sulla repository se previste.

Team:
*   **Diego Andruccioli**
*   **Rei Mici**
*   **Giovanni Morelli**
