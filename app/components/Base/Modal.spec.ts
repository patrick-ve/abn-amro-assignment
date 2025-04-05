import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import Modal from './Modal.vue'

describe('modal', () => {
  const slots = {
    'search-bar': '<input data-testid="search-input" />',
    'results': '<div data-testid="results-content">Results</div>',
  }

  it('is hidden by default (modelValue = false)', () => {
    render(Modal, {
      props: { modelValue: false },
      slots,
    })

    const dialog = screen.queryByRole('dialog')
    expect(dialog).toBeNull()
  })

  it('is visible when modelValue is true', () => {
    render(Modal, {
      props: { modelValue: true },
      slots,
    })

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeVisible()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders content in the search-bar slot', () => {
    render(Modal, {
      props: { modelValue: true },
      slots,
    })

    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toBeVisible()
  })

  it('renders content in the results slot', () => {
    render(Modal, {
      props: { modelValue: true },
      slots,
    })

    const resultsContent = screen.getByTestId('results-content')
    expect(resultsContent).toBeVisible()
    expect(resultsContent).toHaveTextContent('Results')
  })

  it('emits update:modelValue with false when backdrop is clicked', async () => {
    const { emitted } = render(Modal, {
      props: { modelValue: true },
      slots,
    })

    const backdrop = screen.getByRole('dialog') // The backdrop is the dialog container itself
    await fireEvent.click(backdrop)

    const updateEvent = emitted()['update:modelValue']
    expect(updateEvent).toBeTruthy()
    expect(updateEvent).toHaveLength(1)
    expect(updateEvent![0]).toEqual([false])
  })

  it('does not emit update:modelValue when content inside modal is clicked', async () => {
    const { emitted } = render(Modal, {
      props: { modelValue: true },
      slots,
    })

    const resultsContent = screen.getByTestId('results-content')
    await fireEvent.click(resultsContent)

    expect(emitted()['update:modelValue']).toBeUndefined()
  })
})
