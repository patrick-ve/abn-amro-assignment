<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import Input from '~/components/Base/Input.vue'

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')

// Manual debounce for emitting
let timeoutId: NodeJS.Timeout | null = null
const debounceDelay = 500

watch(searchQuery, (newValue) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    emit('search', newValue)
  }, debounceDelay)
})

// We need to clear the timeout on unmount
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto mb-8">
    <Input
      v-model="searchQuery"
      type="search"
      placeholder="Search shows by title, genre, or description"
      class="w-full"
      data-testid="search-input"
    />
  </div>
</template>
