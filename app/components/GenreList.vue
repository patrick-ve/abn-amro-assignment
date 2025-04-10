<script setup lang="ts">
import type { Show } from '~/types/show'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ShowCard from './Show/Card.vue'

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

const showsContainer = ref<HTMLElement | null>(null)
const showLeftButton = ref(false)
const showRightButton = ref(false)
const resizeObserver = ref<ResizeObserver | null>(null)
const itemWidth = ref(0)
const gap = 16

function handleShowClick(showId: number) {
  emit('showSelected', showId)
}

function updateScrollButtons() {
  if (!showsContainer.value)
    return

  const tolerance = 1
  const { scrollLeft, scrollWidth, clientWidth } = showsContainer.value

  showLeftButton.value = scrollLeft > tolerance
  showRightButton.value = scrollLeft + clientWidth < scrollWidth - tolerance

  if (scrollWidth <= clientWidth) {
    showLeftButton.value = false
    showRightButton.value = false
  }
}

function scrollShows(direction: 'left' | 'right') {
  if (!showsContainer.value)
    return

  const scrollAmount = (itemWidth.value + gap) * 3
  const targetScroll = showsContainer.value.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

  showsContainer.value.scrollTo({
    left: targetScroll,
    behavior: 'smooth',
  })
}

function setupScrollContainer() {
  if (!showsContainer.value)
    return

  const firstItem = showsContainer.value.querySelector('.show-card')
  if (firstItem)
    itemWidth.value = firstItem.clientWidth

  nextTick(() => {
    updateScrollButtons()
  })

  showsContainer.value.addEventListener('scroll', updateScrollButtons)

  resizeObserver.value = new ResizeObserver(() => {
    nextTick(() => {
      const firstItem = showsContainer.value?.querySelector('.show-card')
      if (firstItem)
        itemWidth.value = firstItem.clientWidth
      updateScrollButtons()
    })
  })
  resizeObserver.value.observe(showsContainer.value)
}

function cleanupScrollContainer() {
  if (showsContainer.value) {
    showsContainer.value.removeEventListener('scroll', updateScrollButtons)
  }

  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
    resizeObserver.value = null
  }
}

onMounted(() => {
  setupScrollContainer()
})

onUnmounted(() => {
  cleanupScrollContainer()
})
</script>

<template>
  <section
    :data-testid="`genre-list-${genre}`"
    :aria-label="`${genre} shows`"
    class="py-6 genre-list"
  >
    <h2 class="px-4 mb-4 text-2xl font-bold text-white/90 dark:text-white">
      {{ genre }}
    </h2>

    <div class="relative group">
      <button
        v-show="showLeftButton"
        class="absolute top-0 bottom-0 left-0 z-20 flex items-center justify-center w-12 text-white transition-all duration-200 rounded-r-lg opacity-0 bg-stone-900/80 hover:bg-stone-900/80 backdrop-blur-sm group-hover:opacity-100"
        :class="{ 'cursor-not-allowed opacity-0': !showLeftButton }"
        aria-label="Scroll left"
        @click="scrollShows('left')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <template v-if="shows.length">
        <div
          ref="showsContainer"
          class="relative pb-4 overflow-x-auto shows-container scroll-smooth"
        >
          <div class="flex gap-4 px-4">
            <ShowCard
              v-for="show in sortedShows"
              :key="show.id"
              :show="show"
              class="flex-none transition-transform duration-200 show-card hover:scale-105"
              @click="handleShowClick(show.id)"
            />
          </div>
        </div>

        <button
          v-show="showRightButton"
          class="absolute top-0 bottom-0 right-0 z-20 flex items-center justify-center w-12 text-white transition-all duration-200 rounded-l-lg opacity-0 bg-stone-900/80 hover:bg-stone-900 backdrop-blur-sm group-hover:opacity-100"
          :class="{ 'cursor-not-allowed opacity-0': !showRightButton }"
          aria-label="Scroll right"
          @click="scrollShows('right')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>
      <div
        v-else
        class="px-4 text-gray-500 dark:text-gray-400"
      >
        No shows available
      </div>
    </div>
  </section>
</template>

<style scoped>
.shows-container {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
}

.shows-container::-webkit-scrollbar {
  display: none;
}

@media (hover: none) {
  .shows-container {
    scrollbar-width: thin;
    -ms-overflow-style: auto;
    mask-image: none;
    -webkit-mask-image: none;
  }

  .shows-container::-webkit-scrollbar {
    height: 6px;
    display: block;
  }

  .shows-container::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-gray-800;
    border-radius: 3px;
  }

  .shows-container::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600;
    border-radius: 3px;
  }
}
</style>
