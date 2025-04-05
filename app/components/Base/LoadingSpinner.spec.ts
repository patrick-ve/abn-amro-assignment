import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import LoadingSpinner from './LoadingSpinner.vue'

describe('loadingSpinner', () => {
  it('renders the loading spinner with correct styles', () => {
    const { container } = render(LoadingSpinner)

    // Check if the spinner container has the correct classes
    const spinnerContainer = container.firstElementChild
    expect(spinnerContainer).toHaveClass('flex', 'justify-center', 'items-center', 'min-h-[400px]')

    // Check if the spinner element has the correct classes
    const spinner = spinnerContainer?.firstElementChild
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-4',
      'border-gray-300',
      'border-t-blue-600',
    )
  })

  it('maintains consistent dimensions', () => {
    const { container } = render(LoadingSpinner)
    const spinner = container.querySelector('.animate-spin')

    // Tailwind h-12 and w-12 classes should be present
    expect(spinner).toHaveClass('h-12', 'w-12')
  })
})
