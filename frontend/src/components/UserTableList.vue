<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
    users: {
        type: Array,
        required: true
    },
    isAdminSuper: {
        type: Boolean,
        default: false
    },
    searchQuery: {
        type: String,
        default: ''
    },
    currentPage: {
        type: Number,
        default: 1
    },
    totalPages: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['update-role', 'delete-user', 'change-page'])

const authStore = useAuthStore()
const activeDropdownId = ref(null)

const toggleDropdown = (id, event) => {
    event.stopPropagation()
    if (activeDropdownId.value === id) {
        activeDropdownId.value = null
    } else {
        activeDropdownId.value = id
    }
}

// ... (rest of logic)

const closeDropdowns = () => {
    activeDropdownId.value = null
}

const UserRole = {
    STUDENT: '0',
    ADMIN: '1',
    SUPER_ADMIN: '2'
}

const getRoleBadge = (role) => {
  switch(role) {
    case UserRole.SUPER_ADMIN: return { label: 'Super Admin', class: 'bg-green-100 text-green-700 border-green-200' }
    case UserRole.ADMIN: return { label: 'Admin', class: 'bg-blue-100 text-blue-700 border-blue-200' }
    default: return { label: 'Studente', class: 'bg-gray-100 text-gray-600 border-gray-200' }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

defineExpose({ closeDropdowns })
</script>

<template>
    <div class="bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden" @click="closeDropdowns">
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
                <!-- ... (rows) ... -->
                <tr 
                    v-for="user in users" 
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
                    <div v-if="user.ruolo !== UserRole.SUPER_ADMIN && user.id !== authStore.user.id">
                         <button 
                            @click="toggleDropdown(user.id, $event)" 
                            class="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label="Apri menu azioni"
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
                                    @click="$emit('update-role', user); closeDropdowns()"
                                    class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary flex items-center gap-2 focus:outline-none focus:bg-blue-50"
                                >
                                    <svg v-if="user.ruolo === UserRole.STUDENT" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                                    {{ user.ruolo === UserRole.STUDENT ? 'Promuovi ad Admin' : 'Retrocedi a Studente' }}
                                </button>

                                <!-- Elimina (Solo per Admin role='1') -->
                                <button 
                                    v-if="user.ruolo === UserRole.ADMIN"
                                    @click="$emit('delete-user', user.id); closeDropdowns()"
                                    class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 focus:outline-none focus:bg-red-50"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Elimina Account
                                </button>
                            </div>
                        </div>
                    </div>
                    </td>
                </tr>
                
                <tr v-if="users.length === 0">
                    <td colspan="6" class="p-8 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                        <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span>Nessun utente trovato {{ searchQuery ? 'per "' + searchQuery + '"' : '' }}</span>
                    </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Pagination Footer -->
        <div v-if="totalPages > 1" class="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
            <button 
                :disabled="currentPage === 1"
                @click="$emit('change-page', currentPage - 1)"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                Precedente
            </button>
            <span class="text-sm text-gray-600 font-medium">
                Pagina <span class="text-primary font-bold">{{ currentPage }}</span> di {{ totalPages }}
            </span>
            <button 
                :disabled="currentPage === totalPages"
                @click="$emit('change-page', currentPage + 1)"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
                Successivo
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>
    </div>
</template>
