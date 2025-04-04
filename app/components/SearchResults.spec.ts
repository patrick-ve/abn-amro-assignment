import type { Show } from '~/types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SearchResults from './SearchResults.vue'

const mockShows: Show[] = [
  {
    id: 1,
    name: 'Breaking Bad',
    genres: ['Drama', 'Crime'],
    rating: { average: 9.5 },
    image: {
      medium: 'https://example.com/breaking-bad.jpg',
      original: 'https://example.com/breaking-bad-original.jpg',
    },
    summary: '<p>A high school chemistry teacher turned methamphetamine manufacturer.</p>',
    premiered: '2008-01-20',
    ended: '2013-09-29',
    status: 'Ended',
    schedule: { time: '22:00', days: ['Sunday'] },
  },
  {
    id: 2,
    name: 'Better Call Saul',
    genres: ['Drama', 'Crime'],
    rating: { average: 9.3 },
    image: {
      medium: 'https://example.com/better-call-saul.jpg',
      original: 'https://example.com/better-call-saul-original.jpg',
    },
    summary: '<p>The trials and tribulations of criminal lawyer Jimmy McGill.</p>',
    premiered: '2015-02-08',
    ended: '2022-08-15',
    status: 'Ended',
    schedule: { time: '21:00', days: ['Monday'] },
  },
]

describe('searchResults', () => {
  it('renders loading state', () => {
    const wrapper = mount(SearchResults, {
      props: {
        isLoading: true,
        shows: [],
        error: null,
      },
    })
    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
  })

  it('renders error message when there is an error', () => {
    const errorMessage = 'Failed to fetch results'
    const wrapper = mount(SearchResults, {
      props: {
        isLoading: false,
        shows: [],
        error: errorMessage,
      },
    })
    expect(wrapper.text()).toContain(errorMessage)
  })

  it('renders shows when data is available', () => {
    const wrapper = mount(SearchResults, {
      props: {
        isLoading: false,
        shows: mockShows,
        error: null,
      },
    })
    const showCards = wrapper.findAllComponents({ name: 'ShowCard' })
    expect(showCards).toHaveLength(mockShows.length)
    expect(wrapper.text()).toContain('Breaking Bad')
    expect(wrapper.text()).toContain('Better Call Saul')
  })

  it('displays no results message when shows array is empty', () => {
    const wrapper = mount(SearchResults, {
      props: {
        isLoading: false,
        shows: [],
        error: null,
      },
    })
    expect(wrapper.text()).toContain('No shows found')
  })

  it('emits showSelected event when a show is clicked', async () => {
    const wrapper = mount(SearchResults, {
      props: {
        isLoading: false,
        shows: mockShows,
        error: null,
      },
    })
    const firstShowCard = wrapper.findComponent({ name: 'ShowCard' })
    await firstShowCard.trigger('click')
    expect(wrapper.emitted('showSelected')).toBeTruthy()
    expect(wrapper.emitted('showSelected')?.[0]).toEqual([mockShows[0].id])
  })

  it('is accessible', () => {
    render(SearchResults, {
      props: {
        isLoading: false,
        shows: mockShows,
        error: null,
      },
    })
    expect(screen.getByRole('region', { name: 'Search Results' })).toBeInTheDocument()
  })

  it('sorts shows by rating in descending order', () => {
    const wrapper = mount(SearchResults, {
      props: {
        isLoading: false,
        shows: [...mockShows].reverse(),
        error: null,
      },
    })
    const showCards = wrapper.findAllComponents({ name: 'ShowCard' })
    expect(showCards[0].props('show').rating.average).toBe(9.5)
    expect(showCards[1].props('show').rating.average).toBe(9.3)
  })
})
