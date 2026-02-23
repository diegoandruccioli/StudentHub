# ADR-0001: Scelta dello Stack Tecnologico

**Stato:** Accettato

**Contesto:** 
Il progetto StudentHub richiede lo sviluppo di una piattaforma web moderna, scalabile e manutenibile nel tempo. Era necessario selezionare uno stack tecnologico sia per il frontend che per il backend che garantisse alta produttività, tipizzazione forte per prevenire errori a runtime (come suggerito dai principi di Clean Code sulla robustezza del software) e un ecosistema solido per la gestione di base dati e containerizzazione.

**Decisione:** 
È stato deciso di adottare il seguente ecosistema tecnologico:
- **Backend:** Node.js con Express e TypeScript. Il database sarà MySQL per la persistenza e si utilizzerà Docker per la containerizzazione.
- **Frontend:** Vue 3 (Composition API) con TypeScript e Tailwind CSS.

**Raziocinio:** 
Rispetto all'uso di un paradigma destrutturato o altri linguaggi privi di tipi:
- **TypeScript diffuso ("Meaningful Names" e Sicurezza):** Permette la condivisione di definizioni e interfacce (Data Transfer Objects) tra frontend e backend in maniera naturale. Previene anomalie dovute a passaggi di formati inattesi ("Don't pass null"), rendendo il codice auto-esplicativo e "Self-Documenting".
- **Vue 3:** Con la Composition API offre un'eccellente separazione per Feature, promuovendo il "Single Responsibility Principle" nei componenti.
- **Express + Node.js:** Offrono fondamenta non opinate in cui l'architettura (Clean Architecture) può essere stratificata volontariamente secondo necessità, mantenendo piccole le astrazioni ("Functions should be small").
- **Tailwind CSS:** Incentiva piccoli componenti isolati senza che un foglio di stile globale si tramuti in "Big Ball of Mud", limitando esponenzialmente le dipendenze visive impreviste ("Fragility").

**Conseguenze:**
- **Vantaggi:** Costruzione di un dominio fortemente tipizzato che evita errori infantili a runtime. Il codice si autodescrive maggiormente (eliminando la necessità di vecchi "Bad Comments"). Maggiore produttività a lungo termine grazie all'auto-completamento dell'IDE da ambo i lati in sviluppo.
- **Svantaggi:** Richiesto approccio e setup "scrupoloso" in quanto l'ecosistema Node.js non impone un'architettura rigorosa (come ad esempio Spring Boot o nest.js), necessitando grande disciplina dello sviluppatore.
