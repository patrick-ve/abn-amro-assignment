<!-- ShowCard.vue -->
<script setup lang="ts">
import type { Show } from '~/types/show'

const props = defineProps<{
  show: Show
}>()

const emit = defineEmits<{
  click: [id: number]
}>()

function handleClick() {
  emit('click', props.show.id)
}
</script>

<template>
  <article
    class="show-card relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white dark:bg-gray-800"
    @click="handleClick"
  >
    <div class="aspect-[2/3] relative">
      <template v-if="show.image">
        <img
          :src="show.image.medium"
          :alt="`${show.name} poster`"
          class="w-full h-full object-cover"
        >
      </template>
      <div
        v-else
        class="placeholder-image w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
      >
        <span class="text-gray-400">No Image</span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">
        {{ show.name }}
      </h3>

      <div class="flex items-center justify-between mb-2">
        <span
          v-if="show.genres.length"
          class="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          {{ show.genres[0] }}
        </span>
        <div class="flex items-center">
          <span class="text-yellow-500 mr-1">★</span>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ show.rating.average ?? 'N/A' }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.show-card {
  width: 200px;
}

@media (max-width: 640px) {
  .show-card {
    width: 160px;
  }
}
</style>
