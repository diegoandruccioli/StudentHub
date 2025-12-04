<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">
      
      <div class="mb-8">
        <nav class="text-sm text-gray-500 mb-2 font-medium">
          <router-link to="/home" class="hover:text-[#3b76ad]">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-[#3b76ad] font-bold">Statistiche</span>
        </nav>
        <h1 class="text-4xl font-bold text-[#3b76ad] mb-1">Statistiche</h1>
        <p class="text-xl font-bold text-black">Diamo un'occhiata ai tuoi risultati!</p>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500">
        Caricamento dati...
      </div>

      <div v-else-if="exams.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-gray-200">
        <p class="text-xl text-gray-400 font-bold">Non ci sono ancora dati sufficienti 📉</p>
        <router-link to="/career/insert" class="text-[#3b76ad] underline mt-2 block">Inserisci il tuo primo esame</router-link>
      </div>

      <div v-else>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <div>
              <h3 class="text-xl font-medium text-black">Media Esami</h3>
              <p class="text-4xl font-bold text-black">{{ mediaPonderata }}</p>
            </div>
          </div>

          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <div>
              <h3 class="text-xl font-medium text-black">Base di Laurea</h3>
              <p class="text-4xl font-bold text-black">{{ baseLaurea }}</p>
            </div>
          </div>

        </div>

        <div class="bg-white border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 class="text-2xl font-bold text-black mb-6">Visualizza i tuoi Risultati</h2>
          
          <div class="h-80 w-full">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>

      </div>

    </main>

  </div>
</template>