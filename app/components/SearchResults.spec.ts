import type { Show } from '~/types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SearchResults from './SearchResults.vue'

const mockShows: Show[] = [
  {
    id: 1,
    url: 'https://example.com/show/1',
    name: 'Breaking Bad',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Crime'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2008-01-20',
    ended: '2013-09-29',
    officialSite: 'https://example.com',
    schedule: { time: '22:00', days: ['Sunday'] },
    rating: { average: 9.5 },
    weight: 99,
    network: { id: 1, name: 'AMC', country: { name: 'US', code: 'US', timezone: 'America/New_York' }, officialSite: 'https://amc.com' },
    webChannel: null,
    dvdCountry: null,
    externals: { tvrage: null, thetvdb: 81189, imdb: 'tt0903747' },
    image: {
      medium: 'https://example.com/breaking-bad.jpg',
      original: 'https://example.com/breaking-bad-original.jpg',
    },
    summary: '<p>A high school chemistry teacher turned methamphetamine manufacturer.</p>',
    updated: 1608492879,
    _links: { self: { href: 'https://api.example.com/shows/1' }, previousepisode: { href: 'https://api.example.com/episodes/1', name: 'Pilot' } },
  },
  {
    id: 2,
    url: 'https://example.com/show/2',
    name: 'Better Call Saul',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Crime'],
    status: 'Ended',
    runtime: 50,
    averageRuntime: 51,
    premiered: '2015-02-08',
    ended: '2022-08-15',
    officialSite: 'https://example-bcs.com',
    schedule: { time: '21:00', days: ['Monday'] },
    rating: { average: 9.3 },
    weight: 98,
    network: { id: 1, name: 'AMC', country: { name: 'US', code: 'US', timezone: 'America/New_York' }, officialSite: 'https://amc.com' },
    webChannel: null,
    dvdCountry: null,
    externals: { tvrage: null, thetvdb: 273181, imdb: 'tt3032476' },
    image: {
      medium: 'https://example.com/better-call-saul.jpg',
      original: 'https://example.com/better-call-saul-original.jpg',
    },
    summary: '<p>The trials and tribulations of criminal lawyer Jimmy McGill.</p>',
    updated: 1660608886,
    _links: { self: { href: 'https://api.example.com/shows/2' }, previousepisode: { href: 'https://api.example.com/episodes/2', name: 'Uno' } },
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
    expect(wrapper.emitted('showSelected')![0]).toEqual([mockShows[0].id])
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
    expect(showCards[0].props('show').rating?.average).toBe(9.5)
    expect(showCards[1].props('show').rating?.average).toBe(9.3)
  })
})
