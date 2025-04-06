<script setup lang="ts">
import type { GroupedShows, Show } from '@/types/show'
import { navigateTo, useHead } from '#app'
import { computed, onMounted, ref } from 'vue'
import ErrorMessage from '~/components/Base/ErrorMessage.vue'
import LoadingSpinner from '~/components/Base/LoadingSpinner.vue'
import BaseModal from '~/components/Base/Modal.vue'
import GenreList from '~/components/GenreList.vue'
import Hero from '~/components/Hero.vue'
import SearchContainer from '~/components/Search/SearchContainer.vue'
import SearchResults from '~/components/SearchResults.vue'
import TheHeader from '~/components/TheHeader.vue'

const isLoading = ref(true)
const error = ref<string | null>(null)
const shows = ref<Show[]>([])
const isSearchModalOpen = ref(false)
const searchResults = ref<Show[]>([])
const isSearchLoading = ref(false)
const searchError = ref<string | null>(null)

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

async function handleSearch(query: string) {
  if (!query.trim()) {
    searchResults.value = []
    searchError.value = null
    isSearchLoading.value = false
    return
  }

  isSearchLoading.value = true
  searchError.value = null

  try {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    searchResults.value = data.map((item: { show: Show }) => ({
      id: item.show.id,
      name: item.show.name,
      genres: item.show.genres || [],
      rating: { average: item.show.rating?.average || null },
      image: item.show.image || null,
      summary: item.show.summary || '',
      premiered: item.show.premiered || null,
      ended: item.show.ended || null,
      status: item.show.status || 'Unknown',
      schedule: item.show.schedule || { time: '', days: [] },
    }))
    searchError.value = null
  }
  catch (err) {
    console.error('Search error:', err)
    searchError.value = 'Failed to fetch search results'
    searchResults.value = []
  }
  finally {
    isSearchLoading.value = false
  }
}

function toggleSearchModal() {
  isSearchModalOpen.value = !isSearchModalOpen.value
  if (!isSearchModalOpen.value) {
    searchResults.value = []
    searchError.value = null
    isSearchLoading.value = false
  }
}

function handleShowSelected(showId: number) {
  isSearchModalOpen.value = false
  navigateTo(`/shows/${showId}`)
}

onMounted(() => {
  fetchShows()
})

useHead({
  title: 'Overview Page',
})
</script>

<template>
  <main class="min-h-screen bg-black dark:bg-gray-900">
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
      v-if="!isLoading && !error && randomShow"
      :show="randomShow"
      @show-selected="handleShowSelected"
    />

    <div class="container mx-auto py-8">
      <LoadingSpinner v-if="isLoading" />
      <ErrorMessage
        v-else-if="error"
        :message="error"
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
        <LoadingSpinner v-if="isSearchLoading" />
        <ErrorMessage
          v-else-if="searchError"
          :message="searchError"
        />
        <SearchResults
          v-else
          :shows="searchResults"
          :is-loading="isSearchLoading"
          :error="searchError"
          @show-selected="handleShowSelected"
        />
      </template>
    </BaseModal>
  </main>
</template>
