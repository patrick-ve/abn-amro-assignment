<script setup lang="ts">
import type { Show } from '~/types/show'
import { computed } from 'vue'

const props = defineProps<{
  show: Show
}>()

const shortenedSummary = computed(() => {
  if (!props.show.summary)
    return 'No summary available.'

  const cleanSummary = props.show.summary.replace(/<[^>]*>/g, '')

  const sentences = cleanSummary.match(/[^.!?]+[.!?]+/g) || []

  const numSentences = Math.min(sentences.length, 3)
  const truncated = sentences.slice(0, numSentences).join('')

  return sentences.length > numSentences ? `${truncated}...` : truncated
})
</script>

<template>
  <section
    aria-label="Featured Show"
    class="relative bg-black text-white h-[50vh] overflow-hidden"
  >
    <div class="relative h-full container mx-auto px-4 py-8">
      <div class="h-full flex items-center gap-8">
        <div class="w-1/4 h-full relative">
          <div v-if="show.image" class="h-full">
            <img
              :src="show.image.original"
              :alt="`${show.name} poster`"
              class="w-auto h-full object-cover"
            >
          </div>
          <div
            v-else
            class="placeholder-image w-full h-full bg-gray-900 flex items-center justify-center"
          >
            <span class="text-gray-600">No Image Available</span>
          </div>
        </div>

        <div class="w-3/4">
          <div class="flex items-center gap-2 mb-4">
            <div class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              TOP 10
            </div>
            <div class="text-sm font-semibold text-white/90">
              #1 in TV Shows Today
            </div>
          </div>

          <h2 class="text-6xl font-extrabold tracking-tight mb-4 text-white/90 drop-shadow-lg">
            {{ show.name }}
          </h2>

          <div class="flex items-center space-x-4 mb-4 text-sm text-white/80">
            <div class="flex items-center">
              <span class="text-yellow-500 mr-1">★</span>
              <span class="font-medium">{{ show.rating.average ?? 'N/A' }}</span>
            </div>
            <span class="text-white/60">•</span>
            <span>{{ show.genres.join(' • ') }}</span>
          </div>

          <div class="text-lg text-white/80 mb-8 max-w-[70ch] text-pretty">
            {{ shortenedSummary }}
          </div>

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
