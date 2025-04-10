<script setup lang="ts">
import { navigateTo, useHead } from '#app'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ShowDetail from '~/components/Show/Detail.vue'
import TheHeader from '~/components/TheHeader.vue'
import { getCachedShowById, useFetchShowDetails } from '~/composables/useFetchShows'

const route = useRoute()

const showId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? Number.parseInt(id, 10) : (typeof id === 'number' ? id : undefined)
})

const cachedShow = computed(() => {
  const id = showId.value
  return id !== undefined ? getCachedShowById(id) : undefined
})

const { showDetails, loading, error } = useFetchShowDetails(computed(() => showId.value ?? ''))

useHead(() => {
  const titleName = showDetails.value?.name ?? cachedShow.value?.name
  return {
    title: titleName ? `ABNFLIX - ${titleName} - TV Shows` : (loading.value ? 'ABNFLIX - Loading...' : 'ABNFLIX - Show Details'),
  }
})

function goBack() {
  navigateTo('/')
}
</script>

<template>
  <TheHeader>
    <template #left>
      <nuxt-link
        aria-label="Back to shows overview"
        class="flex items-center text-white transition-colors cursor-pointer group hover:text-gray-300"
        to="/"
      >
        <svg
          class="w-6 h-6 mr-2 transition-transform duration-200 ease-in-out group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span class="hidden font-semibold md:block">Back to shows overview</span>
      </nuxt-link>
    </template>
  </TheHeader>

  <div class="min-h-screen bg-gray-50 dark:bg-stone-900">
    <div
      v-if="loading"
      class="flex items-center justify-center min-h-screen"
    >
      <div class="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin border-t-blue-600" />
    </div>

    <div
      v-else-if="error"
      class="container px-4 py-8 mx-auto"
    >
      <div class="text-center">
        <p class="mb-4 text-red-600 dark:text-red-400">
          {{ error }}
        </p>
        <button
          class="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          @click="goBack"
        >
          Back to shows overview
        </button>
      </div>
    </div>

    <ShowDetail
      v-else-if="showDetails"
      :show="showDetails"
      @close="goBack"
    />

    <div
      v-else
      class="container px-4 py-8 mx-auto"
    >
      <div class="text-center">
        <p class="mb-4 text-gray-600 dark:text-gray-400">
          Show not found
        </p>
        <button
          class="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          @click="goBack"
        >
          Back to shows overview
        </button>
      </div>
    </div>
  </div>
</template>
