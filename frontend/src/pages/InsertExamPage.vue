<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import type { ExamPayload } from '../types'
import IconTrash from '../components/icons/IconTrash.vue'
import IconPlusCircle from '../components/icons/IconPlusCircle.vue'
interface ExamRow {
  nome: string;
  voto: string | number;
  lode: boolean;
  data: string;
  cfu: string | number;
}

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')

const rows = ref<ExamRow[]>([
  { nome: '', voto: '', lode: false, data: '', cfu: '' }
])


watch(rows, (newRows) => {
  newRows.forEach(row => {
    if (row.voto != 30 && row.lode) {
      row.lode = false
    }
  })
}, { deep: true })

const addRow = () => {
  if (rows.value.length < 5) {
    rows.value.push({ nome: '', voto: '', lode: false, data: '', cfu: '' })
  }
}

const removeRow = (index: number) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  } else {
    // Reset first row if it's the only one
    rows.value[0] = { nome: '', voto: '', lode: false, data: '', cfu: '' }
  }
}

const submitExams = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {

    const payload: ExamPayload[] = []
    for (const row of rows.value) {
      if (!row.nome || !row.voto || !row.data || !row.cfu) {
        throw new Error('Compila tutti i campi di tutte le righe.')
      }
      
      const votoNum = Number(row.voto)
      const cfuNum = Number(row.cfu)

      if (votoNum < 18 || votoNum > 30) {
        throw new Error(`Il voto ${row.voto} non è valido (18-30).`)
      }
      if (cfuNum <= 0 || cfuNum > 48) {
        throw new Error(`I CFU ${row.cfu} non sono validi (1-48).`)
      }
      
      payload.push({
        nome: row.nome,
        voto: votoNum,
        lode: row.lode,
        cfu: cfuNum,
        data: row.data
      })
    }


    await api.post('/exams', payload)

    router.push('/career')

  } catch (error: unknown) {
    const axiosMsg = (error as { response?: { data?: { message?: string } } }).response?.data?.message
    errorMsg.value = axiosMsg || (error instanceof Error ? error.message : 'Errore durante il salvataggio.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background-light font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-7xl">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <nav class="text-sm text-gray-500 mb-2 font-medium">
            <router-link to="/home" class="hover:text-primary">Home</router-link> 
            <span class="mx-2">></span>
            <router-link to="/career" class="hover:text-primary">Carriera</router-link> 
            <span class="mx-2">></span>
            <span class="text-primary font-bold">Inserisci Esame</span>
          </nav>
          <h1 class="text-4xl font-bold text-primary mb-2">Nuovo Inserimento</h1>
          <p class="text-xl font-bold text-black">Aggiungi fino a 5 esami contemporaneamente</p>
        </div>

        <button 
          @click="submitExams" 
          :disabled="loading"
          class="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-lg font-bold py-3 px-10 rounded-lg shadow-md transition transform hover:scale-105"
        >
          {{ loading ? 'Salvataggio...' : 'Conferma Inserimento' }}
        </button>
      </div>

      <div v-if="errorMsg" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center font-bold">
        {{ errorMsg }}
      </div>

      <div class="bg-white border-2 border-gray-200 rounded-xl shadow-sm relative">
        
        <div class="grid grid-cols-12 gap-2 md:gap-4 bg-accent text-white font-bold py-4 px-4 text-center items-center text-sm md:text-base rounded-t-xl">
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
                <IconTrash class="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>

            <div class="col-span-4">
              <input v-model="row.nome" type="text" placeholder="Nome Esame" class="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm md:text-base" />
            </div>

            <div class="col-span-2 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <input v-model="row.voto" type="number" min="18" max="30" placeholder="30" class="w-full md:w-20 p-2 text-center border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm md:text-base" />
              <label class="flex items-center cursor-pointer text-xs font-bold text-gray-500 select-none" :class="{'opacity-50 cursor-not-allowed': row.voto != 30}">
                <input 
                  type="checkbox" 
                  v-model="row.lode" 
                  :disabled="row.voto != 30"
                  class="mr-1 accent-primary w-4 h-4 disabled:cursor-not-allowed"
                > L
              </label>
            </div>

            <div class="col-span-3">
              <input v-model="row.data" type="date" class="w-full p-2 text-center border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-gray-600 text-sm md:text-base" />
            </div>

            <div class="col-span-2 flex items-center justify-center relative">
              <input v-model="row.cfu" type="number" min="1" placeholder="6" class="w-full md:w-20 p-2 text-center border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm md:text-base" />
              
              <button 
                v-if="index === rows.length - 1 && rows.length < 5"
                @click="addRow"
                class="absolute -right-3 md:-right-8 text-primary hover:text-primary-dark transition transform hover:scale-110 bg-white rounded-full z-50 shadow-sm"
                title="Aggiungi riga"
              >
                <IconPlusCircle class="h-8 w-8 md:h-10 md:w-10" />
              </button>
            </div>

          </div>
        </div>
      </div>

    </main>

  </div>
</template>