import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Container from '../Search/Container.vue'

vi.useFakeTimers()

describe('container', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(cleanup)

  it('renders the search input with correct placeholder', () => {
    const { getByTestId } = render(Container)
    const input = getByTestId('search-input')

    expect(input).toHaveAttribute('placeholder', 'Search shows by title, genre, or description')
  })

  it('emits search event after debounce delay', async () => {
    const { getByTestId, emitted } = render(Container)
    const input = getByTestId('search-input')

    await fireEvent.update(input, 'test query')

    // Should not emit immediately
    const initialEmit = emitted()
    expect(initialEmit.search).toBeFalsy()

    // Fast-forward time by debounce delay (500ms)
    vi.advanceTimersByTime(500)
    await nextTick()

    const finalEmit = emitted()
    expect(finalEmit.search).toBeTruthy()
    expect(finalEmit.search?.[0]).toEqual(['test query'])
  })

  it('does not emit search event before debounce delay', async () => {
    const { getByTestId, emitted } = render(Container)
    const input = getByTestId('search-input')

    await fireEvent.update(input, 'test')

    // Fast-forward time by less than debounce delay
    vi.advanceTimersByTime(400)
    await nextTick()

    const result = emitted()
    expect(result.search).toBeFalsy()
  })

  it('handles rapid input changes correctly', async () => {
    const { getByTestId, emitted } = render(Container)
    const input = getByTestId('search-input')

    // Type multiple queries rapidly
    await fireEvent.update(input, 'first')
    vi.advanceTimersByTime(200)

    await fireEvent.update(input, 'second')
    vi.advanceTimersByTime(200)

    await fireEvent.update(input, 'final')
    vi.advanceTimersByTime(500)
    await nextTick()

    // Should only emit the final value
    const result = emitted()
    expect(result.search).toBeTruthy()
    expect(result.search?.length).toBe(1)
    expect(result.search?.[0]).toEqual(['final'])
  })

  it('handles empty input correctly', async () => {
    const { getByTestId, emitted } = render(Container)
    const input = getByTestId('search-input')

    // First, set a non-empty value
    await fireEvent.update(input, 'test')
    // Advance time slightly, but less than debounce delay
    vi.advanceTimersByTime(100)
    await nextTick()

    // Now, clear the input
    await fireEvent.update(input, '')
    // Advance timer past the debounce delay
    vi.advanceTimersByTime(500)
    await nextTick()
    // Add another tick
    await nextTick()

    const result = emitted()
    // Check that the event was emitted and the payload is ['']
    expect(result.search).toBeTruthy()
    expect(result.search?.[0]).toEqual([''])
  })
})
