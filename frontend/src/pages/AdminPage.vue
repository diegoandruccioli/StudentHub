<script setup>
import NavBar from '../components/NavBar.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import UserTableList from '../components/UserTableList.vue'
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isAdminSuper = computed(() => authStore.user?.ruolo === '2')

const users = ref([])
const loading = ref(true)
const actionLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const searchQuery = ref('')
const totalUsersCount = ref(0) 
const totalStudentsCount = ref(0)
const totalAdminsCount = ref(0)

// --- PAGINATION STATE ---
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = ref(20)

// --- MODAL STATE ---
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const pendingAction = ref(null)

const openConfirmModal = (title, message, action) => {
    modalTitle.value = title
    modalMessage.value = message
    pendingAction.value = action
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    pendingAction.value = null
}

const confirmAction = async () => {
    if (pendingAction.value) {
        await pendingAction.value()
    }
    closeModal()
}

// --- DATA FETCHING ---
const fetchUsers = async (page = 1) => {
    loading.value = true
    try {
        const response = await api.get(`/admin/users?page=${page}&limit=${itemsPerPage.value}`)
        
        // Risposta paginata: { data: [], meta: { ... } }
        users.value = response.data.data
        
        // Metadata globali
        totalUsersCount.value = response.data.meta.totalItems
        totalStudentsCount.value = response.data.meta.totalStudents
        totalAdminsCount.value = response.data.meta.totalAdmins
        
        totalPages.value = response.data.meta.totalPages
        currentPage.value = response.data.meta.currentPage
        
    } catch (error) {
        console.error("Errore admin:", error)
        errorMessage.value = "Accesso Negato o Errore Server."
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setTimeout(() => router.push('/home'), 2000)
        }
    } finally {
        loading.value = false
    }
}

const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value) {
        fetchUsers(newPage)
    }
}

// ... action handlers ...

// --- COMPUTED PROPERTIES PER LE STATISTICHE ---
// Ora usiamo i dati reali dal backend, indipendentemente dalla pagina corrente
const totalUsers = computed(() => totalUsersCount.value) 
const totalStudents = computed(() => totalStudentsCount.value)
const totalAdmins = computed(() => totalAdminsCount.value)

// --- FILTRO RICERCA ---
// La ricerca lato client funziona solo sulla pagina corrente.
// Se si vuole ricerca globale, bisogna implementarla lato backend (es. /api/admin/users?search=...).
// Manteniamo il filtro client-side per ora sulla pagina corrente.
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.nome.toLowerCase().includes(query) || 
    user.cognome.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// --- CARICAMENTO DATI ---
onMounted(() => {
    fetchUsers(1)
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-background-light font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-7xl">
      
      <div class="mb-8">
        <nav class="text-sm text-gray-500 mb-2 font-medium">
          <router-link to="/home" class="hover:text-primary">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-primary font-bold">Dashboard Admin</span>
        </nav>
        <div class="flex flex-col md:flex-row justify-between items-end border-b border-gray-300 pb-4 gap-4">
          <div>
            <h1 class="text-4xl font-bold text-secondary">Gestione Utenti</h1>
            <p class="text-gray-600 mt-1">Pannello di controllo per la gestione degli iscritti alla piattaforma.</p>
          </div>
          
          <div class="relative w-full md:w-72">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cerca utente..." 
              class="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            >
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-gray-500">Caricamento dati in corso...</p>
      </div>

      <div v-else-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm mb-8">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <p class="text-red-700 font-bold">{{ errorMessage }}</p>
        </div>
      </div>

      <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg shadow-sm mb-8 animate-fade-in-down">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <p class="text-green-700 font-bold">{{ successMessage }}</p>
        </div>
      </div>

      <div v-else>
      
        <!-- Statistiche Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div class="p-3 bg-blue-50 rounded-full text-primary">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Utenti Totali</p>
              <p class="text-3xl font-bold text-gray-800">{{ totalUsers }}</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div class="p-3 bg-purple-50 rounded-full text-purple-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Studenti</p>
              <p class="text-3xl font-bold text-gray-800">{{ totalStudents }}</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div class="p-3 bg-green-50 rounded-full text-green-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Admin</p>
              <p class="text-3xl font-bold text-gray-800">{{ totalAdmins }}</p>
            </div>
          </div>
        </div>

        <!-- Tabella Utenti Refactored -->
        <UserTableList 
            :users="filteredUsers" 
            :is-admin-super="isAdminSuper" 
            :search-query="searchQuery"
            :current-page="currentPage"
            :total-pages="totalPages"
            @update-role="handleUpdateRole"
            @delete-user="handleDeleteUser"
            @change-page="handlePageChange"
        />
        
        <p class="text-xs text-gray-400 mt-4 text-right">
          * La lista mostra tutti gli utenti registrati nel sistema StudentHub.
        </p>

      </div>
      
      <!-- Modal Refactored -->
      <ConfirmModal 
        :show="showModal"
        :title="modalTitle"
        :message="modalMessage"
        @confirm="confirmAction"
        @cancel="closeModal"
      />

    </main>
  </div>
</template>