import type { Show } from '../../types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Hero from '../Hero.vue'

const mockShow: Show = {
  id: 1,
  url: 'https://example.com/breaking-bad',
  name: 'Breaking Bad',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Crime', 'Thriller'],
  status: 'Ended',
  runtime: 60,
  averageRuntime: 60,
  rating: { average: 9.5 },
  weight: 100,
  image: {
    medium: 'https://example.com/breaking-bad.jpg',
    original: 'https://example.com/breaking-bad-original.jpg',
  },
  summary: '<p>A high school chemistry teacher turned methamphetamine manufacturer.</p>',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  officialSite: 'https://www.amc.com/shows/breaking-bad',
  network: {
    id: 20,
    name: 'AMC',
    country: {
      name: 'United States',
      code: 'US',
      timezone: 'America/New_York',
    },
    officialSite: 'https://www.amc.com',
  },
  webChannel: null,
  dvdCountry: null,
  externals: {
    tvrage: 18164,
    thetvdb: 81189,
    imdb: 'tt0903747',
  },
  schedule: {
    time: '22:00',
    days: ['Sunday'],
  },
  updated: 1631825853,
  _links: {
    self: {
      href: 'https://api.tvmaze.com/shows/169',
    },
    previousepisode: {
      href: 'https://api.tvmaze.com/episodes/2017',
      name: 'Felina',
    },
  },
}

describe('hero', () => {
  it('renders show title', () => {
    const wrapper = mount(Hero, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('Breaking Bad')
  })

  it('displays show image when available', () => {
    const wrapper = mount(Hero, {
      props: {
        show: mockShow,
      },
    })
    const img = wrapper.find('img[alt$="poster"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShow.image?.original)
  })

  it('shows placeholder when image is missing', () => {
    const showWithoutImage = {
      ...mockShow,
      image: null,
    }
    const wrapper = mount(Hero, {
      props: {
        show: showWithoutImage,
      },
    })
    const placeholder = wrapper.find('.placeholder-image')
    expect(placeholder.exists()).toBe(true)
  })

  it('displays show summary without HTML tags', () => {
    const wrapper = mount(Hero, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('A high school chemistry teacher turned methamphetamine manufacturer.')
    expect(wrapper.text()).not.toContain('<p>')
  })

  it('displays rating when available', () => {
    const wrapper = mount(Hero, {
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
    const wrapper = mount(Hero, {
      props: {
        show: showWithoutRating,
      },
    })
    expect(wrapper.text()).toContain('N/A')
  })

  it('renders correct link for "More Info"', () => {
    const wrapper = mount(Hero, {
      props: {
        show: mockShow,
      },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(`/shows/${mockShow.id}`)
    expect(link.text()).toContain('More Info')
  })

  it('is accessible', () => {
    render(Hero, {
      props: {
        show: mockShow,
      },
    })
    expect(screen.getByRole('region', { name: 'Featured Show' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /poster/i })).toHaveAttribute('alt', `${mockShow.name} poster`)
    expect(screen.getByRole('link', { name: /More Info/i })).toBeInTheDocument()
  })
})
