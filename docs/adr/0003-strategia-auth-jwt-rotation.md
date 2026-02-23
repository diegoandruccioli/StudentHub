# ADR-0003: Strategia di Autenticazione (JWT con Rotation)

**Stato:** Accettato

**Contesto:** 
In applicativi containerizzati e scalabili, un sistema classico con sessione su server locale distrugge l'architettura stateless voluta da un contesto su Docker. Al tempo stesso, emettere classici token "perpetui" per l'identity senza misure rigide li esporrebbe al saccheggio mediante vulnerabilità XSS se immagazzinati nel client (`localStorage`).

**Decisione:** 
È stata assunta l'implementazione JSON Web Token (JWT) in un framework a due ingranaggi "Access & Refresh Token Rotation":
1. **Access Token** emesso con validità di breve durata (es. 15 minuti).
2. **Refresh Token** univoco persistito in database per permettere il login silente ma restituito al client tramite un rigido **Cookie HttpOnly, Secure e SameSite**.

**Raziocinio:** 
Si opta per questa linea non banale in quanto:
- **Niente side-effects inattesi e robustezza:** I refresh token limitati al solo cookie protetto neutralizzano fisicamente la sottrazione basata su vector XSS. Se implementati male "Null Pass" si incorrerà in vulnerabilità non palesi; l'architettura esplicita di Rotation, specialmente con Blacklisting del refreshToken appena adoperato, stronca in partenza i malintenzionati rendendo esplicito al DB se un token rubato tenta due ri-utilizzi.
- **Eccezioni, non Error Codes ("Use Exceptions..."):** Lo scenario del 401 Unauthorized diviene l'asse di comunicazione diretto gestito dagli Interceptor del Frontend, portando a funzioni limitate ad un singolo obiettivo ("Do One Thing": il fallimento avvia lo script di rotation senza che il componente GUI principale se ne infastidisca).

**Conseguenze:**
- **Vantaggi:** Sicurezza Enterprise e rispetto dei corollari stateless per container. Le API dei services sono alleggerite da macchinose gestioni stateful che causerebbero dipendenze occulte in test e mock.
- **Svantaggi:** Enorme overhead di complessità nel Front-End per lo sviluppatore che dovrà mantenere e testare logic bugs derivati da fallibili Refresh-Interceptors tra le chiamate di Axios. Comporta persistenza sul DB per tracciare la validità della famiglia dei token.
