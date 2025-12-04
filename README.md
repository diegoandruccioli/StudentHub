# StudentHub

> Piattaforma web gamificata per la gestione della carriera universitaria. Permette di gestire gli esami, visualizzare statistiche (media, proiezione laurea) e sbloccare obiettivi per scalare la classifica XP globale.

## 📋 Descrizione del Progetto

StudentHub è una Web Application progettata per il corso di Ingegneria dei Sistemi Web. L'obiettivo è rendere meno stressante la gestione universitaria applicando principi di **Gamification** e **Data Visualization**.

L'architettura segue il pattern client-server con due entità distinte:
* **Frontend:** Vue.js + Vite + Pinia (State Management).
* **Backend:** Node.js + Express + MySQL.

## 🎨 Mockup & Design

Il design dell'interfaccia utente (UI) e il flusso dell'esperienza utente (UX) sono stati realizzati a cura di **Rei Mici**.

Qui puoi consultare l'evoluzione grafica del progetto:

* 👉 **[Primo Mockup (Pre-revisione)](https://www.canva.com/design/DAG5nGBXND4/Boom0zBj1rBkACGib-mlAg/edit?utm_content=DAG5nGBXND4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)**: La bozza iniziale presentata e discussa in aula con professori e colleghi.
* 👉 **[Mockup Finale (Definitivo)](https://www.canva.com/design/DAG6QVv9ajQ/6sjTh2q4dOybFtLEprm3mQ/edit?utm_content=DAG6QVv9ajQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)**: La versione aggiornata e consolidata in seguito ai feedback ricevuti.

### Anteprima Schermate
| Landing Page | Home Studente |
| :---: | :---: |
| ![Landing]() | ![Home]() |

| Statistiche | Obiettivi & Classifica |
| :---: | :---: |
| ![Statistiche]() | ![Obiettivi]() |

## 🚀 Tecnologie Utilizzate

### Frontend
* **Vue 3** (Composition API)
* **Vite** (Build tool)
* **Tailwind CSS** (Styling & Responsiveness)
* **Chart.js** (Data Visualization)
* **Axios** (HTTP Client)

### Backend
* **Node.js** & **Express**
* **MySQL** (Database Relazionale)
* **JSON Web Token (JWT)** (Autenticazione sicura)
* **Bcrypt** (Hashing password)

### Tools & DevOps
* **Docker** (Containerizzazione)
* **Jest** (Testing TDD)
* **ESLint + Prettier** (Code Quality)

## 📂 Struttura della Repository

Come da Best Practices, la repository è divisa in:
* `/frontend`: Contiene la logica lato client (Vue.js).
* `/backend`: Contiene le API e la logica server-side (Express).

## 🛠 Installazione e Avvio

Per eseguire il progetto in locale, segui questi passaggi:

### Prerequisiti
* Node.js (v18+)
* MySQL Server in esecuzione

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env  # Configura qui le credenziali del DB
npm run dev