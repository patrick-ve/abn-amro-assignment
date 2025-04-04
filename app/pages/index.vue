<script setup lang="ts">
import type { GroupedShows, Show } from '~/types/show'
import { computed, ref } from 'vue'
import Input from '~/components/Base/Input.vue'
import GenreList from '~/components/GenreList.vue'
import SearchResults from '~/components/SearchResults.vue'

const searchQuery = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)
const shows = ref<Show[]>([])
const isSearching = computed(() => searchQuery.value.length > 0)

// Group shows by genre
const showsByGenre = computed<GroupedShows>(() => {
  const grouped: GroupedShows = {}
  shows.value.forEach((show) => {
    show.genres.forEach((genre) => {
      if (!grouped[genre]) {
        grouped[genre] = []
      }
      grouped[genre].push(show)
    })
  })
  return grouped
})

// Filter shows based on search query
const searchResults = computed(() => {
  if (!searchQuery.value)
    return []
  const query = searchQuery.value.toLowerCase()
  return shows.value.filter(show =>
    show.name.toLowerCase().includes(query)
    || show.genres.some(genre => genre.toLowerCase().includes(query))
    || (show.summary?.toLowerCase().includes(query)),
  )
})

// Fetch shows from the API
async function fetchShows() {
  try {
    isLoading.value = true
    error.value = null
    const response = await fetch('https://api.tvmaze.com/shows')
    if (!response.ok)
      throw new Error('Failed to fetch shows')
    shows.value = await response.json()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  }
  finally {
    isLoading.value = false
  }
}

// Handle show selection
function handleShowSelected(showId: number) {
  navigateTo(`/shows/${showId}`)
}

// Fetch shows on component mount
onMounted(() => {
  fetchShows()
})
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto mb-8">
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="Search shows by title, genre, or description"
          class="w-full"
        >
          <template #append>
            <span
              v-if="isSearching"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              Press Enter to search
            </span>
          </template>
        </Input>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex justify-center items-center min-h-[400px]"
      >
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center text-red-600 dark:text-red-400 min-h-[400px] flex items-center justify-center"
      >
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Search Results -->
        <SearchResults
          v-if="isSearching"
          :shows="searchResults"
          :is-loading="false"
          :error="null"
          @show-selected="handleShowSelected"
        />

        <!-- Genre Lists -->
        <div
          v-else
          class="space-y-8"
        >
          <GenreList
            v-for="(genreShows, genre) in showsByGenre"
            :key="genre"
            :genre="genre"
            :shows="genreShows"
            @show-selected="handleShowSelected"
          />
        </div>
      </div>
    </div>
  </main>
</template>
