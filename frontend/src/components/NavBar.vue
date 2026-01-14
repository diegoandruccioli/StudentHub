<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import IconNavbarLogo from './icons/IconNavbarLogo.vue'
import IconUser from './icons/IconUser.vue'
import IconSettings from './icons/IconSettings.vue'
import IconLogout from './icons/IconLogout.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const props = defineProps<{
  hideUserInfo?: boolean
}>()

const showSettings = computed(() => {
  const user = authStore.user
  return user && user.ruolo !== '1' && user.ruolo !== '2'
})
</script>

<template>
  <nav class="bg-secondary text-white py-4 px-8 shadow-md flex justify-between items-center relative z-50">
    
    <router-link to="/home" class="flex items-center gap-3 cursor-pointer hover:opacity-90 transition rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary">
      <div class="text-white w-10 h-10">
        <IconNavbarLogo />
      </div>
      <span class="text-2xl font-bold tracking-wide">Studenthub</span>
    </router-link>

    <div class="flex items-center gap-4" v-if="authStore.user && !props.hideUserInfo">
      <span class="text-lg font-medium hidden md:block">
        Ciao, {{ authStore.user?.nome || 'Studente' }}
      </span>
      
      <!-- Dropdown Container -->
      <div class="relative group py-2"> 
        <button 
          class="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center overflow-hidden cursor-pointer shadow-lg group-hover:ring-2 group-hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="User Menu"
        >
           <IconUser />
        </button>
        
        <!-- Dropdown Menu -->
        <div class="absolute right-0 top-full mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden border border-gray-100">
          
          <router-link 
            v-if="showSettings" 
            to="/settings" 
            class="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition focus:bg-gray-100 focus:outline-none"
          >
            <IconSettings />
            <span>Impostazioni</span>
          </router-link>

          <div class="border-t border-gray-100"></div>

          <button 
            @click="handleLogout" 
            class="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer transition focus:bg-red-50 focus:outline-none text-left"
          >
            <IconLogout />
            <span>Logout</span>
          </button>

        </div>
      </div>
    </div>

  </nav>
</template>