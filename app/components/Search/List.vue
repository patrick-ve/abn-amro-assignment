<script setup lang="ts">
import type { Show } from '~/types/show'
import { computed } from 'vue'
import SearchResultCard from './SearchResultCard.vue'

const props = defineProps<{
  isLoading: boolean
  shows: Show[]
  error: string | null
}>()

const emit = defineEmits<{
  showSelected: [id: number]
}>()

const sortedShows = computed(() => {
  return [...props.shows].sort((a, b) => {
    const ratingA = a.rating.average ?? 0
    const ratingB = b.rating.average ?? 0
    return ratingB - ratingA
  })
})

const resultsState = computed(() => {
  if (props.isLoading)
    return 'loading'
  if (props.error)
    return 'error'
  if (props.shows.length === 0)
    return 'no-results'
  return 'has-results'
})

function handleShowClick(showId: number) {
  emit('showSelected', showId)
}
</script>

<template>
  <section
    data-testid="search-results"
    aria-label="Search Results"
    class="search-results"
    :class="resultsState"
  >
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-[200px]"
    >
      <div
        data-testid="loading-spinner"
        class="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin border-t-blue-600"
      />
    </div>

    <div
      v-else-if="error"
      class="text-red-600 dark:text-red-400 text-center min-h-[200px] flex items-center justify-center"
    >
      No shows found
    </div>

    <template v-if="!isLoading && !error && shows.length">
      <div
        v-if="shows.length"
        class="flex flex-col space-y-4"
      >
        <SearchResultCard
          v-for="show in sortedShows"
          :key="show.id"
          :show="show"
          @click="handleShowClick(show.id)"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.search-results.has-results {
  height: 70vh;
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
}
</style>
