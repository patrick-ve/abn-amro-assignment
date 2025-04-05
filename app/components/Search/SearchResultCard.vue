<script setup lang="ts">
import type { Show } from '~/types/show'

defineProps<{
  show: Show
}>()
</script>

<template>
  <article
    class="search-result-card flex items-start space-x-4 p-4 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white dark:bg-gray-800"
  >
    <!-- Adjusted image size for list view -->
    <div class="flex-shrink-0 w-20 h-30">
      <div class="aspect-[2/3] relative rounded overflow-hidden">
        <img
          v-if="show.image"
          :src="show.image.medium"
          :alt="`${show.name} poster`"
          class="w-full h-full object-cover"
          loading="lazy"
        >
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-4 h-4 text-yellow-500 mr-1 flex-shrink-0"
        >
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.502 2.825c-.995.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          />
        </svg>
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
.placeholder-image {
  line-height: 1.1;
}
</style>
