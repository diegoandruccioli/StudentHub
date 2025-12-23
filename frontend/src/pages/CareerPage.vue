<script setup>
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useSettingsStore } from '../stores/settings'

const router = useRouter()
const settingsStore = useSettingsStore()

const exams = ref([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

// --- GESTIONE FILTRI ---
const filters = ref({
  sortBy: 'data',    // data, voto, cfu
  order: 'DESC',     // ASC, DESC
  year: 'all'        // all, 2025, 2024...
})

const availableYears = ref([])
const currentYear = new Date().getFullYear()
for (let i = 0; i < 5; i++) {
  availableYears.value.push(currentYear - i)
}

// --- STATE PER MENU E MODALI ---
const activeDropdownId = ref(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const examToEdit = ref(null)
const examToDeleteId = ref(null)

// --- FORMATTAZIONE E COLORI ---
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT').format(date)
}

const getBadgeColor = (voto) => {
  const prefs = settingsStore.preferences;
  if (prefs.tema_voti === 'DEFAULT') {
    return 'bg-[#3b76ad] text-white'; 
  }
  if (voto < prefs.rgb_soglia_bassa) return 'bg-red-600 text-white';
  else if (voto >= prefs.rgb_soglia_alta) return 'bg-green-700 text-white';
  else return 'bg-yellow-400 text-black';
}

// --- GESTIONE MENU DROP DOWN ---
const toggleDropdown = (id, event) => {
    event.stopPropagation()
    if (activeDropdownId.value === id) {
        activeDropdownId.value = null
    } else {
        activeDropdownId.value = id
    }
}

const closeDropdowns = () => {
    activeDropdownId.value = null
}

// --- LOGICA MODIFICA ---
const openEditModal = (exam) => {
    // Clone oggetto per non modificare la view mentre edito
    
    // Fix Date Issue: Usa i metodi locali per ottenere la data corretta, evitando shift di fuso orario
    const d = new Date(exam.data);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Convertiamo lode in boolean puro (perché dal db arriva 0 o 1) per il checkbox
    examToEdit.value = { 
        ...exam, 
        data: formattedDate,
        lode: !!exam.lode 
    } 
    showEditModal.value = true
    closeDropdowns()
}

const saveExam = async () => {
    if (!examToEdit.value) return;
    
    // Validazione base
    if (!examToEdit.value.nome || !examToEdit.value.voto || !examToEdit.value.cfu || !examToEdit.value.data) {
        alert("Compila tutti i campi obbligatori");
        return;
    }

    try {
        await axios.put(`http://localhost:3000/api/exams/${examToEdit.value.id}`, examToEdit.value, { withCredentials: true });
        
        showEditModal.value = false;
        successMessage.value = "Esame aggiornato con successo!";
        setTimeout(() => successMessage.value = '', 3000);
        
        fetchExams(); // Ricarica lista per aggiornare XP totali e ordinamento
    } catch (error) {
        console.error("Errore aggiornamento:", error);
        alert(error.response?.data?.message || "Errore durante l'aggiornamento");
    }
}

// --- LOGICA ELIMINAZIONE ---
const confirmDelete = (id) => {
    examToDeleteId.value = id
    showDeleteModal.value = true
    closeDropdowns()
}

const deleteExam = async () => {
    if (!examToDeleteId.value) return;

    try {
        await axios.delete(`http://localhost:3000/api/exams/${examToDeleteId.value}`, { withCredentials: true });
        
        // Rimuovi localmente
        exams.value = exams.value.filter(e => e.id !== examToDeleteId.value);
        
        showDeleteModal.value = false;
        examToDeleteId.value = null;
        successMessage.value = "Esame eliminato!";
        setTimeout(() => successMessage.value = '', 3000);
    } catch (error) {
        console.error("Errore eliminazione:", error);
        alert("Errore durante l'eliminazione");
    }
}


const navigateToInsert = () => {
  router.push('/career/insert')
}

// --- CORE: CHIAMATA AL BACKEND ---
const fetchExams = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/exams', {
      withCredentials: true,
      params: {
        sortBy: filters.value.sortBy,
        order: filters.value.order,
        year: filters.value.year
      }
    })
    exams.value = response.data
  } catch (error) {
    console.error("Errore recupero dati:", error)
    errorMessage.value = "Impossibile caricare i dati."
    if (error.response && error.response.status === 401) {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

// Watcher: Appena cambia un filtro, ricarichiamo gli esami
watch(filters, () => {
  fetchExams()
}, { deep: true })

// Watcher: Se sto modificando e il voto scende sotto 30, tolgo la lode
watch(() => examToEdit.value?.voto, (newVal) => {
    if (newVal < 30 && examToEdit.value?.lode) {
        examToEdit.value.lode = false;
    }
})

onMounted(async () => {
  await settingsStore.fetchSettings()
  fetchExams()
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans" @click="closeDropdowns">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">

      <div class="mb-6">
        <nav class="text-sm text-gray-500 mb-4 font-medium">
          <router-link to="/home" class="hover:text-[#3b76ad]">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-[#3b76ad] font-bold">Carriera</span>
        </nav>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
          <div>
            <h1 class="text-4xl font-bold text-[#3b76ad] mb-2">Carriera</h1>
            <p class="text-xl font-bold text-black">Gestisci e analizza il tuo percorso</p>
          </div>

          <button 
            @click="navigateToInsert"
            class="bg-[#3b76ad] hover:bg-[#2c5a85] text-white text-lg font-bold py-3 px-8 rounded-lg shadow-md transition transform hover:scale-105">
            Inserisci Esame
          </button>
        </div>
      </div>

      <!-- Success Message Alert -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm animate-fade-in-down">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
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
            <select v-model="filters.sortBy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#3b76ad] focus:border-[#3b76ad] p-2.5 outline-none font-medium">
              <option value="data">Data Esame</option>
              <option value="voto">Voto</option>
              <option value="cfu">CFU</option>
            </select>
          </div>

          <div class="flex flex-col w-full md:w-auto">
            <label class="text-xs text-gray-400 font-bold mb-1 ml-1">Ordine</label>
            <select v-model="filters.order" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#3b76ad] focus:border-[#3b76ad] p-2.5 outline-none font-medium">
              <option value="DESC">Decrescente</option>
              <option value="ASC">Crescente</option>
            </select>
          </div>

          <div class="flex flex-col w-full md:w-auto">
            <label class="text-xs text-gray-400 font-bold mb-1 ml-1">Anno Solare</label>
            <select v-model="filters.year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#3b76ad] focus:border-[#3b76ad] p-2.5 outline-none font-medium">
              <option value="all">Tutti gli anni</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{year}}
              </option>
            </select>
          </div>

        </div>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500 text-xl animate-pulse">
        Aggiornamento lista...
      </div>

      <div v-else-if="errorMessage" class="text-center py-10 text-red-500 text-xl font-bold">
        {{ errorMessage }}
      </div>

      <div v-else-if="exams.length === 0" class="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-300">
        <p class="text-2xl text-gray-400 font-bold mb-4">Nessun esame trovato</p>
        <p class="text-gray-500">Prova a cambiare i filtri o inserisci un nuovo esame.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div 
          v-for="exam in exams" 
          :key="exam.id"
          class="bg-white border-[3px] border-black rounded-[2rem] p-6 relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
        >
          <!-- MENU DROPDOWN (Three Dots) -->
          <div class="absolute top-5 right-5 z-10">
              <button 
                  @click="toggleDropdown(exam.id, $event)" 
                  class="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition focus:outline-none bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm"
              >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
              </button>

              <div 
                  v-if="activeDropdownId === exam.id" 
                  class="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden text-left animate-fade-in z-20"
                  @click.stop
              >
                  <div class="py-1">
                      <button 
                          @click="openEditModal(exam)"
                          class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#3b76ad] flex items-center gap-2"
                      >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          Modifica
                      </button>

                      <button 
                          @click="confirmDelete(exam.id)"
                          class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                      >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Elimina
                      </button>
                  </div>
              </div>
          </div>

          <div class="flex justify-between items-start mb-6 pr-10">
            <h3 class="text-2xl font-bold text-black leading-tight w-2/3 break-words pr-2">
              {{ exam.nome }}
            </h3>
            
            <div 
              class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm shrink-0 transition-colors duration-300"
              :class="getBadgeColor(exam.voto)"
            >
              {{ exam.voto }}
              <span v-if="exam.lode" class="text-xs align-top ml-0.5 -mt-2">L</span>
            </div>
          </div>

          <div class="flex justify-between items-end mt-4">
            
            <div class="flex items-center gap-2 text-black font-bold text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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

      <!-- MODALE MODIFICA -->
      <div v-if="showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="showEditModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <h3 class="text-2xl font-bold text-[#3b76ad] mb-6">Modifica Esame</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Nome Esame</label>
                    <input v-model="examToEdit.nome" type="text" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-[#3b76ad] outline-none">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Voto (18-30)</label>
                        <input v-model.number="examToEdit.voto" type="number" min="18" max="30" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-[#3b76ad] outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">CFU</label>
                        <input v-model.number="examToEdit.cfu" type="number" min="1" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-[#3b76ad] outline-none">
                    </div>
                </div>

                <div class="flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="lode" 
                        v-model="examToEdit.lode" 
                        :disabled="examToEdit.voto !== 30"
                        class="w-5 h-5 text-[#3b76ad] rounded focus:ring-[#3b76ad] disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                     <label for="lode" class="text-sm font-bold text-gray-700" :class="{'text-gray-400': examToEdit.voto !== 30}">Lode (Solo con 30)</label>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Data</label>
                    <input v-model="examToEdit.data" type="date" class="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-[#3b76ad] outline-none">
                </div>
            </div>

            <div class="flex gap-3 justify-end mt-8">
                <button @click="showEditModal = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold">Annulla</button>
                <button @click="saveExam" class="px-4 py-2 bg-[#3b76ad] hover:bg-[#2c5c8f] text-white rounded-lg font-bold shadow-md">Salva Modifiche</button>
            </div>
        </div>
      </div>

      <!-- MODALE CONFERMA ELIMINAZIONE -->
      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
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