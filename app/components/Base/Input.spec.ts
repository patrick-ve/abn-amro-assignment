import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from './Input.vue'

describe('input', () => {
  it('renders with slot content', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
      },
      slots: {
        default: 'Test Content',
      },
    })
    expect(wrapper.text()).toContain('Test Content')
  })

  it('renders with default props', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
      },
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')
  })

  it('renders with custom type', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        type: 'search',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('search')
  })

  it('renders with placeholder', () => {
    const placeholder = 'Enter text here'
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        placeholder,
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe(placeholder)
  })

  it('emits update:modelValue event on input', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
      },
    })
    const input = wrapper.find('input')
    await input.setValue('test')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test'])
  })

  it('is accessible', () => {
    const label = 'Search'
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        label,
      },
    })
    const labelElement = wrapper.find('label')
    expect(labelElement.exists()).toBe(true)
    expect(labelElement.text()).toBe(label)
  })

  it('shows error message when provided', () => {
    const errorMessage = 'This field is required'
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        error: errorMessage,
      },
    })
    expect(wrapper.text()).toContain(errorMessage)
  })

  it('applies error styles when error is present', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        error: 'Error message',
      },
    })
    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-red-500')
  })

  it('can be disabled', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        disabled: true,
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
  })
})
