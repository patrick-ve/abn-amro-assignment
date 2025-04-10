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
    data-testid="hero-section"
    aria-label="Featured Show"
    class="relative pt-20 text-white bg-stone-900"
  >
    <div class="md:hidden">
      <div class="absolute inset-0 top-4 md:top-20">
        <img
          v-if="show.image"
          :src="show.image.original"
          :alt="`${show.name} background`"
          class="w-full h-[calc(100%-5rem)] object-cover opacity-50"
        >
        <div
          v-else
          class="placeholder-image w-full h-[calc(100%-5rem)] bg-stone-900 flex items-center justify-center"
        >
          <span class="text-gray-600">No Image Available</span>
        </div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"
        />
      </div>

      <div class="relative z-10 container mx-auto px-4 pt-[50vh] pb-8 text-center">
        <div>
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">
              TOP 10
            </div>
            <div class="text-sm font-semibold text-white/90">
              #1 in TV Shows Today
            </div>
          </div>

          <h1 class="mb-2 text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
            {{ show.name }}
          </h1>

          <div class="flex items-center justify-center mb-4 space-x-3 text-xs text-white/90">
            <div class="flex items-center text-lg">
              <span class="mr-1 text-yellow-500">★</span>
              <span class="font-medium">{{ show.rating.average ?? 'N/A' }}</span>
            </div>
            <span class="text-white/60">•</span>
            <span class="text-lg">{{ show.genres.join(' • ') }}</span>
          </div>

          <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <nuxt-link
              data-testid="hero-link-mobile"
              :to="`/shows/${show.id}`"
              class="inline-flex items-center justify-center w-full px-6 py-3 font-bold text-black transition-colors duration-200 bg-white rounded-md sm:w-auto hover:bg-white/90"
            >
              More Info
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container hidden mx-auto md:block">
      <div class="flex items-center min-h-[calc(70vh-5rem)]">
        <div class="self-stretch flex-shrink-0 md:w-1/3">
          <img
            v-if="show.image"
            :src="show.image.original"
            :alt="`${show.name} poster`"
            class="w-full h-full object-cover max-h-[calc(100vh-5rem)]"
          >
          <div
            v-else
            class="placeholder-image w-full h-full bg-stone-900 flex items-center justify-center max-h-[calc(100vh-5rem)]"
          >
            <span class="text-gray-600">No Image Available</span>
          </div>
        </div>

        <div class="pl-8 text-left md:w-2/3 lg:pl-12">
          <div>
            <h1 class="mb-2 text-5xl font-extrabold tracking-tight text-white lg:text-6xl md:mb-4 drop-shadow-lg">
              {{ show.name }}
            </h1>

            <div class="flex items-center mb-4 space-x-3 text-sm text-white/90">
              <div class="flex items-center gap-2">
                <div class="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">
                  TOP 10
                </div>
                <div class="text-sm font-semibold text-white/90">
                  #1 in TV Shows Today
                </div>
                <span class="mx-2 text-white/60">•</span>
              </div>
              <div class="flex items-center text-lg">
                <span class="mr-1 text-yellow-500">★</span>
                <span class="font-medium">{{ show.rating.average ?? 'N/A' }}</span>
              </div>
              <span class="text-white/60">•</span>
              <span class="text-lg">{{ show.genres.join(' • ') }}</span>
            </div>

            <div class="mb-6 text-white/90 md:mb-8 max-w-[60ch] text-pretty">
              {{ shortenedSummary }}
            </div>

            <div class="flex items-center gap-3">
              <nuxt-link
                data-testid="hero-link-desktop"
                class="items-center hidden px-8 py-3 font-bold text-black transition-colors duration-200 bg-white rounded-md md:inline-flex hover:bg-white/90"
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
    </div>
  </section>
</template>
