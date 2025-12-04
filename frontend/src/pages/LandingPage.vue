<script setup>
// LandingPage.vue - Logica minimale, tutto layout
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <header class="bg-[#151e2b] text-white py-4 px-8 shadow-md flex items-center">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
        </svg>
        <span class="text-2xl font-bold tracking-wide">StudentHub</span>
      </div>
    </header>

    <main class="flex-grow flex flex-col items-center justify-center text-center px-4 relative">
      
      <h1 class="text-5xl md:text-6xl font-extrabold text-black leading-tight mb-2">
        Il tuo futuro accademico,
      </h1>
      <h1 class="text-5xl md:text-6xl font-extrabold text-[#3b76ad] leading-tight mb-8">
        costruito insieme.
      </h1>

      <p class="text-gray-600 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
        Analizza i tuoi risultati, visualizza le tue statistiche e raggiungi i tuoi obiettivi <br class="hidden md:block">
        <span class="text-[#3b76ad]">con StudentHub</span>. La tua carriera universitaria in un colpo d'occhio
      </p>

      <router-link 
        to="/login" 
        class="bg-[#3b76ad] hover:bg-[#2c5a85] text-white font-bold text-xl py-4 px-12 rounded-xl shadow-lg transition-transform transform hover:scale-105 mb-20"
      >
        Accedi a StudentHub
      </router-link>

      <div class="mt-auto mb-10 text-gray-400 text-xs max-w-5xl mx-auto px-4 leading-relaxed">
        Il sistema Web denominato "StudentHub" è un'opera dell'ingegno a carattere esclusivamente accademico e dimostrativo. 
        Questo progetto è stato ideato, progettato e realizzato integralmente dagli studenti 
        <span class="font-medium">Andruccioli Diego, Mici Rei e Morelli Giovanni</span> 
        dell'Alma Mater Studiorum - Università di Bologna (UniBo).
      </div>

    </main>

  </div>
</template>