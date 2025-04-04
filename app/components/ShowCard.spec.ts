import type { Show } from '~/types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShowCard from './ShowCard.vue'

const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime', 'Thriller'],
  rating: {
    average: 9.5,
  },
  image: {
    medium: 'https://example.com/image-medium.jpg',
    original: 'https://example.com/image-original.jpg',
  },
  summary: '<p>A high school chemistry teacher turned methamphetamine manufacturer.</p>',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  status: 'Ended',
  schedule: {
    time: '22:00',
    days: ['Sunday'],
  },
}

describe('showCard', () => {
  it('renders show title', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('Breaking Bad')
  })

  it('displays show rating when available', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('9.5')
  })

  it('handles missing rating gracefully', () => {
    const showWithoutRating = {
      ...mockShow,
      rating: { average: null },
    }
    const wrapper = mount(ShowCard, {
      props: {
        show: showWithoutRating,
      },
    })
    expect(wrapper.text()).toContain('N/A')
  })

  it('displays show image when available', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShow.image?.medium)
    expect(img.attributes('alt')).toBe(`${mockShow.name} poster`)
  })

  it('shows placeholder when image is missing', () => {
    const showWithoutImage = {
      ...mockShow,
      image: null,
    }
    const wrapper = mount(ShowCard, {
      props: {
        show: showWithoutImage,
      },
    })
    const placeholder = wrapper.find('.placeholder-image')
    expect(placeholder.exists()).toBe(true)
  })

  it('displays first genre as a tag', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('Drama')
  })

  it('emits click event when card is clicked', async () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toEqual([mockShow.id])
  })

  it('is accessible', () => {
    render(ShowCard, {
      props: {
        show: mockShow,
      },
    })
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', `${mockShow.name} poster`)
  })
})
