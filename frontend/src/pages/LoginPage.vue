<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'
import IconBack from '../components/icons/IconBack.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const validationError = ref('')

function validateLoginForm(emailVal: string, passwordVal: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) return 'Inserisci un indirizzo email valido'
  if (passwordVal.length < 1) return 'La password è obbligatoria'
  return null
}

const handleLogin = async () => {
  authStore.clearError()
  validationError.value = ''

  const formError = validateLoginForm(email.value, password.value)
  if (formError) {
    validationError.value = formError
    return
  }

  const success = await authStore.login(email.value, password.value)

  if (success) {
    const role = authStore.user?.ruolo
    if (role === '1' || role === '2') {
      router.push('/admin')
    } else {
      router.push('/home')
    }
  }
}

const errorMessage = () => validationError.value || authStore.error || ''
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans">

    <NavBar />

    <main class="flex-grow flex flex-col items-center justify-center px-4">

      <div class="mb-6 w-full max-w-md">
        <div @click="router.back()" class="inline-flex items-center gap-2 text-gray-600 hover:text-[#3b76ad] transition font-bold text-lg cursor-pointer">
          <IconBack class="h-6 w-6" />
          Indietro
        </div>
      </div>

      <div class="bg-[#151e2b] text-white w-full max-w-md p-8 rounded-3xl shadow-2xl">

        <h2 class="text-3xl font-bold text-center mb-8">Accedi a StudentHub</h2>

        <div
          v-if="errorMessage()"
          id="login-error"
          class="bg-red-500 text-white p-3 rounded mb-4 text-center text-sm font-bold"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage() }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6" novalidate>

          <div>
            <label for="login-email" class="block text-sm font-medium mb-2 pl-1">
              Inserisci la tua mail
            </label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              placeholder="example@domain.com"
              autocomplete="email"
              :aria-describedby="errorMessage() ? 'login-error' : undefined"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label for="login-password" class="block text-sm font-medium mb-2 pl-1">
              Inserisci la tua password
            </label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              placeholder="La tua password"
              autocomplete="current-password"
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