import type { Show } from '~/types/show'
import { expect, test } from '@playwright/test'
import { expectNoA11yViolations } from '../plugins/a11y'

// Mock data for a single show, taken from the index test mock data
const mockShowDetail: Show = {
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
  summary: '<p>Summary 1</p>', // Added <p> tags to simulate potential HTML
  updated: 1678886400,
  _links: { self: { href: 'http://api.tvmaze.com/shows/1' } },
}

test.describe('Show Detail Page', () => {
  // Mock the API before each test
  test.beforeEach(async ({ page }) => {
    // Mock the GET https://api.tvmaze.com/shows/:id endpoint
    // Ensure the URL includes the ?embed=cast parameter used by the composable
    await page.route(`https://api.tvmaze.com/shows/${mockShowDetail.id}?embed=cast`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockShowDetail),
      })
    })

    // Navigate to the show detail page
    await page.goto('/') // Add navigation to the index page first
    await page.waitForURL('/') // Ensure we are on the index page
    await page.goto(`/shows/${mockShowDetail.id}`)
    // Wait specifically for the mocked response (with the correct URL)
    await page.waitForResponse(`https://api.tvmaze.com/shows/${mockShowDetail.id}?embed=cast`)
    // Wait for the page to potentially finish loading data
    await page.waitForLoadState('networkidle')
  })

  test('has no detectable a11y violations on load', async ({ page }) => {
    await expectNoA11yViolations(page)
  })

  test('should display the show details correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(`${mockShowDetail.name} - TV Shows`)

    // Check main elements are visible
    const article = page.locator('article.show-detail')
    await expect(article).toBeVisible()

    // Check show title
    await expect(article.locator('h1')).toHaveText(mockShowDetail.name)

    // Check image (using alt text)
    await expect(article.locator(`img[alt="${mockShowDetail.name} poster"]`)).toBeVisible()
    await expect(article.locator(`img[alt="${mockShowDetail.name} poster"]`)).toHaveAttribute('src', mockShowDetail.image!.original)

    // Check genres
    const genreContainer = article.locator('.flex.flex-wrap.gap-2') // Container for genre tags
    for (const genre of mockShowDetail.genres) {
      await expect(genreContainer.locator(`span:has-text("${genre}")`)).toBeVisible()
    }

    // Check rating
    await expect(article.locator(`span:has-text("${mockShowDetail.rating.average}")`)).toBeVisible()

    // Check summary (ensure HTML is stripped)
    const summaryElement = article.locator('p.text-gray-300.leading-relaxed')
    await expect(summaryElement).toBeVisible()
    await expect(summaryElement).toHaveText('Summary 1') // Check that HTML tags are stripped by the component

    // Check network info
    const networkText = `Network: ${mockShowDetail.network!.name} (${mockShowDetail.network!.country!.name})`
    await expect(article.locator(`p:has-text("${networkText}")`)).toBeVisible()

    // Check schedule
    const scheduleText = `Schedule: ${mockShowDetail.schedule.days.join(', ')} at ${mockShowDetail.schedule.time}`
    await expect(article.locator(`p:has-text("${scheduleText}")`)).toBeVisible()

    // Check status
    await expect(article.locator(`p:has-text("Status: ${mockShowDetail.status}")`)).toBeVisible()

    // Check runtime
    await expect(article.locator(`p:has-text("Runtime: ${mockShowDetail.runtime} min")`)).toBeVisible()

    // Check official site link
    if (mockShowDetail.officialSite) {
      const siteLink = article.locator('a:has-text("Visit Website")')
      await expect(siteLink).toBeVisible()
      await expect(siteLink).toHaveAttribute('href', mockShowDetail.officialSite)
    }

    // Check IMDb link
    if (mockShowDetail.externals.imdb) {
      const imdbLink = article.locator('a:has-text("View on IMDb")')
      await expect(imdbLink).toBeVisible()
      await expect(imdbLink).toHaveAttribute('href', `https://www.imdb.com/title/${mockShowDetail.externals.imdb}`)
    }
  })

  test('should navigate back when the back button is clicked', async ({ page }) => {
    // Get the back button
    const backButton = page.locator('button:has-text("Back to shows overview")')
    await expect(backButton).toBeVisible() // Ensure the button is visible

    // Click the back button
    await backButton.click()

    // Verify navigation back to the index page
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })
})
