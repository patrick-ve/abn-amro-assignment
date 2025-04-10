import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheHeader from '../TheHeader.vue'

describe('theHeader', () => {
  it('renders the header component', () => {
    const wrapper = mount(TheHeader)
    expect(wrapper.exists()).toBe(true)
  })

  it('contains the ABNFlix logo image', () => {
    const wrapper = mount(TheHeader)
    const logo = wrapper.find('img')

    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toBe('/abnflix_logo.png')
    expect(logo.attributes('alt')).toBe('ABNFlix Logo')
  })

  it('renders the logo', () => {
    const wrapper = mount(TheHeader)
    const logo = wrapper.find('img[alt="ABNFlix Logo"]')
    expect(logo.exists()).toBe(true)
  })

  it('renders the search button provided via slot', () => {
    const wrapper = mount(TheHeader, {
      slots: {
        right: '<button data-testid="search-button">Search</button>',
      },
    })
    const searchButton = wrapper.find('[data-testid="search-button"]')
    expect(searchButton.exists()).toBe(true)
  })

  it('allows click on search button provided via slot', async () => {
    const wrapper = mount(TheHeader, {
      slots: {
        right: '<button data-testid="search-button">Search</button>',
      },
    })
    const searchButton = wrapper.find('[data-testid="search-button"]')
    expect(searchButton.exists()).toBe(true)
    await expect(searchButton.trigger('click')).resolves.toBeUndefined()
  })

  it('shows search input provided via slot', async () => {
    const wrapper = mount(TheHeader, {
      slots: {
        right: '<input data-testid="search-input" placeholder="Search shows..." />',
      },
    })
    const searchInput = wrapper.find('[data-testid="search-input"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toBe('Search shows...')
  })

  it('allows interaction with search input provided via slot', async () => {
    const wrapper = mount(TheHeader, {
      slots: {
        right: '<input data-testid="search-input" />',
      },
    })
    const searchInput = wrapper.find<HTMLInputElement>('[data-testid="search-input"]')
    expect(searchInput.exists()).toBe(true)
    await searchInput.setValue('breaking bad')
    expect(searchInput.element.value).toBe('breaking bad')
  })
})
