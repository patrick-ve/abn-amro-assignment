<script setup lang="ts">
import type { Show } from '~/types/show'
import { useHead } from '#app'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShowDetail from '~/components/ShowDetail.vue'
import TheHeader from '~/components/TheHeader.vue'

const route = useRoute()
const router = useRouter()
const showId = Number(route.params.id)
const show = ref<Show | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Fetch show details from the API
async function fetchShowDetails() {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch<Show>(`https://api.tvmaze.com/shows/${showId}`)

    if (!response) {
      throw new Error('No response from API')
    }

    show.value = response
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  }
  finally {
    isLoading.value = false
  }
}

// Handle back button click
function goBack() {
  router.back()
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
          @click="goBack"
        >
          Back to shows overview
        </button>
      </div>
    </div>

    <!-- Show Details -->
    <ShowDetail
      v-else-if="show"
      :show="show"
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
  </main>
</template>
