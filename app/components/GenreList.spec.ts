import type { Show } from '~/types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GenreList from './GenreList.vue'

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

describe('genreList', () => {
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
        shows: [...mockShows].reverse(),
      },
    })
    const showCards = wrapper.findAllComponents({ name: 'ShowCard' })
    expect(showCards).toHaveLength(2)

    if (!showCards[0] || !showCards[1]) {
      throw new Error('Expected at least 2 show cards')
    }

    const firstShow = showCards[0].props('show') as Show
    const secondShow = showCards[1].props('show') as Show
    expect(firstShow.rating.average).toBe(9.5)
    expect(secondShow.rating.average).toBe(9.3)
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

  it('provides horizontal scrolling functionality', () => {
    const wrapper = mount(GenreList, {
      props: {
        genre: 'Drama',
        shows: mockShows,
      },
    })
    const scrollContainer = wrapper.find('.shows-container')
    expect(scrollContainer.exists()).toBe(true)
    expect(scrollContainer.classes()).toContain('overflow-x-auto')
  })
})
