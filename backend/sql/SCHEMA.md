# 🗄️ Schema Database: studenthub_db

Documentazione strutturale e vincoli del database MySQL per il progetto StudentHub.

---

## 1. Tabella `utenti`
Contiene le informazioni di accesso e il profilo base degli studenti e amministratori.

* **id** (`INT`)
  * 🔑 **Primary Key**, Auto Increment
* **email** (`VARCHAR 255`)
  * 🛑 **Vincolo UNIQUE**: Non possono esistere due email uguali.
  * *Not Null*
* **password** (`VARCHAR 255`)
  * Hashata (non salvata in chiaro).
  * *Not Null*
* **nome** (`VARCHAR 100`)
  * *Not Null*
* **cognome** (`VARCHAR 100`)
  * *Not Null*
* **ruolo** (`ENUM`)
  * Valori permessi: `'0'` (Studente), `'1'` (Admin), `'2'` (SuperAdmin).
  * **Default**: `'0'`
* **xp_totali** (`INT`)
  * **Default**: `0`
  * *Not Null*
* **created_at** (`TIMESTAMP`)
  * **Default**: `CURRENT_TIMESTAMP` (Data creazione account automatica).

---

## 2. Tabella `livelli` (Lookup Table)
Tabella di riferimento per calcolare il livello in base agli XP.
Non ha chiavi esterne fisiche, viene interrogata tramite logica `BETWEEN` nel backend.

* **id** (`INT`)
  * 🔑 **Primary Key**, Auto Increment
* **numero** (`INT`)
  * *Not Null* (es. 1, 2, 3...)
* **nome** (`VARCHAR 50`)
  * *Not Null* (es. "Novizio", "Esperto")
* **descrizione** (`VARCHAR 255`)
  * *Opzionale*
* **xp_min** (`INT`)
  * *Not Null* (Soglia minima per entrare nel livello)
* **xp_max** (`INT`)
  * *Nullable* (Se `NULL`, indica "infinito" per l'ultimo livello raggiungibile)

---

## 3. Tabella `esami`
Contiene il libretto universitario digitale dello studente.

* **id** (`INT`)
  * 🔑 **Primary Key**, Auto Increment
* **id_utente** (`INT`)
  * 🔗 **Foreign Key** su `utenti(id)`
  * 🗑️ **On Delete Cascade**: Se l'utente viene eliminato, si cancellano i suoi esami.
* **nome** (`VARCHAR 100`)
  * *Not Null*
* **voto** (`INT`)
  * ⚠️ **Check**: Il voto deve essere compreso tra 18 e 30 (`voto >= 18 AND voto <= 30`).
  * *Not Null*
* **lode** (`BOOLEAN`)
  * **Default**: `FALSE` (0)
* **cfu** (`INT`)
  * *Not Null*
* **data** (`DATE`)
  * *Not Null*
* **xp_guadagnati** (`INT`)
  * **Default**: `0` (Calcolati lato backend prima dell'inserimento).
* **created_at** (`TIMESTAMP`)
  * **Default**: `CURRENT_TIMESTAMP`

---

## 4. Tabella `obiettivi`
Catalogo di tutti i badge/obiettivi disponibili nel sistema.

* **id** (`INT`)
  * 🔑 **Primary Key**, Auto Increment
* **nome** (`VARCHAR 100`)
  * *Not Null*
* **descrizione** (`TEXT`)
  * *Opzionale*
* **xp_valore** (`INT`)
  * *Not Null* (Punti XP assegnati al completamento).

---

## 5. Tabella `obiettivi_sbloccati` (Ponte Molti-a-Molti)
Collega gli utenti agli obiettivi che hanno completato.

* **id_utente** (`INT`)
  * 🔗 **Foreign Key** su `utenti(id)`
  * 🗑️ **On Delete Cascade**
* **id_obiettivo** (`INT`)
  * 🔗 **Foreign Key** su `obiettivi(id)`
  * 🗑️ **On Delete Cascade**
* **data_conseguimento** (`DATE`)
  * *Not Null*

> **Nota Tecnica:** Questa tabella usa una **Primary Key Composta** `(id_utente, id_obiettivo)` per impedire fisicamente che lo stesso utente possa ottenere lo stesso obiettivo più di una volta.

---

## 6. Tabella `impostazioni_utente` (Relazione 1-a-1)
Gestisce le preferenze di visualizzazione dell'interfaccia.
Ogni utente ha esattamente una riga in questa tabella.

* **id_utente** (`INT`)
  * 🔑 **Primary Key** & 🔗 **Foreign Key** su `utenti(id)`
  * 🗑️ **On Delete Cascade**
* **tema_voti** (`ENUM`)
  * Valori: `'DEFAULT'` (Cerchio blu), `'RGB'` (Semaforo)
  * **Default**: `'DEFAULT'`
* **rgb_soglia_bassa** (`INT`)
  * **Default**: `18`
  * ⚠️ **Check**: Deve essere tra 18 e 30.
  * Logica: I voti *minori* di questo numero saranno visualizzati in ROSSO.
* **rgb_soglia_alta** (`INT`)
  * **Default**: `27`
  * ⚠️ **Check**: Deve essere tra 18 e 30.
  * Logica: I voti *maggiori o uguali* a questo numero saranno visualizzati in VERDE.
  * (I voti compresi tra le due soglie saranno GIALLI).

> **Vincoli di Coerenza:**
* `CONSTRAINT chk_soglie`: Assicura che `rgb_soglia_bassa <= rgb_soglia_alta`.

---

## 7. Automazione (Triggers)

### Trigger: `after_utente_insert`
* **Evento**: `AFTER INSERT ON utenti`
* **Azione**: Crea automaticamente una riga nella tabella `impostazioni_utente` per il nuovo utente.
* **Scopo**: Garantisce che ogni nuovo utente registrato abbia immediatamente le impostazioni di default senza dover scrivere codice aggiuntivo nel backend.