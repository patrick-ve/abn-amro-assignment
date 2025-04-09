<script setup lang="ts">
import type { GroupedShows, Show } from '@/types/show'
import { navigateTo, useHead } from '#app'
import { computed, ref } from 'vue'
import ErrorMessage from '~/components/Base/ErrorMessage.vue'
import LoadingSpinner from '~/components/Base/LoadingSpinner.vue'
import BaseModal from '~/components/Base/Modal.vue'
import GenreList from '~/components/GenreList.vue'
import Hero from '~/components/Hero.vue'
import SearchContainer from '~/components/Search/SearchContainer.vue'
import SearchResults from '~/components/SearchResults.vue'
import TheHeader from '~/components/TheHeader.vue'
import { useFetchAllShows, useSearchShows } from '~/composables/useFetchShows'

const isSearchModalOpen = ref(false)

// Fetch all shows (immediate: true by default in the composable)
const { shows, loading: loadingAllShows, error: errorAllShows } = useFetchAllShows()

// Setup search composable (uses manual state and $fetch internally)
const { searchResults, loading: loadingSearch, error: errorSearch, search } = useSearchShows()

// Ref for the search query input (could be passed down to SearchContainer)
const currentSearchQuery = ref('') // Needed for debouncing or watching

const randomShow = computed<Show | null>(() => {
  if (!shows.value.length)
    return null
  const index = Math.floor(Math.random() * shows.value.length)
  return shows.value[index] ?? null
})

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

async function handleSearch(query: string) {
  currentSearchQuery.value = query // Update the ref
  // The actual search execution can be triggered directly,
  // or via a watcher on currentSearchQuery (e.g., with debounce)
  await search(query) // Call the search function from the composable
}

function toggleSearchModal() {
  isSearchModalOpen.value = !isSearchModalOpen.value
  if (!isSearchModalOpen.value) {
    searchResults.value = []
    currentSearchQuery.value = '' // Clear search query on close
    // Clear search error/loading? The composable handles this internally on next search
  }
}

function handleShowSelected(showId: number) {
  isSearchModalOpen.value = false
  navigateTo(`/shows/${showId}`)
}

useHead({
  title: 'Overview Page',
})
</script>

<template>
  <div class="min-h-screen bg-black dark:bg-gray-900">
    <TheHeader>
      <template #right>
        <button
          data-testid="search-button"
          class="p-2 rounded-full hover:bg-white/10 transition-colors"
          :aria-label="isSearchModalOpen ? 'Close search modal' : 'Open search modal'"
          @click="toggleSearchModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </template>
    </TheHeader>

    <Hero
      v-if="!loadingAllShows && !errorAllShows && randomShow"
      :show="randomShow"
      @show-selected="handleShowSelected"
    />

    <div class="container mx-auto py-8">
      <h1 class="text-2xl font-bold text-white mb-4">
        Movie Overview
      </h1>

      <LoadingSpinner v-if="loadingAllShows && !shows?.length" />

      <ErrorMessage
        v-else-if="errorAllShows"
        :message="errorAllShows?.message || 'Failed to load shows'"
      />

      <div
        v-else
        class="space-y-8"
      >
        <GenreList
          v-for="(genreShows, genre) in showsByGenre"
          :key="String(genre)"
          :shows="genreShows"
          :genre="String(genre)"
          @show-selected="handleShowSelected"
        />
      </div>
    </div>

    <BaseModal v-model="isSearchModalOpen">
      <template #search-bar>
        <SearchContainer @search="handleSearch" />
      </template>
      <template #results>
        <LoadingSpinner v-if="loadingSearch && isSearchModalOpen" />
        <ErrorMessage
          v-else-if="errorSearch && isSearchModalOpen"
          :message="errorSearch?.message || 'Search failed'"
        />
        <SearchResults
          v-else
          :shows="searchResults"
          :is-loading="loadingSearch && isSearchModalOpen"
          :error="errorSearch && isSearchModalOpen ? (errorSearch.message || 'Search Error') : null"
          @show-selected="handleShowSelected"
        />
      </template>
    </BaseModal>
  </div>
</template>
