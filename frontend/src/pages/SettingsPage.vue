<script setup>
import NavBar from '../components/NavBar.vue'
import { useSettingsStore } from '../stores/settings'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const settingsStore = useSettingsStore()
const saving = ref(false)
const message = ref('')

const form = reactive({
  tema_voti: 'DEFAULT',
  rgb_soglia_bassa: 18,
  rgb_soglia_alta: 27
})

onMounted(async () => {
  await settingsStore.fetchSettings()
  Object.assign(form, settingsStore.preferences)
})

const save = async () => {
  saving.value = true
  message.value = ''
  
  // Validazione rapida
  if (form.tema_voti === 'RGB' && form.rgb_soglia_bassa > form.rgb_soglia_alta) {
    message.value = "Errore: La soglia minima non può essere maggiore della massima."
    saving.value = false
    return
  }

  const success = await settingsStore.updateSettings(form)
  
  if (success) {
    message.value = "Impostazioni salvate con successo!"
    
    // --- AZIONE RICHIESTA: REINDIRIZZAMENTO ALLA HOME ---
    setTimeout(() => {
        router.push('/home') 
    }, 1000); // Aspetta 1 secondo per far leggere il messaggio di successo

  } else {
    message.value = "Errore durante il salvataggio."
  }
  saving.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-2xl">
      
      <div class="flex items-center gap-4 mb-8 border-b pb-4">
        
        <svg 
            @click="router.push('/home')" 
            class="h-8 w-8 text-gray-600 hover:text-[#3b76ad] cursor-pointer transition" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            stroke-width="2"
        >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>

        <h1 class="text-3xl font-bold text-[#3b76ad]">Impostazioni Utente</h1>
      </div>
      
      <div class="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
        
        <h3 class="text-xl font-bold mb-4">Stile Visualizzazione Voti</h3>
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          
          <label class="flex-1 cursor-pointer group">
            <input type="radio" v-model="form.tema_voti" value="DEFAULT" class="hidden peer">
            <div class="border-2 border-gray-200 rounded-xl p-4 peer-checked:border-[#3b76ad] peer-checked:bg-blue-50 transition text-center hover:bg-gray-50 h-full flex flex-col justify-center items-center">
              <div class="font-bold text-gray-700 mb-2">Standard (Blu)</div>
              <div class="w-12 h-12 bg-[#3b76ad] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">24</div>
            </div>
          </label>

          <label class="flex-1 cursor-pointer group">
            <input type="radio" v-model="form.tema_voti" value="RGB" class="hidden peer">
            <div class="border-2 border-gray-200 rounded-xl p-4 peer-checked:border-green-500 peer-checked:bg-green-50 transition text-center hover:bg-gray-50 h-full flex flex-col justify-center items-center">
              <div class="font-bold text-gray-700 mb-2">Dinamico (RGB)</div>
              <div class="flex justify-center gap-2">
                <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">18</div>
                <div class="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-xs shadow-md">24</div>
                <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">30</div>
              </div>
            </div>
          </label>
        </div>

        <div v-if="form.tema_voti === 'RGB'" class="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
          <h4 class="font-bold text-gray-700 mb-4">Configura le soglie dei colori</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-red-600 mb-1">Soglia Rossa (Basso)</label>
              <p class="text-xs text-gray-500 mb-2">Voti inferiori a questo numero saranno rossi.</p>
              <input type="number" v-model="form.rgb_soglia_bassa" min="18" max="30" class="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none">
            </div>

            <div>
              <label class="block text-sm font-bold text-green-600 mb-1">Soglia Verde (Alto)</label>
              <p class="text-xs text-gray-500 mb-2">Voti uguali o superiori saranno verdi.</p>
              <input type="number" v-model="form.rgb_soglia_alta" min="18" max="30" class="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-200 outline-none">
            </div>
          </div>
          
          <div class="mt-4 text-center text-sm text-yellow-600 font-medium bg-yellow-100 p-2 rounded border border-yellow-200">
            I voti tra {{ form.rgb_soglia_bassa }} e {{ form.rgb_soglia_alta }} saranno gialli.
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <button @click="save" :disabled="saving" class="bg-[#3b76ad] hover:bg-[#2c5a85] text-white font-bold py-3 px-12 rounded-full shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ saving ? 'Salvataggio...' : 'Salva Impostazioni' }}
          </button>
          
          <p v-if="message" :class="message.includes('Errore') ? 'text-red-500' : 'text-green-600'" class="font-bold text-center">
            {{ message }}
          </p>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>