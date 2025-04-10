import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import LoadingSpinner from '../Base/LoadingSpinner.vue'

describe('loadingSpinner', () => {
  it('renders the loading spinner', () => {
    const { container } = render(LoadingSpinner)
    const spinnerContainer = container.firstChild

    expect(spinnerContainer).not.toBeNull()
    expect(spinnerContainer instanceof Element).toBe(true)
  })

  it('maintains consistent dimensions', () => {
    const { container } = render(LoadingSpinner)
    const spinnerContainer = container.firstChild

    expect(spinnerContainer instanceof Element).toBe(true)
    if (spinnerContainer instanceof Element) { // Type guard
      const spinner = spinnerContainer.firstElementChild
      expect(spinner).toHaveClass('h-12', 'w-12')
    }
  })
})
