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
    network: null,
    webChannel: { id: 2, name: 'Web Channel B', country: { name: 'Anywhere', code: 'AW', timezone: 'Etc/UTC' }, officialSite: 'http://webb.com' },
    externals: { tvrage: 456, thetvdb: null, imdb: 'tt2345678' },
    image: { medium: 'img2.jpg', original: 'img2_orig.jpg' },
    summary: 'Summary 2',
    updated: 1678886401,
    _links: { self: { href: 'http://api.tvmaze.com/shows/2' }, previousepisode: { href: 'http://api.tvmaze.com/episodes/102' } },
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
    externals: { tvrage: 789, thetvdb: 456, imdb: 'tt3456789' },
    image: { medium: 'img3.jpg', original: 'img3_orig.jpg' },
    summary: 'Summary 3',
    updated: 1678886402,
    _links: { self: { href: 'http://api.tvmaze.com/shows/3' } },
  },
]

test.describe('Index Page', () => {
  // Mock the API before each test
  test.beforeEach(async ({ page }) => {
    // Mock the GET https://api.tvmaze.com/shows endpoint (for useFetchAllShows)
    // Use a glob pattern to catch potential page query parameters, though the composable defaults to page 0
    await page.route('https://api.tvmaze.com/shows?page=*', (route, _request) => {
      // We can check request.url() if we need different mocks per page, but for now, return the same mock list
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockShows),
      })
    })

    // Mock the GET https://api.tvmaze.com/search/shows endpoint (for useSearchShows)
    await page.route('https://api.tvmaze.com/search/shows?q=**', (route, request) => {
      const url = new URL(request.url())
      const query = url.searchParams.get('q')?.toLowerCase() || ''
      const results = mockShows.filter(show => show.name.toLowerCase().includes(query))
      const searchResults = results.map(show => ({ score: Math.random(), show }))

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(searchResults),
      })
    })

    await page.goto('/')
  })

  test('should display the hero section with a random show', async ({ page }) => {
    // Check if the hero section exists
    const heroSection = page.locator('[data-testid="hero-section"]') // Assuming Hero component has data-testid="hero-section"
    await expect(heroSection).toBeVisible()

    // Check if the hero section contains a show title (we can't know which one, but it should be one of them)
    const heroTitle = heroSection.locator('h2') // Changed from h1 to h2
    const possibleTitles = mockShows.map(show => show.name)
    await expect(heroTitle).toHaveText(new RegExp(possibleTitles.join('|')))
  })

  test('should display shows grouped by genre', async ({ page }) => {
    // Check for a specific genre section (e.g., Drama)
    const dramaSection = page.locator('[data-testid="genre-list-Drama"]') // Assuming GenreList has data-testid="genre-list-<genre>"
    await expect(dramaSection).toBeVisible()
    await expect(dramaSection.locator('h2')).toHaveText('Drama')

    // Check if Show One card is in the Drama section
    const showOneCard = dramaSection.locator('[data-testid="show-card-1"]') // Assuming ShowCard has data-testid="show-card-<id>"
    await expect(showOneCard).toBeVisible()

    // Check for Comedy section and Show Two card
    const comedySection = page.locator('[data-testid="genre-list-Comedy"]')
    await expect(comedySection).toBeVisible()
    await expect(comedySection.locator('h2')).toHaveText('Comedy')
    const showTwoCard = comedySection.locator('[data-testid="show-card-2"]')
    await expect(showTwoCard).toBeVisible()
  })

  test('should open search modal, perform search, and navigate on result click', async ({ page }) => {
    // Wait for initial network activity to settle before interacting
    await page.waitForLoadState('networkidle')

    // 1. Open search modal
    const searchButton = page.locator('[data-testid="search-button"]')
    // await searchButton.click({ force: true }) // Reverting force: true
    await searchButton.click() // Using standard click

    // Explicitly wait for the modal to be visible
    await page.waitForSelector('[data-testid="base-modal"]', { state: 'visible' })

    const searchModal = page.locator('[data-testid="base-modal"]')
    await expect(searchModal).toBeVisible()

    // 2. Type search query
    const searchInput = searchModal.locator('[data-testid="search-input"]')
    await searchInput.fill('Show One')

    // Wait for debounce (500ms) + some buffer
    await page.waitForTimeout(600)

    // 3. Verify search results appear
    const searchResultsContainer = searchModal.locator('[data-testid="search-results"]')
    await expect(searchResultsContainer).toBeVisible()
    const showOneResult = searchResultsContainer.locator('article:has-text("Show One")')
    await expect(showOneResult).toBeVisible()

    // 4. Click on the search result
    await showOneResult.click()

    // 5. Verify navigation to the show details page
    await page.waitForURL('/shows/1')
    await expect(page).toHaveURL('/shows/1')
    await expect(searchModal).not.toBeVisible() // Modal should close after navigation
  })
})
