<script setup lang="ts">
import type { Show } from '~/types/show'

defineProps<{
  show: Show
}>()
</script>

<template>
  <article
    class="show-card relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white dark:bg-gray-800"
  >
    <nuxt-link :to="`/shows/${show.id}`">
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
    </nuxt-link>
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
