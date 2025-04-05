<script setup lang="ts">
import type { Show } from '~/types/show'

defineProps<{
  show: Show
}>()

// Nuxt Icon module should be installed for the star icon
// npm install --save-dev @nuxt/icon
</script>

<template>
  <article
    class="search-result-card flex items-start space-x-4 p-4 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white dark:bg-gray-800"
  >
    <!-- Adjusted image size for list view -->
    <div class="flex-shrink-0 w-20 h-30">
      <div class="aspect-[2/3] relative rounded overflow-hidden">
        <template v-if="show.image">
          <!-- Lazy load images in the list -->
          <img
            :src="show.image.medium"
            :alt="`${show.name} poster`"
            class="w-full h-full object-cover"
            loading="lazy"
          >
        </template>
        <div
          v-else
          class="placeholder-image w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-center"
        >
          <span class="text-gray-400 dark:text-gray-500 text-xs">No Image</span>
        </div>
      </div>
    </div>

    <div class="flex-grow min-w-0">
      <!-- Adjusted font size -->
      <h3 class="text-base font-semibold mb-1 truncate text-gray-900 dark:text-white">
        {{ show.name }}
      </h3>
      <!-- Adjusted font size -->
      <div class="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
        <Icon name="ph:star-fill" class="text-yellow-500 mr-1 flex-shrink-0" />
        <span>{{ show.rating.average ? show.rating.average.toFixed(1) : 'N/A' }}</span>
      </div>
      <!-- Adjusted font size -->
      <div
        v-if="show.summary"
        class="text-xs text-gray-700 dark:text-gray-300 line-clamp-3"
        v-html="show.summary"
      />
      <!-- Adjusted font size -->
      <div v-else class="text-xs text-gray-500 dark:text-gray-400 italic">
        No summary available.
      </div>
    </div>
  </article>
</template>

<style scoped>
.search-result-card {
  /* Add any specific styles if needed */
}
.placeholder-image {
  line-height: 1.1;
}
</style>
