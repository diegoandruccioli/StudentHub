<script setup>
import NavBar from '../components/NavBar.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')

const rows = ref([
  { nome: '', voto: '', lode: false, data: '', cfu: '' }
])

const addRow = () => {
  if (rows.value.length < 5) {
    rows.value.push({ nome: '', voto: '', lode: false, data: '', cfu: '' })
  }
}

const removeRow = (index) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  } else {
    rows.value[0] = { nome: '', voto: '', lode: false, data: '', cfu: '' }
  }
}

const submitExams = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    // 1. VALIDAZIONE DATI
    const payload = []
    for (const row of rows.value) {
      if (!row.nome || !row.voto || !row.data || !row.cfu) {
        throw new Error("Compila tutti i campi di tutte le righe.")
      }
      if (row.voto < 18 || row.voto > 30) {
        throw new Error(`Il voto ${row.voto} non è valido (18-30).`)
      }
      if (row.cfu == 0 || row.cfu > 48) {
        throw new Error(`I CFU ${row.cfu} non sono validi (1-48).`)
      }
      
      payload.push({
        nome: row.nome,
        voto: parseInt(row.voto),
        lode: row.lode,
        cfu: parseInt(row.cfu),
        data: row.data
      })
    }

    // 2. INVIO RICHIESTA
    const response = await axios.post('http://localhost:3000/api/exams', payload, { 
      withCredentials: true 
    })

    // --- NUOVA LOGICA GESTIONE BADGE ---
    const nuoviBadge = response.data.nuovi_badge || []

   /* if (nuoviBadge.length > 0) {
      // Costruiamo un messaggio per l'alert
      const nomiBadge = nuoviBadge.map(b => b.nome).join(', ')
      const totaleXpBadge = nuoviBadge.reduce((sum, b) => sum + b.xp_valore, 0)
      
      alert(`🎉 COMPLIMENTI! Hai sbloccato ${nuoviBadge.length} nuovi obiettivi:\n\n${nomiBadge}\n\nHai guadagnato +${totaleXpBadge} XP extra!`)
    } */
    // -----------------------------------

    router.push('/career')

  } catch (error) {
    console.error(error)
    errorMsg.value = error.response?.data?.message || error.message || "Errore durante il salvataggio."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-7xl">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <nav class="text-sm text-gray-500 mb-2 font-medium">
            <router-link to="/career" class="hover:text-[#3b76ad]">Carriera</router-link> 
            <span class="mx-2">></span>
            <span class="text-[#3b76ad] font-bold">Inserisci Esame</span>
          </nav>
          <h1 class="text-4xl font-bold text-[#3b76ad] mb-2">Nuovo Inserimento</h1>
          <p class="text-xl font-bold text-black">Aggiungi fino a 5 esami contemporaneamente</p>
        </div>

        <button 
          @click="submitExams" 
          :disabled="loading"
          class="bg-[#3b76ad] hover:bg-[#2c5a85] disabled:opacity-50 text-white text-lg font-bold py-3 px-10 rounded-lg shadow-md transition transform hover:scale-105"
        >
          {{ loading ? 'Salvataggio...' : 'Conferma Inserimento' }}
        </button>
      </div>

      <div v-if="errorMsg" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center font-bold">
        {{ errorMsg }}
      </div>

      <div class="bg-white border-2 border-gray-200 rounded-xl shadow-sm relative">
        
        <div class="grid grid-cols-12 gap-2 md:gap-4 bg-[#0f3c66] text-white font-bold py-4 px-4 text-center items-center text-sm md:text-base rounded-t-xl">
          <div class="col-span-1"></div>
          <div class="col-span-4 text-left pl-2">Esame</div>
          <div class="col-span-2">Voto</div>
          <div class="col-span-3">Data</div>
          <div class="col-span-2">CFU</div>
        </div>

        <div>
          <div 
            v-for="(row, index) in rows" 
            :key="index" 
            class="grid grid-cols-12 gap-2 md:gap-4 items-center py-4 px-4 border-b border-gray-100 last:border-0 last:rounded-b-xl hover:bg-gray-50 transition relative"
          >
            
            <div class="col-span-1 flex justify-center">
              <button 
                @click="removeRow(index)"
                class="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
                title="Elimina riga"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="col-span-4">
              <input v-model="row.nome" type="text" placeholder="Nome Esame" class="w-full p-2 border border-gray-300 rounded focus:border-[#3b76ad] focus:ring-1 focus:ring-[#3b76ad] outline-none text-sm md:text-base" />
            </div>

            <div class="col-span-2 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <input v-model="row.voto" type="number" min="18" max="30" placeholder="30" class="w-full md:w-20 p-2 text-center border border-gray-300 rounded focus:border-[#3b76ad] focus:ring-1 focus:ring-[#3b76ad] outline-none text-sm md:text-base" />
              <label class="flex items-center cursor-pointer text-xs font-bold text-gray-500 select-none">
                <input type="checkbox" v-model="row.lode" class="mr-1 accent-[#3b76ad] w-4 h-4"> L
              </label>
            </div>

            <div class="col-span-3">
              <input v-model="row.data" type="date" class="w-full p-2 text-center border border-gray-300 rounded focus:border-[#3b76ad] focus:ring-1 focus:ring-[#3b76ad] outline-none text-gray-600 text-sm md:text-base" />
            </div>

            <div class="col-span-2 flex items-center justify-center relative">
              <input v-model="row.cfu" type="number" min="1" placeholder="6" class="w-full md:w-20 p-2 text-center border border-gray-300 rounded focus:border-[#3b76ad] focus:ring-1 focus:ring-[#3b76ad] outline-none text-sm md:text-base" />
              
              <button 
                v-if="index === rows.length - 1 && rows.length < 5"
                @click="addRow"
                class="absolute -right-3 md:-right-8 text-[#3b76ad] hover:text-[#2c5a85] transition transform hover:scale-110 bg-white rounded-full z-50 shadow-sm"
                title="Aggiungi riga"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-10 md:w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>

    </main>

  </div>
</template>