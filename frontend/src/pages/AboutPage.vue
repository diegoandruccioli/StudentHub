<script setup>
import NavBar from '../components/NavBar.vue' // Se vuoi la navbar utente
// Se non vuoi la NavBar utente ma solo l'header statico, rimuovi l'import
</script>

<template>
  <div class="flex-grow flex flex-col font-sans">
  

    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-12 max-w-4xl">
      
      <div class="mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-[#3b76ad] transition font-bold text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna alla Home
        </router-link>
      </div>

      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-[#3b76ad] mb-4">Chi Siamo</h1>
        <p class="text-xl text-gray-600">
          Il team di sviluppo dietro <span class="font-bold text-[#151e2b]">StudentHub</span>.
        </p>
      </div>

      <div class="space-y-12">
        
        <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <h2 class="text-3xl font-bold text-[#151e2b] mb-6">Diego Andruccioli</h2>
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-32 h-32 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-[#3b76ad] text-[#3b76ad] font-bold text-2xl">
              DA
            </div>
            <div class="flex-grow">
              <p class="text-gray-700 text-lg leading-relaxed">
                Backend Specialist & Database Architect. Si è occupato della progettazione del database MySQL, 
                delle API RESTful con Express e della logica di gestione dei dati lato server.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <h2 class="text-3xl font-bold text-[#151e2b] mb-6">Rei Mici</h2>
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-32 h-32 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-[#3b76ad] text-[#3b76ad] font-bold text-2xl">
              RM
            </div>
            <div class="flex-grow">
              <p class="text-gray-700 text-lg leading-relaxed">
                Frontend Developer & UI/UX Designer. Ha curato l'interfaccia utente, i mockup grafici 
                e l'implementazione dei componenti Vue.js per garantire un'esperienza utente fluida.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <h2 class="text-3xl font-bold text-[#151e2b] mb-6">Giovanni Morelli</h2>
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-32 h-32 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-[#3b76ad] text-[#3b76ad] font-bold text-2xl">
              GM
            </div>
            <div class="flex-grow">
              <p class="text-gray-700 text-lg leading-relaxed">
                Full Stack Developer & Security. Ha lavorato sull'integrazione tra frontend e backend, 
                sulla sicurezza dell'autenticazione (JWT) e sulle funzionalità di Gamification.
              </p>
            </div>
          </div>
        </div>

      </div>

    </main>
  </div>
</template>