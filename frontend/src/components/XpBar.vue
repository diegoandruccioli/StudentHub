<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import type { GamificationStatus } from '../types'
import IconBookOpen from './icons/IconBookOpen.vue'

// Stato reattivo per i dati di gamification
const loading = ref(true)
const gamificationData = ref<GamificationStatus>({
  xp_totali: 0,
  livello: {
    numero: 0,
    nome: 'Caricamento...',
  },
  progress: {
    percentuale: 0,
    xp_mancanti: 0,
    prossima_soglia: 100
  }
})

const progressWidth = computed(() => {
  return `${Math.max(5, gamificationData.value.progress.percentuale)}%`
})

onMounted(async () => {
  try {
    const response = await api.get<GamificationStatus>('/gamification/status')
    gamificationData.value = response.data
  } catch {
    // Fallback silenzioso: mostra stato di default (già inizializzato)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="text-center w-full max-w-2xl">
    
    <h1 class="text-3xl md:text-4xl font-bold italic mb-4 text-secondary">
      <span v-if="loading" class="animate-pulse">Caricamento...</span>
      <span v-else>
        Lv. {{ gamificationData.livello.numero }} - {{ gamificationData.livello.nome }}
      </span>
    </h1>
    
    <div class="relative w-full md:w-3/4 h-8 bg-gray-300 border-4 border-secondary rounded-sm mx-auto flex items-center shadow-lg overflow-visible mt-8">
      
      <div 
        class="absolute top-1/2 transform -translate-y-1/2 z-10 transition-all duration-1000 ease-out"
        :style="{ left: `calc(${progressWidth} - 22px)` }"
      >
      <IconBookOpen width="70" height="70" class="drop-shadow-md" />
    </div>
      
    <div 
        class="h-full bg-primary border-r-4 border-secondary transition-all duration-1000 ease-out"
        role="progressbar"
        :aria-valuenow="gamificationData.progress.percentuale"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Progresso livello: ${gamificationData.progress.percentuale}% — ${gamificationData.xp_totali} XP`"
        :style="{ width: progressWidth }"
      ></div>
    </div>
    
    <p class="mt-4 text-sm font-bold text-gray-600">
      <span v-if="gamificationData.progress.prossima_soglia">
        {{ gamificationData.xp_totali }} / {{ gamificationData.progress.prossima_soglia }} XP
      </span>
      <span v-else class="text-yellow-600">
        Livello Massimo Raggiunto! ({{ gamificationData.xp_totali }} XP)
      </span>
    </p>

  </div>
</template>
