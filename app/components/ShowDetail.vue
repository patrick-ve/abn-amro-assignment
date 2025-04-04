<!-- ShowDetail.vue -->
<script setup lang="ts">
import type { Show } from '~/types/show'

const props = defineProps<{
  show: Show
}>()

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}

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
  <article class="show-detail bg-white dark:bg-gray-800 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-end mb-4">
        <button
          data-testid="close-button"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="handleClose"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="aspect-[2/3] relative">
          <template v-if="show.image">
            <img
              :src="show.image.original"
              :alt="`${show.name} poster`"
              class="w-full h-full object-cover rounded-lg shadow-lg"
            >
          </template>
          <div
            v-else
            class="placeholder-image w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <span class="text-gray-400">No Image Available</span>
          </div>
        </div>

        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ show.name }}
          </h1>

          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="genre in show.genres"
                :key="genre"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium"
              >
                {{ genre }}
              </span>
            </div>

            <div class="flex items-center">
              <span class="text-yellow-500 mr-2">★</span>
              <span class="text-gray-700 dark:text-gray-300">{{ show.rating.average ?? 'N/A' }}</span>
            </div>

            <div class="text-gray-600 dark:text-gray-400">
              <p class="mb-2">
                <strong>Network:</strong> {{ show.network?.name ?? 'Not available' }}
              </p>
              <p class="mb-2">
                <strong>Schedule:</strong> {{ show.schedule.time }} on {{ show.schedule.days.join(', ') }}
              </p>
              <p class="mb-2">
                <strong>Status:</strong> {{ show.status }}
              </p>
              <p class="mb-2">
                <strong>Premiered:</strong> {{ show.premiered }}
              </p>
              <p v-if="show.ended" class="mb-2">
                <strong>Ended:</strong> {{ show.ended }}
              </p>
            </div>

            <div class="mt-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Summary
              </h2>
              <p class="text-gray-600 dark:text-gray-400">
                {{ formattedSummary }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
