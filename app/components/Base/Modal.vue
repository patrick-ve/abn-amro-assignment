<script setup lang="ts">
defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

function closeModal() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      data-testid="base-modal"
      class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] bg-stone-900/70 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      @click.self="closeModal"
      @keydown.esc="closeModal"
    >
      <div class="w-full max-w-2xl overflow-hidden bg-gray-100 rounded-lg shadow-xl dark:bg-gray-800">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <slot name="search-bar" />
        </div>

        <div class="results-container">
          <slot name="results" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
