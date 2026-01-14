<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import UserTableList from '../components/UserTableList.vue'
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { User } from '../types'
import IconExclamation from '../components/icons/IconExclamation.vue'
import IconCheckMark from '../components/icons/IconCheckMark.vue'
import IconUsersGroup from '../components/icons/IconUsersGroup.vue'
import IconAcademicCap from '../components/icons/IconAcademicCap.vue'
import IconShieldCheck from '../components/icons/IconShieldCheck.vue'

const router = useRouter()
const authStore = useAuthStore()
const isAdminSuper = computed(() => authStore.user?.ruolo === '2')

const users = ref<User[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

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
const pendingAction = ref<(() => Promise<void>) | null>(null)

const openConfirmModal = (title: string, message: string, action: () => Promise<void>) => {
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
        const response = await api.get<{ data: User[], meta: any }>(`/admin/users?page=${page}&limit=${itemsPerPage.value}`)
        
        // Risposta paginata: { data: [], meta: { ... } }
        users.value = response.data.data
        
        // Metadata globali
        totalUsersCount.value = response.data.meta.totalItems
        totalStudentsCount.value = response.data.meta.totalStudents
        totalAdminsCount.value = response.data.meta.totalAdmins
        
        totalPages.value = response.data.meta.totalPages
        currentPage.value = response.data.meta.currentPage
        
    } catch (error: any) {
        console.error("Errore admin:", error)
        errorMessage.value = "Accesso Negato o Errore Server."
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setTimeout(() => router.push('/home'), 2000)
        }
    } finally {
        loading.value = false
    }
}

const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages.value) {
        fetchUsers(newPage)
    }
}

// Handler Actions from UserTableList
const handleUpdateRole = async (user: User, newRole: string) => {
  openConfirmModal(
    'Conferma Modifica Ruolo',
    `Sei sicuro di voler cambiare il ruolo di ${user.nome} ${user.cognome}?`,
    async () => {
        try {
            await api.put(`/admin/users/${user.id}/role`, { nuovo_ruolo: newRole })
            successMessage.value = "Ruolo aggiornato con successo"
            setTimeout(() => successMessage.value = '', 3000)
            fetchUsers(currentPage.value)
        } catch (error) {
            console.error(error)
            errorMessage.value = "Errore durante l'aggiornamento del ruolo"
        }
    }
  )
}

const handleDeleteUser = async (user: User) => {
  openConfirmModal(
    'Conferma Eliminazione',
    `Sei sicuro di voler eliminare l'utente ${user.nome} ${user.cognome}? Questa azione non è reversibile.`,
    async () => {
        try {
            await api.delete(`/admin/users/${user.id}`)
            successMessage.value = "Utente eliminato con successo"
            setTimeout(() => successMessage.value = '', 3000)
            fetchUsers(currentPage.value)
        } catch (error) {
            console.error(error)
            errorMessage.value = "Errore durante l'eliminazione dell'utente"
        }
    }
  )
}


// --- COMPUTED PROPERTIES PER LE STATISTICHE ---
// Ora usiamo i dati reali dal backend, indipendentemente dalla pagina corrente
const totalUsers = computed(() => totalUsersCount.value) 
const totalStudents = computed(() => totalStudentsCount.value)
const totalAdmins = computed(() => totalAdminsCount.value)


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
          <!-- Admin non ha Home, quindi solo Dashboard -->
          <span class="text-primary font-bold">Dashboard Admin</span>
        </nav>
        <div class="flex flex-col md:flex-row justify-between items-end border-b pb-4 gap-4">
          <div>
            <h1 class="text-4xl font-bold text-secondary">Gestione Utenti</h1>
            <p class="text-gray-600 mt-1">Pannello di controllo per la gestione degli iscritti alla piattaforma.</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-gray-500">Caricamento dati in corso...</p>
      </div>

      <div v-else-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm mb-8">
        <div class="flex items-center">
          <IconExclamation class="h-6 w-6 text-red-500 mr-3" />
          <p class="text-red-700 font-bold">{{ errorMessage }}</p>
        </div>
      </div>

      <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg shadow-sm mb-8 animate-fade-in-down">
        <div class="flex items-center">
          <IconCheckMark class="h-6 w-6 text-green-500 mr-3" />
          <p class="text-green-700 font-bold">{{ successMessage }}</p>
        </div>
      </div>

      <div v-else>
      
        <!-- Statistiche Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div class="p-4 bg-blue-50 rounded-full">
              <IconUsersGroup class="w-10 h-10 text-[#3b76ad]" />
            </div>
            <div>
              <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Utenti Totali</p>
              <p class="text-4xl font-extrabold text-[#151e2b]">{{ totalUsers }}</p>
            </div>
          </div>

          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div class="p-4 bg-purple-50 rounded-full">
              <IconAcademicCap class="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Studenti</p>
              <p class="text-4xl font-extrabold text-[#151e2b]">{{ totalStudents }}</p>
            </div>
          </div>

          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div class="p-4 bg-green-50 rounded-full">
              <IconShieldCheck class="w-10 h-10 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Admin</p>
              <p class="text-4xl font-extrabold text-[#151e2b]">{{ totalAdmins }}</p>
            </div>
          </div>
        </div>

        <!-- Tabella Utenti Refactored -->
        <UserTableList 
            :users="users" 
            :is-admin-super="isAdminSuper"
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