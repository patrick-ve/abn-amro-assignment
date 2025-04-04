<script setup lang="ts">
import type { Show } from '~/types/show'
import { ref } from 'vue'
import ShowDetail from '~/components/ShowDetail.vue'

const route = useRoute()
const showId = computed(() => Number(route.params.id))
const show = ref<Show | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Fetch show details from the API
async function fetchShowDetails() {
  try {
    isLoading.value = true
    error.value = null
    const response = await fetch(`https://api.tvmaze.com/shows/${showId.value}`)
    if (!response.ok)
      throw new Error('Failed to fetch show details')
    show.value = await response.json()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  }
  finally {
    isLoading.value = false
  }
}

// Handle close button click
function handleClose() {
  navigateTo('/')
}

// Watch for route changes to refetch data
watch(() => route.params.id, () => {
  fetchShowDetails()
})

// Fetch show details on component mount
onMounted(() => {
  fetchShowDetails()
})

// Set page title
useHead(() => ({
  title: show.value ? `${show.value.name} - TV Shows` : 'Loading...',
}))
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div
      v-if="isLoading"
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
          @click="handleClose"
        >
          Back to Home
        </button>
      </div>
    </div>

    <!-- Show Details -->
    <ShowDetail
      v-else-if="show"
      :show="show"
      @close="handleClose"
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
          @click="handleClose"
        >
          Back to Home
        </button>
      </div>
    </div>
  </main>
</template>
