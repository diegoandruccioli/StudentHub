<script setup>
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f0f4f8] font-sans w-full overflow-hidden relative">
    
    <NavBar class="z-20" />

    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <main class="flex-grow flex flex-col items-center justify-center p-6 z-10">

      <div class="text-center mb-16 w-full max-w-lg">
        
        <div class="inline-block bg-white border-4 border-[#151e2b] px-8 py-3 rounded-full shadow-[4px_4px_0px_0px_#151e2b] mb-6 transform -rotate-2 hover:rotate-0 transition duration-300 cursor-default">
          <h1 class="text-2xl md:text-3xl font-black text-[#151e2b] tracking-tight">
            <span class="text-[#3b76ad]">Lv. 1</span> Mago dello Studio
          </h1>
        </div>
        
        <div class="relative w-full h-10 bg-gray-200 border-4 border-[#151e2b] rounded-full mx-auto flex items-center shadow-[4px_4px_0px_0px_#151e2b]">
          
          <div class="absolute -left-6 top-1/2 transform -translate-y-1/2 z-20 drop-shadow-md animate-bounce-slow">
             <svg width="56" height="56" viewBox="0 0 24 24" fill="#ef4444" stroke="#151e2b" stroke-width="2.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
             </svg>
          </div>
          
          <div class="h-full bg-[#3b76ad] rounded-l-full w-1/3 border-r-4 border-[#151e2b] relative overflow-hidden">
             <div class="absolute inset-0 bg-white opacity-20" style="background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent); background-size: 1rem 1rem;"></div>
          </div>
        </div>
        
        <p class="mt-4 text-xs font-black text-[#151e2b] uppercase tracking-widest bg-white/60 inline-block px-3 py-1 rounded-lg backdrop-blur-sm border border-[#151e2b]/10">
          350 / 1000 XP
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl px-4">
        
        <div @click="router.push('/career')" class="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2">
          <div class="absolute inset-0 bg-[#151e2b] rounded-[2.5rem] translate-y-2 translate-x-2 transition-transform group-hover:translate-y-3 group-hover:translate-x-3"></div>
          
          <div class="relative bg-white border-4 border-[#151e2b] rounded-[2.5rem] p-8 flex flex-col items-center justify-center h-full overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative z-10 w-24 h-24 bg-[#3b76ad] border-4 border-[#151e2b] rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
               <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            </div>
            
            <h2 class="relative z-10 text-2xl font-black text-[#151e2b] uppercase tracking-wide group-hover:text-[#3b76ad] transition-colors">Carriera</h2>
            <p class="relative z-10 text-sm font-bold text-gray-400">Il tuo libretto</p>
          </div>
        </div>

        <div @click="router.push('/stats')" class="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2">
          <div class="absolute inset-0 bg-[#151e2b] rounded-[2.5rem] translate-y-2 translate-x-2 transition-transform group-hover:translate-y-3 group-hover:translate-x-3"></div>
          
          <div class="relative bg-white border-4 border-[#151e2b] rounded-[2.5rem] p-8 flex flex-col items-center justify-center h-full overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-full bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

             <div class="relative z-10 w-24 h-24 bg-[#3b76ad] border-4 border-[#151e2b] rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:-rotate-3">
               <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
             </div>
             
             <h2 class="relative z-10 text-2xl font-black text-[#151e2b] uppercase tracking-wide group-hover:text-[#3b76ad] transition-colors">Statistiche</h2>
             <p class="relative z-10 text-sm font-bold text-gray-400">I tuoi numeri</p>
          </div>
        </div>

        <div @click="router.push('/objectives')" class="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2">
          <div class="absolute inset-0 bg-[#151e2b] rounded-[2.5rem] translate-y-2 translate-x-2 transition-transform group-hover:translate-y-3 group-hover:translate-x-3"></div>
          
          <div class="relative bg-white border-4 border-[#151e2b] rounded-[2.5rem] p-8 flex flex-col items-center justify-center h-full overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-full bg-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

             <div class="relative z-10 w-24 h-24 bg-[#3b76ad] border-4 border-[#151e2b] rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                <svg class="w-14 h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                </svg>
             </div>
             
             <h2 class="relative z-10 text-2xl font-black text-[#151e2b] uppercase tracking-wide group-hover:text-[#3b76ad] transition-colors">Obiettivi</h2>
             <p class="relative z-10 text-sm font-bold text-gray-400">Le tue sfide</p>
          </div>
        </div>

      </div>

    </main>

  </div>
</template>

<style scoped>
/* Animazioni "Blob" sfondo */
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

/* Animazione rimbalzo lento per il cuore */
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(-10%); }
  50% { transform: translateY(5%); }
}
</style>