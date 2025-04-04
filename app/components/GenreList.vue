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

const showsContainer = ref<HTMLElement | null>(null)
const showLeftButton = ref(false)
const showRightButton = ref(false)
const resizeObserver = ref<ResizeObserver | null>(null)
const itemWidth = ref(0)
const gap = 16 // 4 in Tailwind equals 16px

const hasOverflow = computed(() => {
  if (!showsContainer.value)
    return false
  return Math.round(showsContainer.value.scrollWidth) > Math.round(showsContainer.value.clientWidth)
})

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

  // Hide buttons if content doesn't overflow
  if (scrollWidth <= clientWidth) {
    showLeftButton.value = false
    showRightButton.value = false
  }
}

function scrollShows(direction: 'left' | 'right') {
  if (!showsContainer.value)
    return

  // Calculate scroll amount based on visible items (approximately 3 items)
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

  // Get the width of a single item
  const firstItem = showsContainer.value.querySelector('.show-card')
  if (firstItem)
    itemWidth.value = firstItem.clientWidth

  // Initial check for overflow
  nextTick(() => {
    updateScrollButtons()
  })

  // Add scroll listener
  showsContainer.value.addEventListener('scroll', updateScrollButtons)

  // Setup resize observer
  resizeObserver.value = new ResizeObserver(() => {
    nextTick(() => {
      // Update item width on resize
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
    :aria-label="`${genre} shows`"
    class="genre-list py-6"
  >
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white px-4">
      {{ genre }}
    </h2>

    <div class="relative group">
      <button
        v-show="hasOverflow && showLeftButton"
        class="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-r-lg transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
        :class="{ 'cursor-not-allowed opacity-0': !showLeftButton }"
        aria-label="Scroll left"
        @click="scrollShows('left')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <template v-if="shows.length">
        <div
          ref="showsContainer"
          class="shows-container overflow-x-auto pb-4 scroll-smooth relative"
        >
          <div class="flex gap-4 px-4">
            <ShowCard
              v-for="show in sortedShows"
              :key="show.id"
              :show="show"
              class="show-card flex-none transition-transform duration-200 hover:scale-105"
              @click="handleShowClick(show.id)"
            />
          </div>
        </div>

        <button
          v-show="hasOverflow && showRightButton"
          class="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-l-lg transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          :class="{ 'cursor-not-allowed opacity-0': !showRightButton }"
          aria-label="Scroll right"
          @click="scrollShows('right')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>
      <div
        v-else
        class="text-gray-500 dark:text-gray-400 px-4"
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
