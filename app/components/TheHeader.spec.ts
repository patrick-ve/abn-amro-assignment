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
})
