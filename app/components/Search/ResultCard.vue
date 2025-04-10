<script setup lang="ts">
import type { Show } from '~/types/show'

defineProps<{
  show: Show
}>()
</script>

<template>
  <article
    class="flex items-start p-4 space-x-4 overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md cursor-pointer search-result-card hover:shadow-lg dark:bg-gray-800"
  >
    <div class="flex-shrink-0 w-20 h-30">
      <div class="aspect-[2/3] relative rounded overflow-hidden">
        <img
          v-if="show.image"
          :src="show.image.medium"
          :alt="`${show.name} poster`"
          class="object-cover w-full h-full"
          loading="lazy"
        >
        <div
          v-else
          class="flex items-center justify-center w-full h-full text-center bg-gray-200 placeholder-image dark:bg-gray-700"
        >
          <span class="text-xs text-gray-400 dark:text-gray-500">No Image</span>
        </div>
      </div>
    </div>

    <div class="flex-grow min-w-0">
      <h3 class="mb-1 text-base font-semibold text-gray-900 truncate dark:text-white">
        {{ show.name }}
      </h3>

      <div class="flex items-center mb-2 text-xs text-gray-600 dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="flex-shrink-0 w-4 h-4 mr-1 text-yellow-500"
        >
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.502 2.825c-.995.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ show.rating.average ? show.rating.average.toFixed(1) : 'N/A' }}</span>
      </div>

      <div
        v-if="show.summary"
        class="text-xs text-gray-700 dark:text-gray-300 line-clamp-3"
        v-html="show.summary"
      />

      <div v-else class="text-xs italic text-gray-500 dark:text-gray-400">
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
