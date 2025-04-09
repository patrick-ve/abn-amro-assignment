<script setup lang="ts">
import { useHead } from '#app'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShowDetail from '~/components/ShowDetail.vue'
import TheHeader from '~/components/TheHeader.vue'
import { getCachedShowById, useFetchShowDetails } from '~/composables/useFetchShows'

const route = useRoute()
const router = useRouter()

// Reactive ref for the show ID from the route param
const showId = computed(() => {
  const id = route.params.id
  // Ensure it's a number or return undefined/null if invalid
  return typeof id === 'string' ? Number.parseInt(id, 10) : (typeof id === 'number' ? id : undefined)
})

// Attempt to get the basic show info from cache immediately
const cachedShow = computed(() => {
  const id = showId.value
  return id !== undefined ? getCachedShowById(id) : undefined
})

// Fetch full details. This will still run.
const { showDetails, loading, error } = useFetchShowDetails(showId)

// Handle back button click
function goBack() {
  router.back()
}

// Update page title using cached info first, then full details
useHead(() => {
  const titleName = showDetails.value?.name ?? cachedShow.value?.name
  return {
    title: titleName ? `${titleName} - TV Shows` : (loading.value ? 'Loading...' : 'Show Details'),
  }
})
</script>

<template>
  <TheHeader>
    <template #left>
      <button
        class="flex items-center text-white hover:text-gray-300 transition-colors cursor-pointer"
        @click="goBack"
      >
        <svg
          class="h-6 w-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to shows overview
      </button>
    </template>
  </TheHeader>

  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex justify-center items-center min-h-screen"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="container mx-auto px-4 py-8"
    >
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400 mb-4">
          {{ error }}
        </p>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          @click="goBack"
        >
          Back to shows overview
        </button>
      </div>
    </div>

    <!-- Show Details -->
    <ShowDetail
      v-else-if="showDetails"
      :show="showDetails"
      @close="goBack"
    />

    <!-- Not Found State -->
    <div
      v-else
      class="container mx-auto px-4 py-8"
    >
      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Show not found
        </p>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          @click="goBack"
        >
          Back to shows overview
        </button>
      </div>
    </div>
  </div>
</template>
