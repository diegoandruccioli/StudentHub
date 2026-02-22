<script setup lang="ts">
  import NavBar from '../components/NavBar.vue'
  import { ref, onMounted } from 'vue'
  import api from '../api/axios'
  import type { StatsResponse } from '../types'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
  } from 'chart.js'
  import { Line } from 'vue-chartjs'
  import IconLogo from '../components/icons/IconLogo.vue'
  import IconClipboardCheck from '../components/icons/IconClipboardCheck.vue'
  import IconChartBar from '../components/icons/IconChartBar.vue'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )
  
  const loading = ref(true)
  const errorMsg = ref('')
  
  const mediaPonderata = ref(0)
  const cfuTotali = ref(0)
  const baseLaurea = ref(0)
  const chartData = ref<ChartData<'line'>>({
    labels: [],
    datasets: []
  })
  
  const examNames = ref<string[]>([]) 
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
          display: false 
      },
      tooltip: {
        backgroundColor: '#151e2b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => examNames.value[context[0].dataIndex],
          label: (context) => {
              if (context.dataset.label === 'Media') {
                  return `Media Attuale: ${context.raw}`;
              }
              return `Voto: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 16,
        max: 32,
        ticks: { 
          stepSize: 1,
          callback: function(value) {
            const val = Number(value)
            if ([16, 17, 31, 32].includes(val)) return null; 
            return String(val); // Chart.js expects string or number, explicit return needed
          }
        },
        grid: { 
          color: (context) => {
              if ([16, 17, 31, 32].includes(context.tick.value)) {
                  return 'transparent';
              }
              return '#e5e7eb';
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          display: true,
          maxRotation: 45,
          minRotation: 0,
          font: { size: 10 },
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    }
  }
  
  onMounted(async () => {
    try {
      const response = await api.get<StatsResponse>('/stats')
      
      const apiData = response.data
  
      mediaPonderata.value = apiData.mediaPonderata
      cfuTotali.value = apiData.totaleCfu
      baseLaurea.value = apiData.baseLaurea
  
      examNames.value = apiData.chartData.examNames || []
  
      const averageLineData = new Array(apiData.chartData.data.length).fill(apiData.mediaPonderata);
  
      chartData.value = {
        labels: apiData.chartData.labels,
        datasets: [
          {
            label: 'Voti',
            backgroundColor: '#3b76ad',
            borderColor: '#3b76ad',
            data: apiData.chartData.data,
            tension: 0.3,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#3b76ad',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: false,
            order: 1
          },
          {
            label: 'Media',
            backgroundColor: '#ef4444',
            borderColor: '#ef4444',
            data: averageLineData,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            order: 2
          }
        ]
      }
  
    } catch {
      errorMsg.value = 'Impossibile caricare le statistiche. Riprova più tardi.'
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <template>
    <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans">
      
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
  
        <div v-if="loading" class="text-center py-10 text-gray-500 text-lg animate-pulse">
          Caricamento dati in corso...
        </div>
  
        <div v-else-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm">
          <p class="text-red-700 font-bold">{{ errorMsg }}</p>
        </div>
  
        <div v-else-if="!chartData.labels || !chartData.labels.length" class="text-center py-20 bg-white rounded-3xl border-2 border-gray-200 shadow-sm">
          <p class="text-2xl text-gray-400 font-bold mb-4">Non ci sono ancora dati sufficienti</p>
          <router-link to="/career/insert" class="text-[#3b76ad] font-bold hover:underline mt-2 inline-block px-6 py-2 bg-blue-50 rounded-full transition">
            Inserisci il tuo primo esame
          </router-link>
        </div>
  
        <div v-else>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
              <div class="p-4 bg-blue-50 rounded-full">
                <IconLogo class="h-10 w-10 text-[#3b76ad]" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-600">Media Ponderata</h3>
                <p class="text-4xl font-extrabold text-[#151e2b]">{{ mediaPonderata }}</p>
              </div>
            </div>
  
            <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
              <div class="p-4 bg-purple-50 rounded-full">
                <IconClipboardCheck class="h-10 w-10 text-purple-600" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-600">CFU Sostenuti</h3>
                <p class="text-4xl font-extrabold text-[#151e2b]">{{ cfuTotali }}</p>
              </div>
            </div>
  
            <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
              <div class="p-4 bg-green-50 rounded-full">
                <IconChartBar class="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-600">Base di Laurea</h3>
                <p class="text-4xl font-extrabold text-[#151e2b]">{{ baseLaurea }}</p>
              </div>
            </div>
  
          </div>
  
          <div class="bg-white border-2 border-black rounded-2xl p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-[#151e2b]">Andamento Carriera</h2>
              
              <div class="flex items-center gap-4 text-sm font-bold text-gray-600">
                  <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-[#3b76ad]"></span>
                      <span>Voti</span>
                  </div>
                  <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                      <span>Media</span>
                  </div>
              </div>
  
            </div>
            
            <div class="h-80 w-full relative">
              <Line v-if="chartData.labels && chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
            </div>
          </div>
  
        </div>
  
      </main>
  
    </div>
  </template>