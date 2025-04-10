import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useDebounce } from '../../composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with the initial value', () => {
    const initialValue = 'initial'
    const valueRef = ref(initialValue)
    const debouncedValue = useDebounce(valueRef, 500)
    expect(debouncedValue.value).toBe(initialValue)
  })

  it('should not update debounced value immediately', () => {
    const valueRef = ref('first')
    const debouncedValue = useDebounce(valueRef, 500)

    valueRef.value = 'second'
    expect(debouncedValue.value).toBe('first')
  })

  it('should update debounced value after the delay', async () => {
    const valueRef = ref('start')
    const delay = 500
    const debouncedValue = useDebounce(valueRef, delay)

    valueRef.value = 'updated'
    await nextTick()
    expect(debouncedValue.value).toBe('start')

    vi.advanceTimersByTime(delay)
    vi.runAllTimers()
    await nextTick()

    expect(debouncedValue.value).toBe('updated')
  })

  it('should only update with the latest value after multiple changes within the delay', async () => {
    const valueRef = ref('one')
    const delay = 500
    const debouncedValue = useDebounce(valueRef, delay)

    valueRef.value = 'two'
    await nextTick()
    vi.advanceTimersByTime(200)

    valueRef.value = 'three'
    await nextTick()
    vi.advanceTimersByTime(200)

    valueRef.value = 'four'
    await nextTick()
    expect(debouncedValue.value).toBe('one')

    vi.advanceTimersByTime(delay)
    vi.runAllTimers()
    await nextTick()
    expect(debouncedValue.value).toBe('four')
  })

  it('should handle rapid updates correctly', async () => {
    const valueRef = ref(0)
    const delay = 100
    const debouncedValue = useDebounce(valueRef, delay)

    valueRef.value = 1
    await nextTick()
    vi.advanceTimersByTime(50)
    valueRef.value = 2
    await nextTick()
    vi.advanceTimersByTime(50)
    valueRef.value = 3
    await nextTick()

    expect(debouncedValue.value).toBe(0)

    vi.advanceTimersByTime(delay)
    vi.runAllTimers()
    await nextTick()
    expect(debouncedValue.value).toBe(3)
  })

  it('should clear previous timeout if value changes again', async () => {
    const valueRef = ref('a')
    const delay = 500
    const debouncedValue = useDebounce(valueRef, delay)

    valueRef.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(300)

    valueRef.value = 'c'
    await nextTick()
    expect(debouncedValue.value).toBe('a')

    vi.advanceTimersByTime(300)

    vi.advanceTimersByTime(delay - 300)
    vi.runAllTimers()
    await nextTick()
    expect(debouncedValue.value).toBe('c')
  })
})
