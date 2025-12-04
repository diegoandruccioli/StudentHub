<script setup>
// Nessuna logica necessaria qui
</script>

<template>
  <footer class="bg-[#151e2b] text-white py-6 w-full z-10">
    <div class="flex justify-center space-x-8 text-sm font-medium tracking-wide">
      
      <router-link 
        to="/about" 
        class="font-bold cursor-pointer transition hover:text-[#3b76ad]" 
        active-class="text-[#3b76ad]">
        Chi Siamo
      </router-link>
      
      <router-link 
        to="/contact" 
        class="font-bold cursor-pointer transition hover:text-[#3b76ad]" 
        active-class="text-[#3b76ad]">
        Contatti
      </router-link>
      
      <router-link 
        to="/privacy" 
        class="font-bold cursor-pointer transition hover:text-[#3b76ad]" 
        active-class="text-[#3b76ad]">
        Privacy
      </router-link>
      
      <router-link 
        to="/terms" 
        class="font-bold cursor-pointer transition hover:text-[#3b76ad]" 
        active-class="text-[#3b76ad]">
        Termini
      </router-link>
    </div>
  </footer>
</template>