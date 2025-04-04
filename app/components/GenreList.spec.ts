import type { Show } from '~/types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GenreList from './GenreList.vue'

// Create a longer list of shows to test scrolling
const mockShows: Show[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  url: `https://example.com/show-${i + 1}`,
  name: `Show ${i + 1}`,
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Crime'],
  status: 'Ended',
  runtime: 60,
  averageRuntime: 60,
  rating: { average: 9.5 - i * 0.1 },
  weight: 100,
  image: {
    medium: `https://example.com/show-${i + 1}.jpg`,
    original: `https://example.com/show-${i + 1}-original.jpg`,
  },
  summary: `<p>Summary for Show ${i + 1}</p>`,
  premiered: '2008-01-20',
  ended: '2013-09-29',
  officialSite: `https://example.com/show-${i + 1}-site`,
  network: {
    id: 1,
    name: 'ABC',
    country: {
      name: 'United States',
      code: 'US',
      timezone: 'America/New_York',
    },
    officialSite: 'https://abc.com',
  },
  webChannel: null,
  dvdCountry: null,
  externals: {
    tvrage: null,
    thetvdb: null,
    imdb: null,
  },
  schedule: { time: '22:00', days: ['Sunday'] },
  updated: 1631825853,
  _links: {
    self: {
      href: `https://api.tvmaze.com/shows/${i + 1}`,
    },
  },
}))

describe('genreList', () => {
  beforeEach(() => {
    // Mock ResizeObserver
    const mockResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
    vi.stubGlobal('ResizeObserver', mockResizeObserver)

    // Mock Element.prototype.scrollTo
    Element.prototype.scrollTo = vi.fn()
  })

  it('renders genre title', () => {
    const wrapper = mount(GenreList, {
      props: {
        genre: 'Drama',
        shows: mockShows,
      },
    })
    expect(wrapper.text()).toContain('Drama')
  })

  it('renders all shows in the list', () => {
    const wrapper = mount(GenreList, {
      props: {
        genre: 'Drama',
        shows: mockShows,
      },
    })
    const showCards = wrapper.findAllComponents({ name: 'ShowCard' })
    expect(showCards).toHaveLength(mockShows.length)
  })

  it('sorts shows by rating in descending order', () => {
    const wrapper = mount(GenreList, {
      props: {
        genre: 'Drama',
        shows: [...mockShows],
      },
    })
    const showCards = wrapper.findAllComponents({ name: 'ShowCard' })
    expect(showCards.length).toBeGreaterThan(1)

    const firstShow = showCards[0]?.props('show') as Show | undefined
    const secondShow = showCards[1]?.props('show') as Show | undefined

    expect(firstShow).toBeDefined()
    expect(secondShow).toBeDefined()

    if (firstShow?.rating.average && secondShow?.rating.average) {
      expect(firstShow.rating.average).toBeGreaterThan(secondShow.rating.average)
    }
  })

  it('emits showSelected event when a show is clicked', async () => {
    const wrapper = mount(GenreList, {
      props: {
        genre: 'Drama',
        shows: mockShows,
      },
    })
    const firstShowCard = wrapper.findComponent({ name: 'ShowCard' })
    await firstShowCard.trigger('click')
    const emitted = wrapper.emitted()
    expect(emitted.showSelected).toBeTruthy()
    expect(emitted.showSelected?.[0]).toEqual([mockShows[0]?.id])
  })

  it('handles empty show list gracefully', () => {
    const wrapper = mount(GenreList, {
      props: {
        genre: 'Drama',
        shows: [],
      },
    })
    expect(wrapper.text()).toContain('No shows available')
  })

  it('is accessible', () => {
    render(GenreList, {
      props: {
        genre: 'Drama',
        shows: mockShows,
      },
    })
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Drama shows')
    expect(screen.getByRole('heading', { name: 'Drama' })).toBeInTheDocument()
  })

  describe('scroll functionality', () => {
    beforeEach(() => {
      // Mock getBoundingClientRect for scroll container
      Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        width: 500,
        height: 200,
        top: 0,
        left: 0,
        right: 500,
        bottom: 200,
        x: 0,
        y: 0,
      })

      // Mock scroll properties
      Object.defineProperties(Element.prototype, {
        scrollWidth: {
          configurable: true,
          get: vi.fn().mockReturnValue(1000),
        },
        clientWidth: {
          configurable: true,
          get: vi.fn().mockReturnValue(500),
        },
        scrollLeft: {
          configurable: true,
          get: vi.fn().mockReturnValue(0),
          set: vi.fn(),
        },
      })
    })

    it('provides horizontal scrolling container', () => {
      const wrapper = mount(GenreList, {
        props: {
          genre: 'Drama',
          shows: mockShows,
        },
      })
      const scrollContainer = wrapper.find('.shows-container')
      expect(scrollContainer.exists()).toBe(true)
      expect(scrollContainer.classes()).toContain('overflow-x-auto')
      expect(scrollContainer.classes()).toContain('scroll-smooth')
    })

    it('shows right scroll button initially when content overflows', async () => {
      const wrapper = mount(GenreList, {
        props: {
          genre: 'Drama',
          shows: mockShows,
        },
      })

      await wrapper.vm.$nextTick()

      const rightButton = wrapper.find('button[aria-label="Scroll right"]')
      expect(rightButton.exists()).toBe(true)
    })

    it('shows left scroll button after scrolling right', async () => {
      // Update scrollLeft mock for this test
      Object.defineProperty(Element.prototype, 'scrollLeft', {
        configurable: true,
        get: vi.fn().mockReturnValue(100),
        set: vi.fn(),
      })

      const wrapper = mount(GenreList, {
        props: {
          genre: 'Drama',
          shows: mockShows,
        },
      })

      const container = wrapper.find('.shows-container')
      await container.trigger('scroll')

      const leftButton = wrapper.find('button[aria-label="Scroll left"]')
      expect(leftButton.exists()).toBe(true)
    })

    it('scrolls content when buttons are clicked', async () => {
      const scrollToMock = vi.fn()
      Element.prototype.scrollTo = scrollToMock

      const wrapper = mount(GenreList, {
        props: {
          genre: 'Drama',
          shows: mockShows,
        },
      })

      await wrapper.vm.$nextTick()

      const rightButton = wrapper.find('button[aria-label="Scroll right"]')
      await rightButton.trigger('click')

      expect(scrollToMock).toHaveBeenCalledWith({
        left: expect.any(Number),
        behavior: 'smooth',
      })
    })

    it('hides scroll buttons when content fits container', async () => {
      // Mock getBoundingClientRect to simulate a container that fits the content
      Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        width: 1000, // Make container wider than content
        height: 200,
        top: 0,
        left: 0,
        right: 1000,
        bottom: 200,
        x: 0,
        y: 0,
      })

      // Update scroll dimensions to simulate no overflow
      Object.defineProperties(Element.prototype, {
        scrollWidth: {
          configurable: true,
          get: vi.fn().mockReturnValue(800), // Content width less than container
        },
        clientWidth: {
          configurable: true,
          get: vi.fn().mockReturnValue(1000), // Container width more than content
        },
        scrollLeft: {
          configurable: true,
          get: vi.fn().mockReturnValue(0),
          set: vi.fn(),
        },
      })

      const wrapper = mount(GenreList, {
        props: {
          genre: 'Drama',
          shows: mockShows.slice(0, 2), // Use fewer shows to ensure no overflow
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0)) // Wait for all updates

      // Trigger a scroll event to ensure buttons are updated
      const container = wrapper.find('.shows-container')
      await container.trigger('scroll')

      const leftButton = wrapper.find('button[aria-label="Scroll left"]')
      const rightButton = wrapper.find('button[aria-label="Scroll right"]')

      expect(leftButton.exists()).toBe(false)
      expect(rightButton.exists()).toBe(false)
    })
  })
})
