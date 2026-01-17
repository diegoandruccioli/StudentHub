# StudentHub - Piattaforma di Gestione Carriera Universitaria

> **Nota Importante**: Questo file funge da copertina per il progetto. 
> Per la **documentazione completa**, le **specifiche tecniche dettagliate**, l'analisi architettonica e la relazione richiesta dai professori, si prega di fare riferimento al file principale:
> 
> 📄 **[report_studenthub.pdf](./report_studenthub.pdf)**

---

## Introduzione

StudentHub è una piattaforma web interattiva progettata per trasformare la gestione della carriera universitaria in un'esperienza coinvolgente (Gamification). Sviluppato per il corso di **Ingegneria dei Sistemi Web** presso l'Università di Bologna.

## Team di Sviluppo
Progetto realizzato da:
*   **Diego Andruccioli**
*   **Rei Mici**
*   **Giovanni Morelli**

## Avvio

Per avviare il progetto in locale:

### Opzione 1: Docker
```bash
docker compose up --build
```
*   Frontend: `http://localhost:5173`
*   Backend: `http://localhost:3000`

### Opzione 2: Manuale
Requisiti: Node.js v18+, MySQL.

1.  Importare `backend/sql/init.sql` e `backend/sql/seed.sql` nel database MySQL.
2.  Configurare `.env` nella cartella `backend`.
3.  Avviare Backend: `cd backend && npm install && npm run dev`
4.  Avviare Frontend: `cd frontend && npm install && npm run dev`

---
*Per tutti i dettagli approfonditi, vedere il PDF allegato.*
