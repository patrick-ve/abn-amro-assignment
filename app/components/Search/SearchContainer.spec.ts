import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SearchContainer from './SearchContainer.vue'

vi.useFakeTimers()

describe('searchContainer', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  it('renders the search input with correct placeholder', () => {
    const { getByTestId } = render(SearchContainer)
    const input = getByTestId('search-input')

    expect(input).toHaveAttribute('placeholder', 'Search shows by title, genre, or description')
  })

  it('emits search event after debounce delay', async () => {
    const { getByTestId, emitted } = render(SearchContainer)
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
    const { getByTestId, emitted } = render(SearchContainer)
    const input = getByTestId('search-input')

    await fireEvent.update(input, 'test')

    // Fast-forward time by less than debounce delay
    vi.advanceTimersByTime(400)
    await nextTick()

    const result = emitted()
    expect(result.search).toBeFalsy()
  })

  it('handles rapid input changes correctly', async () => {
    const { getByTestId, emitted } = render(SearchContainer)
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
    const { getByTestId, emitted } = render(SearchContainer)
    const input = getByTestId('search-input')

    await fireEvent.update(input, '')
    vi.advanceTimersByTime(500)
    await nextTick()

    const result = emitted()
    expect(result.search?.[0]).toEqual([''])
  })
})
