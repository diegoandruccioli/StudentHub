<script setup>
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useSettingsStore } from '../stores/settings' // <--- IMPORTA STORE

const router = useRouter()
const settingsStore = useSettingsStore() // <--- INIZIALIZZA STORE

const exams = ref([])
const loading = ref(true)
const errorMessage = ref('')

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT').format(date)
}

// NUOVA FUNZIONE COLORI COLLEGATA AL DB
const getBadgeColor = (voto) => {
  const prefs = settingsStore.preferences;

  // Se l'utente vuole lo stile Standard
  if (prefs.tema_voti === 'DEFAULT') {
    return 'bg-[#3b76ad] text-white'; 
  }

  // Se l'utente vuole lo stile RGB
  if (voto < prefs.rgb_soglia_bassa) {
    return 'bg-red-500 text-white';
  } else if (voto >= prefs.rgb_soglia_alta) {
    return 'bg-green-600 text-white';
  } else {
    return 'bg-yellow-400 text-black';
  }
}

const navigateToInsert = () => {
  router.push('/career/insert')
}

onMounted(async () => {
  try {
    // Carica le impostazioni e gli esami in parallelo
    await Promise.all([
        settingsStore.fetchSettings(),
        axios.get('http://localhost:3000/api/exams', { withCredentials: true })
    ]).then(([_, responseExams]) => {
        exams.value = responseExams.data
    })
  } catch (error) {
    console.error("Errore recupero dati:", error)
    errorMessage.value = "Impossibile caricare i dati."
    if (error.response && error.response.status === 401) {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">

      <div class="mb-8">
        <nav class="text-sm text-gray-500 mb-4 font-medium">
          <router-link to="/home" class="hover:text-[#3b76ad]">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-[#3b76ad] font-bold">Carriera</span>
        </nav>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-gray-300">
          <div>
            <h1 class="text-4xl font-bold text-[#3b76ad] mb-2">Carriera</h1>
            <p class="text-xl font-bold text-black">Visualizza lo storico dei tuoi esami passati</p>
          </div>

          <button 
            @click="navigateToInsert"
            class="bg-[#3b76ad] hover:bg-[#2c5a85] text-white text-lg font-bold py-3 px-8 rounded-lg shadow-md transition transform hover:scale-105"
          >
            inserisci esame
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500 text-xl">
        Caricamento esami in corso...
      </div>

      <div v-else-if="errorMessage" class="text-center py-10 text-red-500 text-xl font-bold">
        {{ errorMessage }}
      </div>

      <div v-else-if="exams.length === 0" class="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-300">
        <p class="text-2xl text-gray-400 font-bold mb-4">Il tuo libretto è vuoto 🎓</p>
        <p class="text-gray-500">Inizia inserendo il tuo primo esame superato!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div 
          v-for="exam in exams" 
          :key="exam.id"
          class="bg-white border-[3px] border-black rounded-[2rem] p-6 relative hover:shadow-xl transition-shadow"
        >
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-2xl font-bold text-black leading-tight w-2/3 break-words">
              {{ exam.nome }}
            </h3>
            
            <div 
              class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm shrink-0"
              :class="getBadgeColor(exam.voto)"
            >
              {{ exam.voto }}
              <span v-if="exam.lode" class="text-xs align-top ml-0.5 -mt-2">L</span>
            </div>
          </div>

          <div class="flex justify-between items-end mt-4">
            
            <div class="flex items-center gap-2 text-black font-bold text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(exam.data) }}</span>
            </div>

            <div class="text-black font-bold text-2xl">
              {{ exam.cfu }} CFU
            </div>

          </div>
        </div>

      </div>

    </main>

  </div>
</template>