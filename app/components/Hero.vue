<!-- Hero.vue -->
<script setup lang="ts">
import type { Show } from '~/types/show'

const props = defineProps<{
  show: Show
}>()

function stripHtml(html: string) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || ''
}

const formattedSummary = computed(() => {
  return props.show.summary ? stripHtml(props.show.summary) : 'No summary available'
})
</script>

<template>
  <section
    aria-label="Featured Show"
    class="relative bg-black text-white h-[50vh] overflow-hidden"
  >
    <div class="absolute inset-0">
      <template v-if="show.image">
        <img
          :src="show.image.original"
          :alt="`${show.name} poster`"
          class="w-full h-full object-cover opacity-60"
        >
      </template>
      <div
        v-else
        class="placeholder-image w-full h-full bg-gray-900 flex items-center justify-center"
      >
        <span class="text-gray-600">No Image Available</span>
      </div>
      <!-- Gradient overlays -->
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
    </div>

    <div class="relative h-full container mx-auto px-4 py-8">
      <div class="absolute bottom-[20%] left-0 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="max-w-2xl">
          <div class="flex items-center gap-2 mb-4">
            <div class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              TOP 10
            </div>
            <div class="text-sm font-semibold text-white/90">
              #1 in TV Shows Today
            </div>
          </div>

          <!-- Title -->
          <h2 class="text-6xl font-extrabold tracking-tight mb-4 text-white/90 drop-shadow-lg">
            {{ show.name }}
          </h2>

          <!-- Rating and Genre -->
          <div class="flex items-center space-x-4 mb-4 text-sm text-white/80">
            <div class="flex items-center">
              <span class="text-yellow-500 mr-1">★</span>
              <span class="font-medium">{{ show.rating.average ?? 'N/A' }}</span>
            </div>
            <span class="text-white/60">•</span>
            <span>{{ show.genres.join(' • ') }}</span>
          </div>

          <!-- Description -->
          <p class="text-lg text-white/80 mb-8 line-clamp-2 max-w-xl">
            {{ formattedSummary }}
          </p>

          <!-- Buttons -->
          <div class="flex items-center gap-4">
            <nuxt-link
              class="inline-flex items-center px-8 py-3 bg-white/25 hover:bg-white/30 text-white font-medium rounded-md transition-colors duration-200"
              :to="`/shows/${show.id}`"
            >
              <svg
                class="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              More Info
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
