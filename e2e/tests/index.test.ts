import type { Show } from '~/types/show'
import { expect, test } from '@playwright/test'

// Mock data simulating the API response - now includes all required fields from Show type
const mockShows: Show[] = [
  {
    id: 1,
    url: 'http://example.com/show/1',
    name: 'Show One',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama'],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2022-01-01',
    ended: null,
    officialSite: 'http://example.com',
    schedule: { time: '21:00', days: ['Monday'] },
    rating: { average: 8.5 },
    weight: 90,
    network: { id: 1, name: 'Network A', country: { name: 'USA', code: 'US', timezone: 'America/New_York' }, officialSite: 'http://networka.com' },
    webChannel: null,
    dvdCountry: null,
    externals: { tvrage: null, thetvdb: 123, imdb: 'tt1234567' },
    image: { medium: 'img1.jpg', original: 'img1_orig.jpg' },
    summary: 'Summary 1',
    updated: 1678886400,
    _links: { self: { href: 'http://api.tvmaze.com/shows/1' } },
  },
  {
    id: 2,
    url: 'http://example.com/show/2',
    name: 'Show Two',
    type: 'Comedy',
    language: 'English',
    genres: ['Comedy'],
    status: 'Ended',
    runtime: 30,
    averageRuntime: 30,
    premiered: '2023-05-10',
    ended: '2023-12-20',
    officialSite: null,
    schedule: { time: '20:00', days: ['Tuesday'] },
    rating: { average: 7.9 },
    weight: 80,
    network: undefined,
    webChannel: { id: 2, name: 'Web Channel B', officialSite: 'http://webb.com' },
    dvdCountry: null,
    externals: { tvrage: 456, thetvdb: null, imdb: 'tt2345678' },
    image: { medium: 'img2.jpg', original: 'img2_orig.jpg' },
    summary: 'Summary 2',
    updated: 1678886401,
    _links: { self: { href: 'http://api.tvmaze.com/shows/2' }, previousepisode: { href: 'http://api.tvmaze.com/episodes/102', name: 'Finale' } },
  },
  {
    id: 3,
    url: 'http://example.com/show/3',
    name: 'Show Three',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Thriller'],
    status: 'Running',
    runtime: 45,
    averageRuntime: 45,
    premiered: '2021-09-15',
    ended: null,
    officialSite: 'http://example3.com',
    schedule: { time: '22:00', days: ['Friday'] },
    rating: { average: 9.1 },
    weight: 95,
    network: { id: 3, name: 'Network C', country: { name: 'UK', code: 'GB', timezone: 'Europe/London' }, officialSite: 'http://networkc.com' },
    webChannel: null,
    dvdCountry: 'US',
    externals: { tvrage: 789, thetvdb: 456, imdb: 'tt3456789' },
    image: { medium: 'img3.jpg', original: 'img3_orig.jpg' },
    summary: 'Summary 3',
    updated: 1678886402,
    _links: { self: { href: 'http://api.tvmaze.com/shows/3' } },
  },
]

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the network request BEFORE navigating
    await page.route('https://api.tvmaze.com/shows', async (route) => {
      // Fulfill the request with mock data
      await route.fulfill({ json: mockShows })
    })

    await page.goto('/')
  })

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Overview Page')
  })

  test('should display the search button', async ({ page }) => {
    await expect(page.getByTestId('search-button')).toBeVisible()
  })

  test('should open the search modal when the search button is clicked', async ({ page }) => {
    // Check the modal is not initially visible
    await expect(page.getByRole('dialog')).not.toBeVisible()

    await page.getByTestId('search-button').click()

    // After clicking, the modal dialog should be visible.
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('should display genres and show cards after fetching data', async ({ page }) => {
    // Verify Drama genre heading is visible
    await expect(page.getByRole('heading', { name: 'Drama' })).toBeVisible()
    // Verify ShowCard within the Drama section is visible
    const dramaSection = page.locator('section[aria-label="Drama shows"]')
    await expect(dramaSection.locator('.show-card').first()).toBeVisible() // Check at least one card
    await expect(dramaSection.locator('.show-card')).toHaveCount(2) // Expect 2 drama shows from mock data

    // Verify Comedy genre heading is visible
    await expect(page.getByRole('heading', { name: 'Comedy' })).toBeVisible()
    // Verify ShowCard within the Comedy section is visible
    const comedySection = page.locator('section[aria-label="Comedy shows"]')
    await expect(comedySection.locator('.show-card').first()).toBeVisible()
    await expect(comedySection.locator('.show-card')).toHaveCount(1) // Expect 1 comedy show

    // Verify Thriller genre heading is visible
    await expect(page.getByRole('heading', { name: 'Thriller' })).toBeVisible()
    // Verify ShowCard within the Thriller section is visible
    const thrillerSection = page.locator('section[aria-label="Thriller shows"]')
    await expect(thrillerSection.locator('.show-card').first()).toBeVisible()
    await expect(thrillerSection.locator('.show-card')).toHaveCount(1) // Expect 1 thriller show
  })
})
