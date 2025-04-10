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

    const initialEmit = emitted()
    expect(initialEmit.search).toBeFalsy()

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

    vi.advanceTimersByTime(400)
    await nextTick()

    const result = emitted()
    expect(result.search).toBeFalsy()
  })

  it('handles rapid input changes correctly', async () => {
    const { getByTestId, emitted } = render(Container)
    const input = getByTestId('search-input')

    await fireEvent.update(input, 'first')
    vi.advanceTimersByTime(200)

    await fireEvent.update(input, 'second')
    vi.advanceTimersByTime(200)

    await fireEvent.update(input, 'final')
    vi.advanceTimersByTime(500)
    await nextTick()

    const result = emitted()
    expect(result.search).toBeTruthy()
    expect(result.search?.length).toBe(1)
    expect(result.search?.[0]).toEqual(['final'])
  })

  it('handles empty input correctly', async () => {
    const { getByTestId, emitted } = render(Container)
    const input = getByTestId('search-input')

    await fireEvent.update(input, 'test')
    vi.advanceTimersByTime(100)
    await nextTick()

    await fireEvent.update(input, '')
    vi.advanceTimersByTime(500)
    await nextTick()
    await nextTick()

    const result = emitted()
    expect(result.search).toBeTruthy()
    expect(result.search?.[0]).toEqual([''])
  })
})
