<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const leaderboard = ref([])
const objectives = ref([])
const errorMsg = ref('')

const fetchData = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const [lbRes, allBadgesRes, myBadgesRes] = await Promise.all([
      axios.get('http://localhost:3000/api/users/leaderboard', { withCredentials: true }),
      axios.get('http://localhost:3000/api/gamification/badges', { withCredentials: true }),
      axios.get('http://localhost:3000/api/gamification/my-badges', { withCredentials: true })
    ])

    leaderboard.value = lbRes.data.leaderboard

    const unlockedIds = new Set(myBadgesRes.data.map(b => b.id_obiettivo))
    objectives.value = allBadgesRes.data.map(badge => ({
      ...badge,
      sbloccato: unlockedIds.has(badge.id)
    }))

  } catch (error) {
    console.error("Errore caricamento dati:", error)
    errorMsg.value = "Impossibile caricare i dati."
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans min-h-screen">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">

      <div class="mb-8">
        <nav class="text-sm text-gray-500 mb-2 font-medium">
          <router-link to="/home" class="hover:text-[#3b76ad]">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-[#3b76ad] font-bold">Obiettivi</span>
        </nav>
        <h1 class="text-4xl font-bold text-[#3b76ad] mb-1">Obiettivi</h1>
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
          <h2 class="text-2xl font-bold text-[#151e2b] mb-4">Classifica Studenti</h2>
          
          <div class="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div class="bg-[#3b76ad] text-white font-bold p-4 flex justify-between items-center">
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
                  <span class="font-bold text-[#151e2b]">
                    {{ user.nome }}
                    <span v-if="user.id === authStore.user?.id" class="text-xs text-[#3b76ad] ml-1">(Tu)</span>
                  </span>
                </div>

                <div class="w-24 text-right font-bold text-[#151e2b]">
                  <span class="text-yellow-500 mr-1">⚡</span>{{ user.xp_totali }}
                </div>
              </div>
            </div>
            
            <div v-if="leaderboard.length === 0" class="p-6 text-center text-gray-500">
              Nessuno in classifica.
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-[#151e2b] mb-4">Obiettivi</h2>
          
          <div class="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div class="bg-[#3b76ad] text-white font-bold p-4 flex justify-between">
              <span class="flex-grow">Obiettivo</span>
              <span class="w-24 text-right">Premio</span>
            </div>

            <div class="divide-y divide-gray-200">
              <div 
                v-for="obj in objectives" 
                :key="obj.id" 
                class="flex items-center p-4 transition"
                :class="obj.sbloccato ? 'bg-white' : 'bg-gray-50 opacity-70'"
              >
                <div class="w-10 text-center font-bold text-2xl" :class="obj.sbloccato ? 'text-green-500' : 'text-gray-300'">
                  {{ obj.sbloccato ? '✔' : obj.id }}
                </div>

                <div class="flex-grow pl-4">
                  <div class="font-bold text-[#151e2b]">{{ obj.nome }}</div>
                  <div class="text-xs text-gray-500">{{ obj.descrizione }}</div>
                </div>

                <div class="w-24 text-right">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-bold"
                        :class="obj.sbloccato ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-200 text-gray-500'">
                    +{{ obj.xp_valore }} xp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </main>

  </div>
</template>