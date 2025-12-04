<script setup>
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow flex flex-col items-center justify-center p-4">

      <div class="text-center mb-16">
        <h1 class="text-3xl md:text-4xl font-bold italic mb-4 text-black">
          Lv. 1 - Mago dello Studio
        </h1>
        
        <div class="relative w-64 md:w-80 h-8 bg-[#8e7f96] border-4 border-[#2d2433] rounded-sm mx-auto flex items-center">
          <div class="absolute -left-4 top-1/2 transform -translate-y-1/2">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="#1e40af" stroke="#000" stroke-width="2" class="drop-shadow-md">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
             </svg>
          </div>
          <div class="h-full bg-[#3b76ad] w-1/3 border-r-4 border-[#2d2433]"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
        
        <div @click="router.push('/career')" class="flex flex-col items-center group cursor-pointer">
          <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-[#0f172a] bg-[#1e40af] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="mt-4 text-2xl font-bold text-black group-hover:text-[#1e40af] transition">Carriera</h2>
        </div>

        <div @click="router.push('/stats')" class="flex flex-col items-center group cursor-pointer">
          <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-[#0f172a] bg-[#1e40af] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 class="mt-4 text-2xl font-bold text-black group-hover:text-[#1e40af] transition">Statistiche</h2>
        </div>

        <div @click="router.push('/objectives')" class="flex flex-col items-center group cursor-pointer">
          <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-[#0f172a] bg-[#1e40af] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.933 12.8a1 1 0 00-.933.933M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 12a3 3 0 100 6 3 3 0 000-6z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6a6 6 0 016 6" />
            </svg>
          </div>
          <h2 class="mt-4 text-2xl font-bold text-black group-hover:text-[#1e40af] transition">Obiettivi</h2>
        </div>

      </div>

    </main>



  </div>
</template>