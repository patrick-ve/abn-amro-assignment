<script setup lang="ts">
import type { Show } from '~/types/show'

defineProps<{
  show: Show
}>()
</script>

<template>
  <article
    :data-testid="`show-card-${show.id}`"
    class="relative overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg cursor-pointer show-card hover:shadow-xl dark:bg-gray-800"
  >
    <nuxt-link :to="`/shows/${show.id}`">
      <div class="aspect-[2/3] relative">
        <template v-if="show.image">
          <img
            :src="show.image.medium"
            :alt="`${show.name} poster`"
            class="object-cover w-full h-full"
          >
        </template>
        <div
          v-else
          class="flex items-center justify-center w-full h-full bg-gray-200 placeholder-image dark:bg-gray-700"
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
