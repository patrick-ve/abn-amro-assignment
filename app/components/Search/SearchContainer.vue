<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import Input from '~/components/Base/Input.vue'

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')

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

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <Input
      v-model="searchQuery"
      type="search"
      placeholder="Search shows by title, genre, or description"
      class="w-full"
      data-testid="search-input"
    />
  </div>
</template>
