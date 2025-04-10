<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  label?: string
  error?: string
  dataTestid?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2)}`)
const errorId = computed(() => props.error ? `error-${inputId.value}` : undefined)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputRef = ref<HTMLInputElement | null>(null)

function clearAndFocus() {
  emit('update:modelValue', '')
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})

defineExpose({
  clearAndFocus,
})
</script>

<template>
  <div class="input-wrapper">
    <label
      v-if="label"
      :for="inputId"
      class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :name="name"
        :data-testid="dataTestid"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" :class="[
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-700',
        ]"
        :aria-describedby="errorId"
        @input="handleInput"
      >
      <slot />
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>
