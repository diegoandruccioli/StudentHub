<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-12 max-w-4xl">
      
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-[#3b76ad] mb-4">Chi Siamo</h1>
        <p class="text-xl text-gray-600">
          Il team di ingegneri dietro <span class="font-bold text-[#151e2b]">StudentHub</span>.
        </p>
      </div>

      <div class="space-y-12">

        <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <h2 class="text-3xl font-bold text-[#151e2b] mb-6">Diego Andruccioli</h2>
          
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-40 h-40 md:w-48 md:h-48 bg-gray-300 rounded-xl flex-shrink-0 overflow-hidden border-4 border-[#3b76ad]">
              <div class="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-200">
                FOTO
              </div>
            </div>
            
            <div class="flex-grow">
              <p class="text-gray-700 text-lg leading-relaxed">
                Studente di Ingegneria e Sistemi Web presso l'Università di Bologna. 
                Appassionato di sviluppo Backend e architetture software. 
                In questo progetto si è occupato principalmente della gestione del database e delle API.
              </p>
              <div class="mt-4 flex gap-4">
                <a href="#" class="text-[#3b76ad] font-bold hover:underline">LinkedIn</a>
                <a href="#" class="text-[#3b76ad] font-bold hover:underline">GitHub</a>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <h2 class="text-3xl font-bold text-[#151e2b] mb-6">Rei Mici</h2>
          
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-40 h-40 md:w-48 md:h-48 bg-gray-300 rounded-xl flex-shrink-0 overflow-hidden border-4 border-[#3b76ad]">
              <div class="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-200">
                FOTO
              </div>
            </div>
            
            <div class="flex-grow">
              <p class="text-gray-700 text-lg leading-relaxed">
                Designer e sviluppatore Frontend del gruppo. Ha curato l'intera User Experience (UX) 
                e l'interfaccia utente (UI), trasformando i mockup in codice Vue.js reattivo.
                Il suo obiettivo è rendere l'università meno stressante con un design pulito.
              </p>
              <div class="mt-4 flex gap-4">
                <a href="#" class="text-[#3b76ad] font-bold hover:underline">LinkedIn</a>
                <a href="#" class="text-[#3b76ad] font-bold hover:underline">GitHub</a>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <h2 class="text-3xl font-bold text-[#151e2b] mb-6">Giovanni Morelli</h2>
          
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-40 h-40 md:w-48 md:h-48 bg-gray-300 rounded-xl flex-shrink-0 overflow-hidden border-4 border-[#3b76ad]">
              <div class="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-200">
                FOTO
              </div>
            </div>
            
            <div class="flex-grow">
              <p class="text-gray-700 text-lg leading-relaxed">
                Full Stack Developer con un focus sull'integrazione dei sistemi. 
                Ha lavorato sulla logica di calcolo delle statistiche e sulla sicurezza dell'autenticazione.
                Sempre pronto a risolvere bug complessi e ottimizzare le performance.
              </p>
              <div class="mt-4 flex gap-4">
                <a href="#" class="text-[#3b76ad] font-bold hover:underline">LinkedIn</a>
                <a href="#" class="text-[#3b76ad] font-bold hover:underline">GitHub</a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </main>

    <footer class="bg-[#151e2b] text-white py-6 mt-auto">
      <div class="flex justify-center space-x-8 text-sm font-medium tracking-wide">
        <router-link to="/about" class="text-[#3b76ad] font-bold cursor-default">Chi Siamo</router-link>
        <a href="#" class="hover:text-[#3b76ad] transition">Contatti</a>
        <a href="#" class="hover:text-[#3b76ad] transition">Privacy</a>
        <a href="#" class="hover:text-[#3b76ad] transition">Termini</a>
      </div>
    </footer>

  </div>
</template>