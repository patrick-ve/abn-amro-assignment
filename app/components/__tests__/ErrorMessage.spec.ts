import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ErrorMessage from './ErrorMessage.vue'

describe('errorMessage', () => {
  it('renders the error message correctly', () => {
    const message = 'Test error message'
    const { getByText } = render(ErrorMessage, {
      props: { message },
    })

    expect(getByText(message)).toBeInTheDocument()
  })

  it('handles empty message prop', () => {
    const { container } = render(ErrorMessage, {
      props: { message: '' },
    })

    const messageContainer = container.firstElementChild
    expect(messageContainer?.textContent?.trim()).toBe('')
  })

  it('handles special characters in message', () => {
    const specialMessage = '!@#$%^&*()_+'
    const { getByText } = render(ErrorMessage, {
      props: { message: specialMessage },
    })

    expect(getByText(specialMessage)).toBeInTheDocument()
  })

  it('is accessible', () => {
    const message = 'Error occurred'
    const { container } = render(ErrorMessage, {
      props: { message },
    })

    const alert = container.querySelector('[role="alert"]')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(message)
  })
})
