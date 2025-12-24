<script setup>
import NavBar from '../components/NavBar.vue'
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

const activeDropdownId = ref(null)

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
    closeDropdowns()
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

// Chiude il dropdown se si clicca fuori
const closeDropdowns = () => {
    activeDropdownId.value = null
}

const toggleDropdown = (id, event) => {
    event.stopPropagation()
    if (activeDropdownId.value === id) {
        activeDropdownId.value = null
    } else {
        activeDropdownId.value = id
    }
}

// --- AZIONI SUPER ADMIN ---
const updateUserRole = async (userId, currentRole) => {
    // Se è Studente (0) diventa Admin (1), se Admin (1) diventa Studente (0)
    const newRole = currentRole === '0' ? '1' : '0'
    const actionName = newRole === '1' ? 'promozione' : 'retrocessione'

    // Sostituto di confirm()
    openConfirmModal(
        `Conferma ${actionName}`,
        `Sei sicuro di voler procedere con la ${actionName} dell'utente?`,
        async () => {
             actionLoading.value = true
             try {
                await api.put(`/admin/users/${userId}/role`, 
                    { nuovo_ruolo: newRole }
                )
                
                // Aggiorna lista locale
                const userIndex = users.value.findIndex(u => u.id === userId)
                if (userIndex !== -1) {
                    users.value[userIndex].ruolo = newRole
                }
                successMessage.value = `Ruolo aggiornato con successo.`
                setTimeout(() => successMessage.value = '', 3000)

            } catch (error) {
                console.error("Errore cambio ruolo:", error)
                errorMessage.value = error.response?.data?.message || "Errore durante l'operazione"
                setTimeout(() => errorMessage.value = '', 5000)
            } finally {
                actionLoading.value = false
            }
        }
    )
}

const deleteUser = async (userId) => {
    openConfirmModal(
        "Elimina Account",
        "Sei sicuro di voler ELIMINARE definitivamente questo account Admin? L'azione è irreversibile.",
        async () => {
             actionLoading.value = true
             try {
                await api.delete(`/admin/users/${userId}`)
                
                // Rimuovi dalla lista locale
                users.value = users.value.filter(u => u.id !== userId)
                successMessage.value = "Account eliminato correttamente."
                setTimeout(() => successMessage.value = '', 3000)

            } catch (error) {
                console.error("Errore cancellazione:", error)
                errorMessage.value = error.response?.data?.message || "Errore durante Cancellazione"
                setTimeout(() => errorMessage.value = '', 5000)
            } finally {
                actionLoading.value = false
            }
        }
    )
}

// --- COMPUTED PROPERTIES PER LE STATISTICHE ---
// Calcoliamo i totali in tempo reale basandoci sui dati scaricati
const totalUsers = computed(() => users.value.length)
const totalAdmins = computed(() => users.value.filter(u => u.ruolo === '1' || u.ruolo === '2').length)
const totalStudents = computed(() => users.value.filter(u => u.ruolo === '0').length)

// --- FILTRO RICERCA ---
// Permette di filtrare la tabella per nome, cognome o email
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.nome.toLowerCase().includes(query) || 
    user.cognome.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// --- FUNZIONI DI UTILITÀ VISIVA ---
const getRoleBadge = (role) => {
  switch(role) {
    case '2': return { label: 'Super Admin', class: 'bg-green-100 text-green-700 border-green-200' }
    case '1': return { label: 'Admin', class: 'bg-blue-100 text-blue-700 border-blue-200' }
    default: return { label: 'Studente', class: 'bg-gray-100 text-gray-600 border-gray-200' }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// --- CARICAMENTO DATI ---
onMounted(async () => {
  try {
    // Chiamata all'API Backend che abbiamo verificato esistere
    const response = await api.get('/admin/users')
    users.value = response.data
  } catch (error) {
    console.error("Errore admin:", error)
    errorMessage.value = "Accesso Negato o Errore Server."
    
    // Redirect se non autorizzato (token scaduto o ruolo insufficiente)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      setTimeout(() => router.push('/home'), 2000)
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-background-light font-sans" @click="closeDropdowns">
    
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

        <div class="bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-secondary text-white text-xs uppercase tracking-wider">
                  <th class="p-4 font-semibold rounded-tl-lg">ID</th>
                  <th class="p-4 font-semibold">Utente</th>

                  <th class="p-4 font-semibold text-center">Ruolo</th>
                  <th class="p-4 font-semibold text-center">XP Totali</th>
                  <th class="p-4 font-semibold text-center">Iscrizione</th>
                  <th v-if="isAdminSuper" class="p-4 font-semibold text-center rounded-tr-lg">Azioni</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr 
                  v-for="user in filteredUsers" 
                  :key="user.id" 
                  class="hover:bg-gray-50 transition group"
                >
                  <td class="p-4 text-gray-400 font-mono text-sm">#{{ user.id }}</td>
                  
                  <td class="p-4">
                    <div class="font-bold text-gray-800">{{ user.nome }} {{ user.cognome }}</div>
                  </td>
                  

                  
                  <td class="p-4 text-center">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border"
                      :class="getRoleBadge(user.ruolo).class"
                    >
                      {{ getRoleBadge(user.ruolo).label }}
                    </span>
                  </td>
                  
                  <td class="p-4 text-center font-mono font-bold text-primary">
                    {{ user.xp_totali }} XP
                  </td>
                  
                  <td class="p-4 text-center text-gray-500 text-sm">
                    {{ formatDate(user.created_at) }}
                  </td>
                  
                  <!-- MENU AZIONI (Solo Super Admin) -->
                  <td v-if="isAdminSuper" class="p-4 text-center relative">
                    <!-- Non mostriamo azioni per altri Super Admin o se stessi -->
                    <div v-if="user.ruolo !== '2' && user.id !== authStore.user.id">
                        <button 
                            @click="toggleDropdown(user.id, $event)" 
                            class="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition focus:outline-none"
                        >
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <div 
                            v-if="activeDropdownId === user.id" 
                            class="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden text-left animate-fade-in"
                            @click.stop
                        >
                            <div class="py-1">
                                <!-- Promuovi/Retrocedi -->
                                <button 
                                    @click="updateUserRole(user.id, user.ruolo)"
                                    class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary flex items-center gap-2"
                                >
                                    <svg v-if="user.ruolo === '0'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                                    {{ user.ruolo === '0' ? 'Promuovi ad Admin' : 'Retrocedi a Studente' }}
                                </button>

                                <!-- Elimina (Solo per Admin role='1') -->
                                <button 
                                    v-if="user.ruolo === '1'"
                                    @click="deleteUser(user.id)"
                                    class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Elimina Account
                                </button>
                            </div>
                        </div>
                    </div>
                  </td>
                </tr>
                
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="p-8 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                        <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span>Nessun utente trovato per "{{ searchQuery }}"</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <p class="text-xs text-gray-400 mt-4 text-right">
          * La lista mostra tutti gli utenti registrati nel sistema StudentHub.
        </p>

      </div>
      
      <!-- CUSTOM MODAL COMPONENT -->
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="text-lg leading-6 font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
                <p class="text-sm text-gray-500 mb-6">
                    {{ modalMessage }}
                </p>
            </div>
            <div class="flex gap-3 justify-center">
                <button 
                    @click="closeModal"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition focus:outline-none"
                >
                    Annulla
                </button>
                <button 
                    @click="confirmAction"
                    class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 focus:outline-none"
                >
                    Conferma
                </button>
            </div>
        </div>
      </div>

    </main>
  </div>
</template>