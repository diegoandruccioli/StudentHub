<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Exam } from '../types'
import { useSettingsStore } from '../stores/settings'
import IconDotsHorizontal from './icons/IconDotsHorizontal.vue'
import IconPencil from './icons/IconPencil.vue'
import IconTrash from './icons/IconTrash.vue'
import IconCalendar from './icons/IconCalendar.vue'

const props = defineProps<{
  exams: Exam[]
  loading: boolean
}>()

const emit = defineEmits<{
  edit: [exam: Exam]
  delete: [id: number | string]
}>()

const settingsStore = useSettingsStore()
const activeDropdownId = ref<number | string | null>(null)

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('it-IT').format(new Date(dateString))
}

const getBadgeColor = (voto: number) => {
  const prefs = settingsStore.preferences;
  if (prefs.tema_voti === 'DEFAULT') {
    return 'bg-primary text-white'; 
  }
  if (voto < prefs.rgb_soglia_bassa) return 'bg-red-600 text-white';
  else if (voto >= prefs.rgb_soglia_alta) return 'bg-green-700 text-white';
  else return 'bg-yellow-400 text-black';
}

const toggleDropdown = (id: number | string, event: Event) => {
    event.stopPropagation()
    if (activeDropdownId.value === id) {
        activeDropdownId.value = null
    } else {
        activeDropdownId.value = id
    }
}

const closeDropdowns = () => {
    activeDropdownId.value = null
}

onMounted(() => {
    window.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
    window.removeEventListener('click', closeDropdowns)
})
</script>

<template>
  <div class="w-full">
    <div v-if="props.loading" class="text-center py-10 text-gray-500 text-xl animate-pulse cursor-default">
      Aggiornamento lista...
    </div>

    <div v-else-if="props.exams.length === 0" class="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-300">
      <p class="text-2xl text-gray-400 font-bold mb-4">Nessun esame trovato</p>
      <p class="text-gray-500">Prova a cambiare i filtri o inserisci un nuovo esame.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="exam in props.exams" 
        :key="exam.id"
        class="bg-white border-[3px] border-black rounded-[2rem] p-6 relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
      >
        <!-- MENU DROPDOWN -->
        <div class="absolute top-5 right-5 z-10">
            <button 
                @click="toggleDropdown(exam.id, $event)" 
                class="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition focus:outline-none bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm"
            >
                <IconDotsHorizontal class="w-6 h-6" />
            </button>
            <div 
                v-if="activeDropdownId === exam.id" 
                class="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden text-left animate-fade-in z-20"
                @click.stop
            >
                <div class="py-1">
                    <button @click="emit('edit', exam); closeDropdowns()" class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary flex items-center gap-2">
                        <IconPencil class="w-4 h-4" /> Modifica
                    </button>
                    <button @click="emit('delete', exam.id); closeDropdowns()" class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100">
                        <IconTrash class="w-4 h-4" /> Elimina
                    </button>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-start mb-6 pr-10">
          <h3 class="text-2xl font-bold text-black leading-tight w-2/3 break-words pr-2">
            {{ exam.nome }}
          </h3>
          <div 
            class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm shrink-0 transition-colors duration-300"
            :class="getBadgeColor(exam.voto)"
          >
            {{ exam.voto }}
            <span v-if="exam.lode" class="text-xs align-top ml-0.5 -mt-2">L</span>
          </div>
        </div>

        <div class="flex justify-between items-end mt-4">
          <div class="flex items-center gap-2 text-black font-bold text-lg">
            <IconCalendar class="h-6 w-6 text-gray-600" />
            <span>{{ formatDate(exam.data) }}</span>
          </div>
          <div class="text-black font-bold text-2xl">
            {{ exam.cfu }} CFU
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
