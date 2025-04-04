import type { Show } from '~/types/show'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShowDetail from './ShowDetail.vue'

const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime', 'Thriller'],
  rating: { average: 9.5 },
  image: {
    medium: 'https://example.com/breaking-bad.jpg',
    original: 'https://example.com/breaking-bad-original.jpg',
  },
  summary: '<p>A high school chemistry teacher turned methamphetamine manufacturer.</p>',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  status: 'Ended',
  network: {
    name: 'AMC',
  },
  schedule: {
    time: '22:00',
    days: ['Sunday'],
  },
}

describe('showDetail', () => {
  it('renders show title', () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('Breaking Bad')
  })

  it('displays show image when available', () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShow.image?.original)
    expect(img.attributes('alt')).toBe(`${mockShow.name} poster`)
  })

  it('shows placeholder when image is missing', () => {
    const showWithoutImage = {
      ...mockShow,
      image: null,
    }
    const wrapper = mount(ShowDetail, {
      props: {
        show: showWithoutImage,
      },
    })
    const placeholder = wrapper.find('.placeholder-image')
    expect(placeholder.exists()).toBe(true)
  })

  it('displays all genres', () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    mockShow.genres.forEach((genre) => {
      expect(wrapper.text()).toContain(genre)
    })
  })

  it('renders show summary without HTML tags', () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('A high school chemistry teacher turned methamphetamine manufacturer.')
    expect(wrapper.text()).not.toContain('<p>')
  })

  it('displays network name when available', () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('AMC')
  })

  it('handles missing network gracefully', () => {
    const showWithoutNetwork = {
      ...mockShow,
      network: undefined,
    }
    const wrapper = mount(ShowDetail, {
      props: {
        show: showWithoutNetwork,
      },
    })
    expect(wrapper.text()).toContain('Network: Not available')
  })

  it('displays schedule information', () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('22:00')
    expect(wrapper.text()).toContain('Sunday')
  })

  it('shows status and air dates', () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    expect(wrapper.text()).toContain('Ended')
    expect(wrapper.text()).toContain('2008-01-20')
    expect(wrapper.text()).toContain('2013-09-29')
  })

  it('is accessible', () => {
    render(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Breaking Bad' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Breaking Bad poster' })).toBeInTheDocument()
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(ShowDetail, {
      props: {
        show: mockShow,
      },
    })
    await wrapper.find('[data-testid="close-button"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
