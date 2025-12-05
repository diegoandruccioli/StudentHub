<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  
  // Chiama l'azione login dello store
  const success = await authStore.login(email.value, password.value)
  
  if (success) {
    // CONTROLLO RUOLO: Se Admin/SuperAdmin vai su /admin, altrimenti /home
    const role = authStore.user?.ruolo
    if (role === '1' || role === '2') {
      router.push('/admin')
    } else {
      router.push('/home')
    }
  } else {
    errorMessage.value = authStore.error
  }
}
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans">
    
    <header class="bg-[#151e2b] text-white py-4 px-8 shadow-md flex items-center">
      <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
        </svg>
        <span class="text-2xl font-bold tracking-wide">StudentHub</span>
      </div>
    </header>

    <main class="flex-grow flex items-center justify-center px-4">
      
      <div class="bg-[#151e2b] text-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
        
        <h2 class="text-3xl font-bold text-center mb-8">Accedi a StudentHub</h2>
        
        <div v-if="errorMessage" class="bg-red-500 text-white p-3 rounded mb-4 text-center text-sm font-bold">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div>
            <label class="block text-sm font-medium mb-2 pl-1">Inserisci la tua mail</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="example@domain.com"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 pl-1">Inserisci la tua password</label>
            <input 
              v-model="password"
              type="password" 
              placeholder="your password"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <button 
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-[#3b76ad] hover:bg-[#2c5a85] disabled:opacity-50 text-white font-bold py-3 rounded-full shadow-lg transition transform hover:scale-105 mt-4"
          >
            {{ authStore.loading ? 'Accesso in corso...' : 'Accedi a StudentHub' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm">
          Non hai un account? 
          <router-link to="/register" class="underline hover:text-[#3b76ad] transition font-medium">
            Registrati
          </router-link>
        </div>

      </div>

    </main>

  </div>
</template>