<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <div class="flex-grow flex flex-col font-sans">
    
    <header class="bg-[#151e2b] text-white py-4 px-8 shadow-md flex items-center">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
        </svg>
        <span class="text-2xl font-bold tracking-wide">StudentHub</span>
      </div>
    </header>    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-12 max-w-4xl">
      
      <div class="mb-10 border-b border-gray-300 pb-6">
        <h1 class="text-4xl font-extrabold text-[#3b76ad] mb-2">Privacy Policy</h1>
        <p class="text-gray-600">Ultimo aggiornamento: 04 Dicembre 2025</p>
      </div>

      <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm text-gray-700 leading-relaxed space-y-6">
        
        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">1. Introduzione</h2>
          <p>
            Benvenuto su <strong>StudentHub</strong>. La tua privacy è importante per noi. 
            Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali 
            durante l'utilizzo della nostra applicazione web universitaria.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">2. Dati Raccolti</h2>
          <p class="mb-2">Raccogliamo solo i dati necessari per fornire il servizio:</p>
          <ul class="list-disc list-inside space-y-1 ml-4">
            <li>Dati di registrazione (Nome, Cognome, Email, Password criptata).</li>
            <li>Dati accademici (Esami superati, Voti, CFU, Date).</li>
            <li>Log tecnici di accesso e utilizzo della piattaforma.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">3. Finalità del Trattamento</h2>
          <p>
            I dati vengono utilizzati esclusivamente per:
          </p>
          <ul class="list-disc list-inside space-y-1 ml-4">
            <li>Permettere l'accesso all'area riservata.</li>
            <li>Calcolare statistiche sulla carriera (Media, Base di Laurea).</li>
            <li>Gestire il sistema di Gamification (Livelli, XP, Obiettivi).</li>
          </ul>
          <p class="mt-2 text-sm italic text-gray-500">
            * I tuoi dati non verranno mai venduti a terzi o utilizzati per scopi pubblicitari.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">4. Sicurezza</h2>
          <p>
            Adottiamo misure di sicurezza adeguate per proteggere i tuoi dati, tra cui l'hashing delle password 
            (tramite Bcrypt) e l'uso di token sicuri (JWT) per l'autenticazione.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-3">5. Contatti</h2>
          <p>
            Per qualsiasi domanda riguardante questa informativa, puoi contattare il team di sviluppo alla pagina 
            <router-link to="/contact" class="text-[#3b76ad] font-bold hover:underline">Contatti</router-link>.
          </p>
        </section>

      </div>

    </main>



  </div>
</template>