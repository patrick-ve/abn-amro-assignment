<script setup lang="ts">
import type { Show } from '~/types/show'
import { computed } from 'vue'
import SearchResultCard from './Search/SearchResultCard.vue'

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

function handleShowClick(showId: number) {
  emit('showSelected', showId)
}
</script>

<template>
  <section
    aria-label="Search Results"
    class="search-results py-6"
  >
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-[200px]"
    >
      <div
        data-testid="loading-spinner"
        class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"
      />
    </div>

    <div
      v-else-if="error"
      class="text-red-600 dark:text-red-400 text-center min-h-[200px] flex items-center justify-center"
    >
      {{ error }}
    </div>

    <template v-else>
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

      <div
        v-else
        class="text-gray-500 dark:text-gray-400 text-center min-h-[200px] flex items-center justify-center"
      >
        No shows found
      </div>
    </template>
  </section>
</template>

<style scoped>
.search-results {
  min-height: 50vh;
}
</style>
