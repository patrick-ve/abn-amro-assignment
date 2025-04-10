<!-- ShowDetail.vue -->
<script setup lang="ts">
import type { Show } from '~/types/show'
import { computed } from 'vue'

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

const networkInfo = computed(() => {
  if (!props.show.network)
    return 'Not available'

  return `${props.show.network.name} (${props.show.network.country?.name || 'Unknown country'})`
})
</script>

<template>
  <article class="text-white bg-stone-900 show-detail">
    <div class="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
        <div class="lg:col-span-1 aspect-w-2 aspect-h-3">
          <template v-if="show.image">
            <img
              :src="show.image.original"
              :alt="`${show.name} poster`"
              class="object-cover w-full h-full rounded-lg shadow-lg"
              loading="lazy"
            >
          </template>
          <div
            v-else
            class="flex items-center justify-center w-full h-full bg-gray-800 rounded-lg placeholder-image"
          >
            <span class="text-gray-500">No Image Available</span>
          </div>
        </div>

        <div class="lg:col-span-2">
          <h1 class="mb-4 text-4xl font-bold text-white sm:text-5xl">
            {{ show.name }}
          </h1>

          <div class="space-y-6">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="genre in show.genres"
                :key="genre"
                class="px-3 py-1 text-sm font-medium text-gray-200 bg-gray-700 rounded-full"
              >
                {{ genre }}
              </span>
            </div>

            <div class="flex flex-wrap items-center text-lg gap-x-4 gap-y-2">
              <div class="flex items-center">
                <span class="mr-1 text-xl text-yellow-400">★</span>
                <span class="text-gray-300">{{ show.rating.average ?? 'N/A' }}</span>
              </div>
              <span class="hidden text-gray-500 sm:inline">|</span>
              <span class="text-gray-300">{{ show.type }}</span>
              <span class="hidden text-gray-500 sm:inline">|</span>
              <span class="text-gray-300">{{ show.language }}</span>
            </div>

            <div class="mt-6">
              <h2 class="mb-2 text-2xl font-semibold text-white">
                Summary
              </h2>
              <p class="leading-relaxed text-gray-300">
                {{ formattedSummary }}
              </p>
            </div>

            <div class="grid grid-cols-1 mt-6 text-gray-300 sm:grid-cols-2 gap-x-8 gap-y-4">
              <p>
                <strong>Network:</strong> {{ networkInfo }}
              </p>
              <p>
                <strong>Schedule:</strong> {{ show.schedule.days.join(', ') || 'N/A' }} at {{ show.schedule.time || 'N/A' }}
              </p>
              <p>
                <strong>Runtime:</strong> {{ show.runtime ? `${show.runtime} min` : 'N/A' }}
              </p>
              <p>
                <strong>Status:</strong> {{ show.status }}
              </p>
              <p>
                <strong>Premiered:</strong> {{ show.premiered || 'N/A' }}
              </p>
              <p v-if="show.ended">
                <strong>Ended:</strong> {{ show.ended }}
              </p>
              <p v-if="show.officialSite" class="sm:col-span-2">
                <strong>Official Site:</strong>
                <a
                  :href="show.officialSite"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-500 underline transition-colors hover:text-blue-400"
                >
                  Visit Website
                </a>
              </p>
            </div>

            <div v-if="show.externals.imdb" class="mt-8">
              <a
                :href="`https://www.imdb.com/title/${show.externals.imdb}`"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                View on IMDb
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
