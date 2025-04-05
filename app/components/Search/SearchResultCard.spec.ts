import type { Show } from '~/types/show'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SearchResultCard from './SearchResultCard.vue'

// Mock the NuxtImage component if needed, or configure Vitest to stub it globally
// For simplicity, we'll assume basic rendering or use a simple img tag here.
// If <NuxtImage> causes issues, configure stubbing in your vitest.config.ts:
// vue: { template: { compilerOptions: { isCustomElement: (tag) => tag === 'NuxtImage' } } }

const mockShowWithImageAndSummary: Show = {
  id: 1,
  url: 'http://example.com/show/1',
  name: 'Test Show Title',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Science-Fiction'],
  status: 'Ended',
  runtime: 60,
  averageRuntime: 60,
  premiered: '2023-01-01',
  ended: '2023-12-31',
  officialSite: 'http://example.com',
  schedule: { time: '21:00', days: ['Monday'] },
  rating: { average: 8.5 },
  weight: 90,
  network: {
    id: 1,
    name: 'Test Network',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'http://network.example.com',
  },
  webChannel: null,
  dvdCountry: null,
  externals: { tvrage: 123, thetvdb: 456, imdb: 'tt1234567' },
  image: { medium: 'http://example.com/medium.jpg', original: 'http://example.com/original.jpg' },
  summary: '<p>This is a <b>test summary</b>.</p>',
  updated: 1678886400,
  _links: { self: { href: 'http://api.example.com/shows/1' } },
}

const mockShowMinimal: Show = {
  id: 2,
  url: 'http://example.com/show/2',
  name: 'Minimal Show',
  type: 'Reality',
  language: 'English',
  genres: [],
  status: 'Running',
  runtime: 0,
  averageRuntime: 30,
  premiered: null,
  ended: null,
  officialSite: null,
  schedule: { time: '', days: [] },
  rating: { average: null },
  weight: 50,
  network: undefined,
  webChannel: null,
  dvdCountry: null,
  externals: { tvrage: null, thetvdb: null, imdb: null },
  image: null,
  summary: null,
  updated: 1678886401,
  _links: { self: { href: 'http://api.example.com/shows/2' } },
}

describe('searchResultCard', () => {
  it('renders show details correctly when all data is present', () => {
    const wrapper = mount(SearchResultCard, {
      props: {
        show: mockShowWithImageAndSummary,
      },
      global: {
        // If you use Nuxt specific components like NuxtLink, stub them here
        // stubs: { NuxtLink: true }
      },
    })

    // Check image
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShowWithImageAndSummary.image?.medium)
    expect(img.attributes('alt')).toBe(`${mockShowWithImageAndSummary.name} poster`)
    expect(wrapper.find('.placeholder-image').exists()).toBe(false)

    // Check title
    expect(wrapper.find('h3').text()).toBe(mockShowWithImageAndSummary.name)

    // Check rating
    expect(wrapper.find('.flex.items-center.text-xs').text()).toContain(mockShowWithImageAndSummary.rating.average?.toFixed(1))

    // Check summary (using v-html)
    const summaryDiv = wrapper.find('.text-xs.text-gray-700.dark\\:text-gray-300.line-clamp-3')
    expect(summaryDiv.exists()).toBe(true)
    if (summaryDiv.exists()) {
      expect(summaryDiv.element.innerHTML).toBe(mockShowWithImageAndSummary.summary)
    }
  })

  it('renders placeholder image when show image is missing', () => {
    const wrapper = mount(SearchResultCard, {
      props: {
        show: mockShowMinimal,
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    const placeholder = wrapper.find('.placeholder-image')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toContain('No Image')
  })

  it('renders N/A rating when show rating is missing', () => {
    const wrapper = mount(SearchResultCard, {
      props: {
        show: mockShowMinimal,
      },
    })
    expect(wrapper.find('.flex.items-center.text-xs').text()).toContain('N/A')
  })

  it('renders "No summary available" when show summary is missing', () => {
    const wrapper = mount(SearchResultCard, {
      props: {
        show: mockShowMinimal,
      },
    })

    expect(wrapper.find('.text-xs.text-gray-700.dark\\:text-gray-300.line-clamp-3').exists()).toBe(false)
    expect(wrapper.find('.text-xs.text-gray-500.italic').text()).toBe('No summary available.')
  })
})
