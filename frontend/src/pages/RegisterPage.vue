<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { RegisterPayload } from '../types'
import NavBar from '../components/NavBar.vue'
import IconBack from '../components/icons/IconBack.vue'

const router = useRouter()
const authStore = useAuthStore()

const nome = ref('')
const cognome = ref('')
const email = ref('')
const password = ref('')
const validationError = ref('')

function validateRegisterForm(
  nomeVal: string,
  cognomeVal: string,
  emailVal: string,
  passwordVal: string
): string | null {
  if (!nomeVal.trim()) return 'Il nome è obbligatorio'
  if (!cognomeVal.trim()) return 'Il cognome è obbligatorio'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) return 'Inserisci un indirizzo email valido'
  if (passwordVal.length < 8) return 'La password deve contenere almeno 8 caratteri'
  return null
}

const handleRegister = async () => {
  authStore.clearError()
  validationError.value = ''

  const formError = validateRegisterForm(nome.value, cognome.value, email.value, password.value)
  if (formError) {
    validationError.value = formError
    return
  }

  const payload: RegisterPayload = {
    nome: nome.value.trim(),
    cognome: cognome.value.trim(),
    email: email.value,
    password: password.value,
  }

  const success = await authStore.register(payload)
  if (success) {
    router.push('/home')
  }
}

const errorMessage = () => validationError.value || authStore.error || ''
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans">

    <NavBar />

    <main class="flex-grow flex flex-col items-center justify-center px-4 py-10">

      <div class="mb-6 w-full max-w-md">
        <div @click="router.back()" class="inline-flex items-center gap-2 text-gray-600 hover:text-[#3b76ad] transition font-bold text-lg cursor-pointer">
          <IconBack class="h-6 w-6" />
          Indietro
        </div>
      </div>

      <div class="bg-[#151e2b] text-white w-full max-w-md p-8 rounded-3xl shadow-2xl">

        <h2 class="text-3xl font-bold text-center mb-8">Registrati a StudentHub</h2>

        <div
          v-if="errorMessage()"
          id="register-error"
          class="bg-red-500 text-white p-3 rounded mb-4 text-center text-sm font-bold"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage() }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5" novalidate>

          <div>
            <label for="register-nome" class="block text-sm font-medium mb-1 pl-1">
              Inserisci il tuo nome
            </label>
            <input
              id="register-nome"
              v-model="nome"
              type="text"
              placeholder="Mario"
              autocomplete="given-name"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label for="register-cognome" class="block text-sm font-medium mb-1 pl-1">
              Inserisci il tuo cognome
            </label>
            <input
              id="register-cognome"
              v-model="cognome"
              type="text"
              placeholder="Rossi"
              autocomplete="family-name"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label for="register-email" class="block text-sm font-medium mb-1 pl-1">
              Inserisci la tua mail
            </label>
            <input
              id="register-email"
              v-model="email"
              type="email"
              placeholder="example@domain.com"
              autocomplete="email"
              :aria-describedby="errorMessage() ? 'register-error' : undefined"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label for="register-password" class="block text-sm font-medium mb-1 pl-1">
              Crea la tua password
              <span class="text-gray-400 font-normal">(minimo 8 caratteri)</span>
            </label>
            <input
              id="register-password"
              v-model="password"
              type="password"
              placeholder="Almeno 8 caratteri"
              autocomplete="new-password"
              minlength="8"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-[#3b76ad] hover:bg-[#2c5a85] disabled:opacity-50 text-white font-bold py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              {{ authStore.loading ? 'Registrazione...' : 'Registrati a StudentHub' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-300">
          Hai già un account?
          <router-link to="/login" class="underline text-white hover:text-[#3b76ad] transition font-medium">
            Accedi
          </router-link>
        </div>

      </div>
    </main>
  </div>
</template>