<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div
    class="text-center text-red-600 dark:text-red-400 min-h-[400px] flex items-center justify-center"
    role="alert"
  >
    {{ message }}
  </div>
</template>
