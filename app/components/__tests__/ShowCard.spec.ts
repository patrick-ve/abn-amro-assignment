import type { Show } from '../../types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShowCard from '../Show/Card.vue'

const mockShow: Show = {
  id: 1,
  url: 'https://example.com/show/1',
  name: 'Breaking Bad',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Crime', 'Thriller'],
  status: 'Ended',
  runtime: 60,
  averageRuntime: 60,
  premiered: '2008-01-20',
  ended: '2013-09-29',
  officialSite: 'https://example.com',
  schedule: {
    time: '22:00',
    days: ['Sunday'],
  },
  rating: {
    average: 9.5,
  },
  weight: 99,
  network: {
    id: 1,
    name: 'AMC',
    country: {
      name: 'United States',
      code: 'US',
      timezone: 'America/New_York',
    },
    officialSite: 'https://www.amc.com',
  },
  webChannel: null,
  externals: {
    tvrage: null,
    thetvdb: 81189,
    imdb: 'tt0903747',
  },
  image: {
    medium: 'https://example.com/image-medium.jpg',
    original: 'https://example.com/image-original.jpg',
  },
  summary: '<p>A high school chemistry teacher turned methamphetamine manufacturer.</p>',
  updated: 1608492879,
  _links: {
    self: {
      href: 'https://api.example.com/shows/1',
    },
    previousepisode: {
      href: 'https://api.example.com/episodes/1',
    },
  },
}

describe('showCard', () => {
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

  it('renders a link to the show details page', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(`/shows/${mockShow.id}`)
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
