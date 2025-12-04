<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Registrazione componenti Chart.js necessari
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const exams = ref([])
const loading = ref(true)

// --- CALCOLI STATISTICI ---

// 1. Media Ponderata
const mediaPonderata = computed(() => {
  if (exams.value.length === 0) return 0
  
  let sommaVotiPonderati = 0
  let sommaCfu = 0

  exams.value.forEach(exam => {
    // Filtriamo solo i voti numerici (escludiamo idoneità se presenti nel DB come null/0)
    if (exam.voto && exam.cfu) {
      sommaVotiPonderati += (exam.voto * exam.cfu)
      sommaCfu += exam.cfu
    }
  })

  return sommaCfu === 0 ? 0 : (sommaVotiPonderati / sommaCfu).toFixed(2)
})

// 2. Base di Laurea (Media * 110 / 30)
const baseLaurea = computed(() => {
  const media = parseFloat(mediaPonderata.value)
  return ((media * 110) / 30).toFixed(1)
})

// --- CONFIGURAZIONE GRAFICO ---

const chartData = computed(() => {
  // Il backend restituisce i dati dal più recente al più vecchio.
  // Per il grafico temporale, li vogliamo dal più vecchio (sinistra) al più recente (destra).
  // Creiamo una copia con [...exams.value] per non mutare l'array originale
  const sortedExams = [...exams.value].reverse()

  return {
    labels: sortedExams.map(e => e.nome), // Nomi esami sull'asse X
    datasets: [
      {
        label: 'Andamento Voti',
        backgroundColor: '#3b76ad',
        borderColor: '#3b76ad',
        data: sortedExams.map(e => e.voto), // Voti sull'asse Y
        tension: 0.3, // Curvatura della linea (0 = dritta, 0.4 = curva)
        pointBackgroundColor: '#fff',
        pointBorderColor: '#3b76ad',
        pointBorderWidth: 2,
        pointRadius: 6,
        fill: false
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // Nascondiamo la legenda perché c'è solo una linea
    },
    tooltip: {
      backgroundColor: '#151e2b',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 10,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    y: {
      min: 16, // Un po' sotto il 18 per estetica
      max: 31, // Un po' sopra il 30 per estetica
      ticks: {
        stepSize: 2
      },
      grid: {
        color: '#e5e7eb'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 45, // Ruota i nomi lunghi degli esami
        minRotation: 0,
        autoSkip: true, // Evita affollamento se hai 50 esami
        maxTicksLimit: false
      }
    }
  }
}

// --- FETCH DATA ---
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/exams', { withCredentials: true })
    exams.value = response.data
  } catch (error) {
    console.error("Errore caricamento statistiche:", error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">
      
      <div class="mb-8">
        <nav class="text-sm text-gray-500 mb-2 font-medium">
          <router-link to="/home" class="hover:text-[#3b76ad]">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-[#3b76ad] font-bold">Statistiche</span>
        </nav>
        <h1 class="text-4xl font-bold text-[#3b76ad] mb-1">Statistiche</h1>
        <p class="text-xl font-bold text-black">Diamo un'occhiata ai tuoi risultati!</p>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500">
        Caricamento dati...
      </div>

      <div v-else-if="exams.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-gray-200">
        <p class="text-xl text-gray-400 font-bold">Non ci sono ancora dati sufficienti 📉</p>
        <router-link to="/career/insert" class="text-[#3b76ad] underline mt-2 block">Inserisci il tuo primo esame</router-link>
      </div>

      <div v-else>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <div>
              <h3 class="text-xl font-medium text-black">Media Esami</h3>
              <p class="text-4xl font-bold text-black">{{ mediaPonderata }}</p>
            </div>
          </div>

          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <div>
              <h3 class="text-xl font-medium text-black">Base di Laurea</h3>
              <p class="text-4xl font-bold text-black">{{ baseLaurea }}</p>
            </div>
          </div>

        </div>

        <div class="bg-white border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 class="text-2xl font-bold text-black mb-6">Visualizza i tuoi Risultati</h2>
          
          <div class="h-80 w-full">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>

      </div>

    </main>

  </div>
</template>