# StudentHub

## Table of Contents
1. [Introduzione](#introduzione)
2. [Features per Utenti](#features-per-utenti)
3. [Features per Admin e SuperAdmin](#features-per-admin-e-superadmin)
4. [Tecnologie Utilizzate](#tecnologie-utilizzate)
5. [Pacchetti Installati](#pacchetti-installati)
6. [Struttura del Progetto](#struttura-del-progetto)
7. [Installazione](#installazione)
8. [API Endpoints](#api-endpoints)
9. [Database](#database)
10. [Color Accessibility](#color-accessibility)
11. [Documentazione e Mockup](#documentazione-e-mockup)
12. [Team di Sviluppo](#team-di-sviluppo)

---

## Introduzione
StudentHub e una piattaforma web progettata per la gestione della carriera universitaria, sviluppata nell'ambito del corso di Ingegneria dei Sistemi Web presso l'Alma Mater Studiorum - Universita di Bologna.
L'obiettivo principale del progetto e trasformare la classica gestione del libretto universitario in un'esperienza interattiva e coinvolgente, integrando elementi di Gamification e visualizzazione dati avanzata.

Il sistema adotta un'architettura disaccoppiata (Client-Server), garantendo scalabilita e mantenibilita del codice.

---

## Features per Utenti
Gli utenti standard (Studenti) hanno accesso alle seguenti funzionalita:

* **Gestione Carriera**: Possibilita di aggiungere, modificare ed eliminare gli esami sostenuti, specificando voto, crediti (CFU) e data.
* **Dashboard Statistica**: Visualizzazione di grafici interattivi che mostrano l'andamento della media nel tempo, la distribuzione dei voti e la proiezione del voto di laurea.
* **Gamification**: Sistema di progressione basato su Punti Esperienza (XP). Ogni esame superato conferisce XP in base al voto e ai crediti.
* **Badge e Obiettivi**: Sblocco automatico di riconoscimenti (badge) al raggiungimento di determinati traguardi (es. "Primo 30", "Media del 28").
* **Classifica (Leaderboard)**: Possibilita di confrontare il proprio punteggio XP con quello degli altri studenti registrati alla piattaforma.
* **Impostazioni Personalizzate**: Gestione delle preferenze di visualizzazione, inclusa la modifica delle soglie di colore per i voti.

---

## Features per Admin e SuperAdmin
Il sistema prevede ruoli amministrativi con privilegi elevati:

* **Admin**:
    * Accesso alla lista completa degli utenti registrati.
    * **Gestione scalabile**: Sistema di paginazione server-side per gestire migliaia di utenti senza rallentamenti.
    * Visualizzazione di statistiche globali della piattaforma (es. numero totale di esami registrati).
    * Accesso a una classifica globale non anonimizzata.

* **SuperAdmin**:
    * Comprende tutte le funzionalita dell'Admin.
    * Gestione dei ruoli utente (promozione e retrocessione).
    * Eliminazione di account amministrativi.

---

## Tecnologie Utilizzate

### Frontend
Il client e sviluppato utilizzando le seguenti tecnologie:
* **Vue.js** (v3.5.24): Framework progressivo per interfacce utente.
* **Pinia** (v3.0.4): State Management ufficiale e modulare per Vue.js.
* **Vite** (v7.2.4): Build tool di nuova generazione per frontend rapidi.
* **Tailwind CSS** (v4.1.18): Framework CSS utility-first per lo styling.
* **JavaScript (ES6+)**: Logica applicativa.

### Backend
Il server e sviluppato utilizzando:
* **Node.js**: Runtime JavaScript lato server.
* **Express.js** (v4.19.2): Web framework per Node.js.
* **TypeScript** (v5.4.5): Superset tipizzato di JavaScript per una maggiore robustezza del codice.

### Database
* **MySQL**: Database relazionale per la persistenza dei dati.

### Containerizzazione
* **Docker & Docker Compose**: Per l'orchestrazione dell'ambiente di sviluppo.

---

## Pacchetti Installati

Di seguito vengono elencati i principali pacchetti di terze parti utilizzati, con il relativo comando di installazione e descrizione.

### Frontend
Installazione dipendenze: `npm install`

* **axios** (`^1.13.2`)
  Libreria per effettuare richieste HTTP (API Client) verso il backend in modo centralizzato.
* **pinia** (`^3.0.4`)
  Store manager ufficiale per Vue.js, utilizzato per la gestione dello stato globale (es. dati utente, autenticazione).
* **vue-router** (`^4.6.3`)
  Gestore ufficiale del routing per Vue.js, permette la navigazione tra le pagine dell'applicazione (SPA).
* **chart.js** (`^4.5.1`) e **vue-chartjs** (`^5.3.3`)
  Librerie per la creazione di grafici statistici interattivi e responsivi.
* **tailwindcss** (`^4.1.18`) e **@tailwindcss/postcss**
  Motore per la generazione dei fogli di stile utility-first.

### Backend
Installazione dipendenze: `npm install`

* **express** (`^4.19.2`)
  Core framework per la creazione del server web e la gestione delle rotte API.
* **mysql2** (`^3.9.7`)
  Driver client ottimizzato per la connessione e l'interazione con il database MySQL.
* **bcrypt** (`^5.1.1`)
  Libreria per l'hashing sicuro delle password prima del salvataggio nel database.
* **jsonwebtoken** (`^9.0.2`)
  Strumento per la generazione e validazione dei token JWT per l'autenticazione stateless.
* **cors** (`^2.8.5`)
  Middleware per abilitare e configurare il Cross-Origin Resource Sharing.
* **dotenv** (`^16.4.5`)
  Modulo per caricare le variabili d'ambiente da un file `.env` (configurazioni sensibili).
* **cookie-parser** (`^1.4.6`)
  Middleware per analizzare i cookie nelle richieste HTTP.

---

## Struttura del Progetto

```text
StudentHub/
├── backend/                   # Logica Server
│   ├── src/
│   │   ├── config/            # Configurazioni DB e variabili ambiente
│   │   ├── controllers/       # Gestione richieste HTTP (Entry point logico)
│   │   ├── middleware/        # Controlli intermedi (es. Autenticazione)
│   │   ├── routes/            # Definizione degli endpoint API
│   │   ├── services/          # Logica di business e accesso ai dati
│   │   ├── types/             # Definizioni dei tipi TypeScript
│   │   └── utils/             # Funzioni di utilita (es. JWT helper)
│   ├── sql/                   # Script di inizializzazione DB
│   ├── package.json
│   └── server.ts              # Entry point applicazione backend
│
├── frontend/                  # Interfaccia Utente
│   ├── src/
│   │   ├── api/               # Configurazione Client HTTP (Axios)
│   │   ├── assets/            # Risorse statiche
│   │   ├── components/        # Componenti Vue riutilizzabili
│   │   ├── pages/             # Viste principali dell'applicazione
│   │   ├── router/            # Configurazione rotte
│   │   ├── stores/            # Gestione stato (Pinia)
│   │   ├── App.vue            # Componente Root
│   │   ├── main.js            # Entry point applicazione frontend
│   │   └── style.css          # Stili globali e configurazione Tailwind
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml         # Configurazione Container
└── README.md                  # Documentazione progetto
```

---

## Installazione

E possibile avviare il progetto tramite Docker (consigliato per compatibilita universale) o manualmente clonando la repository.

### Metodo 1: Docker (Windows, Mac, Linux)
Requisiti: Docker Desktop installato.

1. Aprire il terminale nella cartella principale del progetto.
2. Eseguire il comando:
   ```bash
   docker compose up --build
   ```
3. Il sistema sara accessibile ai seguenti indirizzi:
   * Frontend: `http://localhost:5173`
   * Backend: `http://localhost:3000`

### Metodo 2: Installazione Manuale

**Prerequisiti**: Node.js v18+, MySQL Server in esecuzione.

1. **Configurazione Database**:
   Eseguire gli script presenti in `backend/sql/` nel proprio client MySQL:
   * Prima `init.sql` (Creazione schema)
   * Poi `seed.sql` (Popolamento dati iniziali)

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Modificare .env con le credenziali del proprio database MySQL locale
   npm run dev
   ```
   
   *Nota: Le regole per l'assegnazione dei badge sono configurabili nel file `backend/src/config/gamificationRules.ts`, permettendo di estendere il sistema di gamification senza modificare la logica core.*

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## API Endpoints

Il backend espone le seguenti API RESTful.

### AUTH
* `POST /api/auth/register`: Registrazione nuovo utente.
* `POST /api/auth/login`: Autenticazione utente.
* `POST /api/auth/logout`: Disconnessione.

### EXAMS
* `GET /api/exams`: Lista esami dell'utente loggato (filtri supportati).
* `POST /api/exams`: Aggiunta di nuovi esami.
* `PUT /api/exams/:id`: Modifica di un esame esistente.
* `DELETE /api/exams/:id`: Rimozione di un esame.

### STATS & USERS
* `GET /api/stats`: Statistiche aggregate (media, base laurea, proiezioni).
* `GET /api/users/leaderboard`: Classifica globale utenti.

### GAMIFICATION
* `GET /api/gamification/status`: Livello e progressi XP correnti.
* `GET /api/gamification/badges`: Catalogo obiettivi disponibili.
* `GET /api/gamification/my-badges`: Obiettivi sbloccati dall'utente.

### SETTINGS
* `GET /api/settings`: Recupero preferenze utente.
* `PUT /api/settings`: Aggiornamento preferenze.

### ADMIN
* `GET /api/admin/users?page=N&limit=N`: Lista utenti paginata (default 20 per pagina). Restituisce anche statistiche globali.
* `PUT /api/admin/users/:id/role`: Modifica ruolo utente.
* `DELETE /api/admin/users/:id`: Eliminazione admin.

---

## Database

Il sistema utilizza un database relazionale MySQL composto dalle seguenti entita:

* **Utenti**: Memorizza credenziali, dati anagrafici e progressi di gamification (XP).
* **Esami**: Memorizza i singoli esami sostenuti, collegati agli utenti. Include vincoli di integrita per i voti.
* **Livelli**: Tabella di configurazione per le soglie di livello basate sugli XP.
* **Obiettivi**: Tabella di configurazione dei badge ottenibili.
* **Obiettivi_Sbloccati**: Tabella di associazione che traccia i badge ottenuti dagli utenti.
* **Impostazioni_Utente**: Memorizza le preferenze di visualizzazione per ogni utente.

---

## Color Accessibility

Il progetto pone attenzione all'accessibilita visiva attraverso l'uso di token semantici definiti nel design system.
Non vengono utilizzati colori hardcoded, ma variabili CSS (es. `--color-primary`, `--color-accent`) che garantiscono coerenza in tutta l'applicazione.
L'utente ha inoltre la possibilita di personalizzare la visualizzazione dei voti tramite le impostazioni, scegliendo tra temi diversi o adattando le soglie cromatiche (es. "Semaforo") alle proprie necessita visive.

---

## Documentazione e Mockup

Di seguito sono riportati i link ai mockup grafici del progetto, che illustrano l'evoluzione dal concept iniziale al prodotto finale.

* **Mockup Iniziale (Concept)**: [Visualizza su Canva](https://www.canva.com/design/DAG5nGBXND4/Boom0zBj1rBkACGib-mlAg/edit?utm_content=DAG5nGBXND4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
* **Mockup Finale (Prodotto)**: [Visualizza su Canva](https://www.canva.com/design/DAG6QVv9ajQ/6sjTh2q4dOybFtLEprm3mQ/edit?utm_content=DAG6QVv9ajQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

## Team di Sviluppo

Progetto realizzato dagli studenti del corso di Ingegneria dei Sistemi Web 2025/2026:

* **Diego Andruccioli**
* **Rei Mici**
* **Giovanni Morelli**
