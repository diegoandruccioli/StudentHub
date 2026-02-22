<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import api from '../api/axios'
import { useSettingsStore } from '../stores/settings'
import type { Exam } from '../types'
import IconTrash from '../components/icons/IconTrash.vue'
import IconCheckCircle from '../components/icons/IconCheckCircle.vue'
import ExamTable from '../components/ExamTable.vue'

const router = useRouter()
const settingsStore = useSettingsStore()

const exams = ref<Exam[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')


const filters = ref({
  sortBy: 'data',    // data, voto, cfu
  order: 'DESC',     // ASC, DESC
  year: 'all' as string | number // all, 2025, 2024...
})

const availableYears = ref<number[]>([])
const currentYear = new Date().getFullYear()
for (let i = 0; i < 5; i++) {
  availableYears.value.push(currentYear - i)
}


const showEditModal = ref(false)
const showDeleteModal = ref(false)
const examToEdit = ref<Exam | null>(null)
const examToDeleteId = ref<number | string | null>(null)


// --- LOGICA MODIFICA ---
const openEditModal = (exam: Exam) => {
    // Clone oggetto per non modificare la view mentre edito
    
    // Data: Usa i metodi locali per ottenere la data corretta, evitando shift di fuso orario
    const d = new Date(exam.data);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Converte lode in boolean puro (perché dal db arriva 0 o 1) per il checkbox
    examToEdit.value = { 
        ...exam, 
        data: formattedDate,
        lode: !!exam.lode 
    } 
    showEditModal.value = true
}

const saveExam = async () => {
    if (!examToEdit.value) return;
    
    if (!examToEdit.value.nome || !examToEdit.value.voto || !examToEdit.value.cfu || !examToEdit.value.data) {
        errorMessage.value = 'Compila tutti i campi obbligatori';
        return;
    }

    try {
        await api.put(`/exams/${examToEdit.value.id}`, examToEdit.value);
        
        showEditModal.value = false;
        errorMessage.value = '';
        successMessage.value = 'Esame aggiornato con successo!';
        setTimeout(() => successMessage.value = '', 3000);
        
        fetchExams();
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Errore durante l'aggiornamento";
        const axiosMsg = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
        errorMessage.value = axiosMsg || msg;
    }
}

// --- LOGICA ELIMINAZIONE ---
const confirmDelete = (id: number | string) => {
    examToDeleteId.value = id
    showDeleteModal.value = true
}

const deleteExam = async () => {
    if (!examToDeleteId.value) return;

    try {
        await api.delete(`/exams/${examToDeleteId.value}`);
        
        exams.value = exams.value.filter(e => e.id !== examToDeleteId.value);
        
        showDeleteModal.value = false;
        examToDeleteId.value = null;
        successMessage.value = 'Esame eliminato!';
        setTimeout(() => successMessage.value = '', 3000);
    } catch {
        errorMessage.value = "Errore durante l'eliminazione. Riprova.";
    }
}


const navigateToInsert = () => {
  router.push('/career/insert')
}

// --- CORE: CHIAMATA AL BACKEND ---
const fetchExams = async () => {
  loading.value = true
  try {
    const response = await api.get<Exam[]>('/exams', {
      params: {
        sortBy: filters.value.sortBy,
        order: filters.value.order,
        year: filters.value.year
      }
    })
    exams.value = response.data
    errorMessage.value = ''
  } catch {
    errorMessage.value = 'Impossibile caricare i dati. Riprova più tardi.'
  } finally {
    loading.value = false
  }
}

// Watcher: Appena cambia un filtro, ricarichiamo gli esami
watch(filters, () => {
  fetchExams()
}, { deep: true })

// se sto modificando e il voto scende sotto 30, tolgo la lode
watch(() => examToEdit.value?.voto, (newVal) => {
    if (newVal && newVal < 30 && examToEdit.value?.lode) {
        if (examToEdit.value) {
            examToEdit.value.lode = false;
        }
    }
})

onMounted(async () => {
  await settingsStore.fetchSettings()
  fetchExams()
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-background-light font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">

      <div class="mb-6">
        <nav class="text-sm text-gray-500 mb-4 font-medium">
          <router-link to="/home" class="hover:text-primary">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-primary font-bold">Carriera</span>
        </nav>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
          <div>
            <h1 class="text-4xl font-bold text-primary mb-2">Carriera</h1>
            <p class="text-xl font-bold text-black">Gestisci e analizza il tuo percorso</p>
          </div>

          <button 
            @click="navigateToInsert"
            class="bg-primary hover:bg-primary-dark text-white text-lg font-bold py-3 px-8 rounded-lg shadow-md transition transform hover:scale-105">
            Inserisci Esame
          </button>
        </div>
      </div>

      <!-- Success Message Alert -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm animate-fade-in-down">
          <div class="flex">
            <div class="flex-shrink-0">
              <IconCheckCircle class="h-5 w-5 text-green-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm leading-5 font-medium text-green-800">
                {{ successMessage }}
              </p>
            </div>
          </div>
      </div>

      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div class="text-gray-500 font-bold uppercase text-xs tracking-wider">Filtra & Ordina:</div>

        <div class="flex flex-wrap gap-4 w-full md:w-auto">
          
          <div class="flex flex-col w-full md:w-auto">
            <label class="text-xs text-gray-400 font-bold mb-1 ml-1">Ordina per</label>
            <select v-model="filters.sortBy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 outline-none font-medium">
              <option value="data">Data Esame</option>
              <option value="voto">Voto</option>
              <option value="cfu">CFU</option>
            </select>
          </div>

          <div class="flex flex-col w-full md:w-auto">
            <label class="text-xs text-gray-400 font-bold mb-1 ml-1">Ordine</label>
            <select v-model="filters.order" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 outline-none font-medium">
              <option value="DESC">Decrescente</option>
              <option value="ASC">Crescente</option>
            </select>
          </div>

          <div class="flex flex-col w-full md:w-auto">
            <label class="text-xs text-gray-400 font-bold mb-1 ml-1">Anno Solare</label>
            <select v-model="filters.year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 outline-none font-medium">
              <option value="all">Tutti gli anni</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{year}}
              </option>
            </select>
          </div>

        </div>
      </div>

      <div v-if="errorMessage" class="text-center py-10 text-red-500 text-xl font-bold">
        {{ errorMessage }}
      </div>

      <ExamTable 
        v-else 
        :exams="exams" 
        :loading="loading" 
        @edit="openEditModal" 
        @delete="confirmDelete" 
      />

      <!-- MODALE MODIFICA -->
      <div v-if="showEditModal && examToEdit" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="showEditModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <h3 class="text-2xl font-bold text-primary mb-6">Modifica Esame</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Nome Esame</label>
                    <input v-model="examToEdit.nome" type="text" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-primary outline-none">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Voto (18-30)</label>
                        <input v-model.number="examToEdit.voto" type="number" min="18" max="30" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">CFU</label>
                        <input v-model.number="examToEdit.cfu" type="number" min="1" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-primary outline-none">
                    </div>
                </div>

                <div class="flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="lode" 
                        v-model="examToEdit.lode" 
                        :disabled="examToEdit.voto !== 30"
                        class="w-5 h-5 text-primary rounded focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                     <label for="lode" class="text-sm font-bold text-gray-700" :class="{'text-gray-400': examToEdit.voto !== 30}">Lode (Solo con 30)</label>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Data</label>
                    <input v-model="examToEdit.data" type="date" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-primary outline-none">
                </div>
            </div>

            <div class="flex gap-3 justify-end mt-8">
                <button @click="showEditModal = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold">Annulla</button>
                <button @click="saveExam" class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold shadow-md">Salva Modifiche</button>
            </div>
        </div>
      </div>

      <!-- MODALE CONFERMA ELIMINAZIONE -->
      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <IconTrash class="h-6 w-6 text-red-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Elimina Esame</h3>
            <p class="text-sm text-gray-500 mb-6">Sei sicuro di voler eliminare questo esame? Questa azione è irreversibile.</p>
            
            <div class="flex gap-3 justify-center">
                <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold">Annulla</button>
                <button @click="deleteExam" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md">Elimina</button>
            </div>
        </div>
      </div>

    </main>

  </div>
</template>