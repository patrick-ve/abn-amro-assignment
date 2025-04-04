import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import Input from './Input.vue'

describe('container', () => {
  it('renders with slot content', async () => {
    const SLOT_CONTENT = 'Test Content'

    await renderSuspended(Input, {
      slots: {
        default: () => h('div', {}, SLOT_CONTENT),
      },
    })

    const slotText = screen.getByText(SLOT_CONTENT)
    expect(slotText).toBeInTheDocument()
  })
})
