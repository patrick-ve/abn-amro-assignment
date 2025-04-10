<script setup lang="ts">
import type { ShowDetails } from '~/types/show'
import { computed } from 'vue'

const props = defineProps<{
  show: ShowDetails
}>()

function stripHtml(html: string | null | undefined): string {
  if (!html)
    return ''
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, '')
  }
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

const cast = computed(() => props.show._embedded?.cast || [])
</script>

<template>
  <article class="relative overflow-hidden text-white bg-stone-900 show-detail">
    <div v-if="show.image?.original" class="absolute inset-0 z-0">
      <img
        :src="show.image.original"
        :alt="`${show.name} background`"
        class="object-cover w-full h-full opacity-15 blur-lg"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/90 to-stone-900/70" />
    </div>

    <div class="container relative z-10 px-4 py-12 mx-auto sm:px-6 lg:px-8">
      <div class="grid items-start grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 md:pt-12">
        <div class="lg:col-span-4 xl:col-span-3">
          <div class="sticky aspect-w-2 aspect-h-3 top-24">
            <template v-if="show.image?.medium">
              <img
                :src="show.image.medium"
                :alt="`${show.name} poster`"
                class="object-cover w-full h-full rounded-lg shadow-2xl"
                loading="lazy"
              >
            </template>
            <div
              v-else
              class="flex items-center justify-center w-full h-full rounded-lg bg-white/5 placeholder-image"
            >
              <span class="text-gray-500">No Image</span>
            </div>
          </div>
        </div>

        <div class="space-y-10 lg:col-span-8 xl:col-span-9">
          <div>
            <h1 class="mb-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              {{ show.name }}
            </h1>
            <div class="flex flex-wrap items-center mb-5 text-lg gap-x-4 gap-y-2 text-white/90">
              <div class="flex items-center">
                <span class="mr-1.5 text-xl text-yellow-400">★</span>
                <span>{{ show.rating.average ?? 'N/A' }}</span>
              </div>
              <span class="hidden text-white/50 sm:inline">•</span>
              <span>{{ show.type }}</span>
              <span class="hidden text-white/50 sm:inline">•</span>
              <span>{{ show.language }}</span>
              <span class="hidden text-white/50 sm:inline">•</span>
              <span>{{ show.runtime ? `${show.runtime} min` : 'N/A' }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="genre in show.genres"
                :key="genre"
                class="px-3 py-1 text-xs font-medium text-gray-200 rounded-full bg-white/10 backdrop-blur-sm"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <div v-if="formattedSummary !== 'No summary available'">
            <h2 class="mb-3 text-2xl font-semibold text-white">
              Summary
            </h2>
            <p class="leading-relaxed text-gray-300 text-pretty max-w-prose">
              {{ formattedSummary }}
            </p>
          </div>

          <div>
            <h2 class="mb-3 text-2xl font-semibold text-white">
              Details
            </h2>
            <div class="grid grid-cols-1 text-gray-300 sm:grid-cols-2 gap-x-6 gap-y-3">
              <p><strong>Network:</strong> {{ networkInfo }}</p>
              <p><strong>Schedule:</strong> {{ show.schedule.days.join(', ') || 'N/A' }} {{ show.schedule.time ? `at ${show.schedule.time}` : '' }}</p>
              <p><strong>Status:</strong> {{ show.status }}</p>
              <p><strong>Premiered:</strong> {{ show.premiered || 'N/A' }}</p>
              <p v-if="show.ended">
                <strong>Ended:</strong> {{ show.ended }}
              </p>
              <div v-if="show.officialSite || show.externals.imdb" class="flex flex-wrap items-center gap-4 sm:col-span-2">
                <a
                  v-if="show.officialSite"
                  :href="show.officialSite"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block px-4 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-stone-900"
                >
                  Visit Website <span class="ml-1 text-xs">↗</span>
                </a>
                <a
                  v-if="show.externals.imdb"
                  :href="`https://www.imdb.com/title/${show.externals.imdb}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block px-4 py-2 text-sm font-medium text-black transition-colors duration-150 ease-in-out bg-yellow-400 rounded-md shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 focus:ring-offset-stone-900"
                >
                  View on IMDb <span class="ml-1 text-xs">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div v-if="cast.length > 0">
            <h2 class="mb-4 text-2xl font-semibold text-white">
              Cast
            </h2>
            <div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              <div v-for="member in cast" :key="member.person.id" class="text-center group">
                <div class="aspect-[2/3] mb-2 overflow-hidden rounded-lg shadow-md bg-white/5">
                  <img
                    v-if="member.person.image?.medium"
                    :src="member.person.image.medium"
                    :alt="member.person.name"
                    class="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                    loading="lazy"
                  >
                  <div v-else class="flex items-center justify-center w-full h-full text-3xl text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                </div>
                <p class="text-sm font-medium text-white truncate" :title="member.person.name">
                  {{ member.person.name }}
                </p>
                <p class="text-xs text-gray-400 truncate" :title="member.character.name">
                  "{{ member.character.name }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
