# ADR-0004: Gestione della Sicurezza (Rate Limiting e Zod)

**Stato:** Accettato

**Contesto:** 
Gli endpoint esposti in REST sono bersagli sensibili ad attacchi di sfinimento (DoS/DDoS) e di forza bruta su sistemi di accesso. Assumere dati dal web costudisce sempre pericoli invisibili: l'accettazione "cieca" di payload può deviare su fallimenti disastrosi come injection attack ("Don't Return Null", "Variables/Null Exceptions"). Un controllo non tipizzato sfocia in decine di `if` per sanificare stringhe sparsi nel codice di business.

**Decisione:** 
Messa a sistema di un perimetro duale di validazione:
1. **Rate Limiting:** Applicazione di pacchetti Middleware per la throttolation degli Header basata su limiti ip in Express (es. accessibilità login o ping costanti bloccati). 
2. **Validazione Object Schema (Zod):** Sanificazione tramite pipeline middleware usando Zod. Si intercettano Params, Body, Query e si blocca l'esecuzione ritornando 400 Bad Request molto prima che si invochi il business layer se le proprietà del payload non sono allineate all'esatto tracciato previsto dal Server.

**Raziocinio:** 
Soluzioni del genere risplendono del pattern "Clean Code":
- **Descriptive ed Expressive Code:** Gli schemi sintattici redatti da Zod fungono da "Informative Comments/Documentation", rendendo lampante a colpo d'occhio formato, lunghezza e tipi validi di un'entità di input. Non servono "Bad Comments" per accertarsene.
- **Separation of Concerns and Do One Thing:** I controller riceveranno solo Body che superando Zod saranno stati forzatamente convertiti/riempiti nei tipi previsti. Si tolgono totalmente al Controller e al Service le responsabilità sporche di capire se un'email è lunga 5, manca la "@" o se un ID è malformato.
- **Error Handling robusto ("Try-Catch First"):** Il middleware emetterà automaticamente errori semantici verso il client limitando l'ingegneria del check continuo.

**Conseguenze:**
- **Vantaggi:** Fortificazione globale dell'API su abusi di formato e forza cruda. Il codice interno "può fidarsi" dei DTO che elabora, minimizzando i null check, rendendosi piccolo e aderente alla narrativa logica senza disgiunzioni tediose per sanitizzare dati passati a catena.
- **Svantaggi:** Un livello superiore di CPU overhead consumato in fase di parsing ad ogni singola richiesta. Creazione parallela e costante update degli "Zod Schema" che dovranno esser costantemente allineati agli oggetti TypeScript durante la vita di sviluppo del prodotto.
