<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

// Funzione logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

// Funzione per andare alle impostazioni
const goToSettings = () => {
  router.push('/settings')
}

// Nascondi impostazioni se admin (1) o superadmin (2)
const showSettings = computed(() => {
  const user = authStore.user
  return user && user.ruolo !== '1' && user.ruolo !== '2'
})
</script>

<template>
  <nav class="bg-secondary text-white py-4 px-8 shadow-md flex justify-between items-center relative z-50">
    
    <div @click="router.push('/home')" class="flex items-center gap-3 cursor-pointer hover:opacity-90 transition">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
      </svg>
      <span class="text-2xl font-bold tracking-wide">StudentHub</span>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-lg font-medium hidden md:block">
        Ciao, {{ authStore.user?.nome || 'Studente' }}
      </span>
      
      <div class="relative group py-2"> 
        <div class="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center overflow-hidden cursor-pointer shadow-lg group-hover:ring-2 group-hover:ring-blue-400 transition">
           <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        
        <div class="absolute right-0 top-full mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden border border-gray-100">
          
          <div v-if="showSettings" @click="goToSettings" class="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Impostazioni</span>
          </div>

          <div class="border-t border-gray-100"></div>

          <div @click="handleLogout" class="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </div>

        </div>
      </div>
    </div>

  </nav>
</template>