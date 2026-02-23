# ADR-0002: Pattern Architetturale (Layer Logic)

**Stato:** Accettato

**Contesto:** 
Costruire la logica applicativa del backend senza una separazione delle responsabilità porta rapidamente alla stesura di "God Classes" o funzioni monolitiche ("Rigidity", "Immobility"). Molto spesso i controller finiscono per racchiudere query SQL dirette, logica di calcolo del dominio e gestione degli Header HTTP tutto al loro interno, violando esplicitamente i principi di "Do One Thing" e "Single Responsibility".

**Decisione:** 
È stata adottata un'architettura a strati stretti (Layered Architecture, tipico primo approccio alla Clean Architecture):
1. **Controller Layer:** Deve occuparsi esclusivamente della gestione del framework HTTP (Express); decodifica "req", invoca l'astrazione successiva e definisce il codice HTTP di ritorno "res".
2. **Service Layer:** Ospita il cuore logico ("Business Logic") dell'applicazione ("Data Abstraction"). Qui giacciono le regole specifiche senza alcuna nozione su quale protocollo le abbia invocate o in che formato vengano salvate.
3. **Repository Layer (DAL - Data Access Layer):** È l'unica entità delegata a parlare col database MySQL. Incapsula tutte le logiche di query verso il persistente.

**Raziocinio:** 
Questa decisione massimizza la modularità in perfetto allineamento concettuale con "Clean Architecture" e le regole sui tipi di Robert C. Martin:
- **The Stepdown Rule / Dependency Rule:** I flussi logici diventano chiari top-to-bottom. Il controller conosce i Service, ma i Service non conoscono i Controller.
- **Isolamento per i test (F.I.R.S.T. Principles):** Isolare i ruoli rende i Service puri. Test e validazioni del core si possono effettuare passandogli Repository finti (Mock), abbattendo e rendendo "Fast" i tempi dei task di Unit Test.
- **Law of Demeter:** I Controller non richiedono all'oggetto di manipolare i livelli bassi `const x = db.query(...).get...()`, ma richiamano funzioni denotate dal solo nome intenzionale `userService.login()`.

**Conseguenze:**
- **Vantaggi:** Manutenibilità altissima e propensione all'immediata leggibilità (il codice risulta come una news article - The Newspaper Metaphor). Se il ORM o DB dovesse cambiare, va toccato solo un raggio circoscritto di file senza colpire i layer superiori.
- **Svantaggi:** Richiede la scrittura boilerplate di una serie di iterazioni (triplicando il numero dei file in uso, es: `UserController`, `UserService`, `UserRepository`) anche quando l'azione risulta un minuscolo CRUD di base.
