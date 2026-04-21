<script setup lang="ts">
import type { Badge } from '../types'

const props = defineProps<{
  badge: Badge
}>()

const unlockStatusLabel = props.badge.sbloccato ? 'sbloccato' : 'non sbloccato'
</script>

<template>
  <article
    class="flex items-center gap-4 p-4 rounded-xl border transition"
    :class="props.badge.sbloccato
      ? 'bg-white border-green-200 shadow-sm'
      : 'bg-gray-50 border-gray-200 opacity-70'"
    :aria-label="`Obiettivo ${props.badge.nome}: ${unlockStatusLabel}`"
  >
    <div
      class="w-10 h-10 flex items-center justify-center text-2xl shrink-0"
      aria-hidden="true"
    >
      <span v-if="props.badge.icona">{{ props.badge.icona }}</span>
      <span
        v-else
        class="w-6 h-6 rounded-full border-2 inline-block"
        :class="props.badge.sbloccato ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'"
      />
    </div>

    <div class="flex-grow min-w-0">
      <p class="font-bold text-sm truncate" :class="props.badge.sbloccato ? 'text-gray-900' : 'text-gray-500'">
        {{ props.badge.nome }}
      </p>
      <p class="text-xs text-gray-400 truncate">{{ props.badge.descrizione }}</p>
    </div>

    <span
      class="inline-block px-3 py-1 rounded-full text-xs font-bold shrink-0"
      :class="props.badge.sbloccato
        ? 'bg-green-100 text-green-700 border border-green-200'
        : 'bg-gray-200 text-gray-500'"
    >
      +{{ props.badge.xp_valore }} xp
    </span>
  </article>
</template>
