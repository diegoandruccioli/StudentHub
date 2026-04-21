<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useGamificationStore } from '../stores/gamification'
import type { User } from '../types'
import ObjectiveCard from '../components/ObjectiveCard.vue'

const authStore = useAuthStore()
const gamificationStore = useGamificationStore()
const loading = ref(true)
const leaderboard = ref<User[]>([])
const errorMsg = ref('')

const fetchData = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const lbRes = await api.get<{ leaderboard: User[] }>('/users/leaderboard')
    leaderboard.value = lbRes.data.leaderboard

    await gamificationStore.fetchBadges()
  } catch {
    errorMsg.value = 'Impossibile caricare i dati.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-background-light font-sans min-h-screen">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">

      <div class="mb-8">
        <nav class="text-sm text-gray-500 mb-2 font-medium">
          <router-link to="/home" class="hover:text-primary">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-primary font-bold">Obiettivi</span>
        </nav>
        <h1 class="text-4xl font-bold text-primary mb-1">Obiettivi</h1>
        <p class="text-xl font-bold text-black">Completa le sfide e competi con gli altri studenti</p>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-500">
        Caricamento in corso...
      </div>

      <div v-else-if="errorMsg" class="text-center py-12 text-red-600 font-bold">
        {{ errorMsg }}
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        <div>
          <h2 class="text-2xl font-bold text-secondary mb-4">Classifica Studenti</h2>
          
          <div class="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div class="bg-primary text-white font-bold p-4 flex justify-between items-center">
              <span class="w-10 text-center">#</span>
              <span class="flex-grow pl-4">Studente</span>
              <span class="w-20 text-right">XP</span>
            </div>

            <div class="divide-y divide-gray-200">
              <div 
                v-for="(user, index) in leaderboard" 
                :key="user.id" 
                class="flex items-center p-4 hover:bg-gray-50 transition"
                :class="{'bg-blue-50': user.id === authStore.user?.id}"
              >
                <div class="w-10 text-center font-black text-lg" 
                >
                  {{ index + 1 }}.
                </div>

                <div class="flex-grow pl-4 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                    <img :src="`https://api.dicebear.com/7.x/initials/svg?seed=${user.nome}`" class="w-full h-full object-cover" />
                  </div>
                  <span class="font-bold text-secondary">
                    {{ user.nome }}
                    <span v-if="user.id === authStore.user?.id" class="text-xs text-primary ml-1">(Tu)</span>
                  </span>
                </div>

                <div class="w-24 text-right font-bold text-secondary">
                  <span class="text-black-500 mr-1">{{ user.xp_totali }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="leaderboard.length === 0" class="p-6 text-center text-gray-500">
              Nessuno in classifica.
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-secondary mb-4">Obiettivi</h2>
          
          <div class="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div class="bg-primary text-white font-bold p-4 flex justify-between">
              <span class="flex-grow">Obiettivo</span>
              <span class="w-24 text-right">Premio</span>
            </div>

            <div class="p-4 space-y-4">
              <ObjectiveCard 
                v-for="obj in gamificationStore.badgesWithUnlockStatus" 
                :key="obj.id" 
                :badge="obj" 
              />
            </div>
          </div>
        </div>

      </div>

    </main>

  </div>
</template>