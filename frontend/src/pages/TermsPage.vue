<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-12 max-w-4xl">
      
      <div class="mb-10 border-b border-gray-300 pb-6">
        <h1 class="text-4xl font-extrabold text-[#3b76ad] mb-2">Termini e Condizioni</h1>
        <p class="text-gray-600">Ultimo aggiornamento: 04 Dicembre 2025</p>
      </div>

      <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm text-gray-700 leading-relaxed space-y-6">
        
        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">1. Natura del Servizio</h2>
          <p>
            <strong>StudentHub</strong> è un'applicazione web sviluppata esclusivamente a scopo didattico 
            per il corso di <em>Ingegneria dei Sistemi Web</em> presso l'Università di Bologna. 
            Non è un servizio ufficiale dell'ateneo e non ha valore legale per la certificazione della carriera.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">2. Account Utente</h2>
          <p>
            Per utilizzare il servizio è necessario creare un account. L'utente è responsabile della 
            riservatezza delle proprie credenziali (email e password). Il team di sviluppo non è responsabile 
            per eventuali perdite di dati o accessi non autorizzati derivanti da una cattiva gestione delle credenziali.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">3. Uso Consentito</h2>
          <p>
            L'utente si impegna a utilizzare la piattaforma in modo lecito. È vietato:
          </p>
          <ul class="list-disc list-inside space-y-1 ml-4">
            <li>Tentare di violare la sicurezza del sistema (SQL Injection, XSS, ecc.).</li>
            <li>Utilizzare script automatizzati per raccogliere dati (Scraping).</li>
            <li>Inserire dati falsi o offensivi.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">4. Proprietà Intellettuale</h2>
          <p>
            Il codice sorgente, il design e i contenuti originali di StudentHub sono proprietà intellettuale 
            degli studenti <strong>Diego Andruccioli, Rei Mici e Giovanni Morelli</strong>. 
            È concesso l'uso del codice per scopi accademici previa citazione degli autori.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">5. Limitazione di Responsabilità</h2>
          <p>
            Il servizio è fornito "così com'è" (AS IS). Non garantiamo che l'applicazione sia priva di bug 
            o interruzioni. Non siamo responsabili per eventuali discrepanze tra i voti visualizzati qui 
            e quelli ufficiali su AlmaEsami.
          </p>
        </section>

      </div>

    </main>

    

  </div>
</template>