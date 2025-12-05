<script setup>
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans overflow-hidden">
    
    <NavBar />

    <main class="flex-grow flex flex-col items-center justify-center text-center px-4 relative">
      
      <div class="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute bottom-20 right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div class="z-10 max-w-lg w-full">

        <h1 class="text-9xl font-black text-[#3b76ad] mb-2 drop-shadow-sm tracking-tighter leading-none">404</h1>
        
        <h2 class="text-3xl font-bold text-[#151e2b] mb-4">Ops! Ti sei perso?</h2>
        
        <p class="text-gray-600 text-lg mb-8 leading-relaxed">
          Sembra che tu sia finito in un'aula vuota. <br>
          La pagina che cerchi è stata spostata, cancellata o non è mai esistita.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          
          <router-link 
            to="/home" 
            class="bg-[#3b76ad] hover:bg-[#2c5a85] text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Vai alla Dashboard
          </router-link>

        </div>
      </div>

    </main>
  </div>
</template>