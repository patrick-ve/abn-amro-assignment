<!-- GenreList.vue -->
<script setup lang="ts">
import type { Show } from '~/types/show'
import ShowCard from './ShowCard.vue'

const props = defineProps<{
  genre: string
  shows: Show[]
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
    :aria-label="`${genre} shows`"
    class="genre-list py-6"
  >
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white px-4">
      {{ genre }}
    </h2>

    <div
      v-if="shows.length"
      class="shows-container overflow-x-auto pb-4"
    >
      <div class="flex gap-4 px-4">
        <ShowCard
          v-for="show in sortedShows"
          :key="show.id"
          :show="show"
          @click="handleShowClick(show.id)"
        />
      </div>
    </div>
    <div
      v-else
      class="text-gray-500 dark:text-gray-400 px-4"
    >
      No shows available
    </div>
  </section>
</template>

<style scoped>
.shows-container {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') theme('colors.gray.100');
}

.shows-container::-webkit-scrollbar {
  height: 6px;
}

.shows-container::-webkit-scrollbar-track {
  background: theme('colors.gray.100');
  border-radius: 3px;
}

.shows-container::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.300');
  border-radius: 3px;
}

@media (prefers-color-scheme: dark) {
  .shows-container {
    scrollbar-color: theme('colors.gray.600') theme('colors.gray.800');
  }

  .shows-container::-webkit-scrollbar-track {
    background: theme('colors.gray.800');
  }

  .shows-container::-webkit-scrollbar-thumb {
    background-color: theme('colors.gray.600');
  }
}
</style>
