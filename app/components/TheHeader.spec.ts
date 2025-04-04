import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheHeader from './TheHeader.vue'

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

  it('has correct styling classes', () => {
    const wrapper = mount(TheHeader)
    const header = wrapper.find('header')

    expect(header.classes()).toContain('flex')
    expect(header.classes()).toContain('justify-center')
    expect(header.classes()).toContain('items-center')
    expect(header.classes()).toContain('h-20')
    expect(header.classes()).toContain('bg-black')
  })

  it('is accessible', () => {
    render(TheHeader)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()

    const logo = screen.getByAltText('ABNFlix Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the logo', () => {
    const wrapper = mount(TheHeader)
    const logo = wrapper.find('img[alt="ABNFlix Logo"]')
    expect(logo.exists()).toBe(true)
  })

  it('renders the search button', () => {
    const wrapper = mount(TheHeader)
    const searchButton = wrapper.find('[data-testid="search-button"]')
    expect(searchButton.exists()).toBe(true)
  })

  it('emits toggleSearch event when search button is clicked', async () => {
    const wrapper = mount(TheHeader)
    const searchButton = wrapper.find('[data-testid="search-button"]')

    await searchButton.trigger('click')

    expect(wrapper.emitted('toggleSearch')).toBeTruthy()
    expect(wrapper.emitted('toggleSearch')).toHaveLength(1)
  })

  it('shows search input when isSearchActive is true', async () => {
    const wrapper = mount(TheHeader, {
      props: {
        isSearchActive: true,
      },
    })

    const searchInput = wrapper.find('[data-testid="search-input"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toBe('Search shows...')
  })

  it('emits search event when input value changes', async () => {
    const wrapper = mount(TheHeader, {
      props: {
        isSearchActive: true,
      },
    })

    const searchInput = wrapper.find('[data-testid="search-input"]')
    await searchInput.setValue('breaking bad')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')?.[0]).toEqual(['breaking bad'])
  })
})
