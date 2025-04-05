<script setup lang="ts">
import { useDebounce } from '@/composables/useDebounce'
import { ref } from 'vue'
import Input from '~/components/Base/Input.vue'

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 500)

watch(debouncedSearchQuery, (newValue) => {
  emit('search', newValue)
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
