import { expect, test } from '@playwright/test'
import { expectNoA11yViolations } from '../plugins/a11y'

const testShowId = 1

test.describe('Show Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/shows/${testShowId}`)
    await page.waitForResponse(`https://api.tvmaze.com/shows/${testShowId}?embed=cast`)
    await page.waitForLoadState('networkidle')
  })

  test('has no detectable a11y violations on load', async ({ page }) => {
    await expectNoA11yViolations(page)
  })

  test('should display the correct page title and main heading', async ({ page }) => {
    await expect(page).toHaveTitle(/.* - TV Shows/)
    const article = page.locator('article.show-detail')
    await expect(article).toBeVisible()
    const heading = article.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).not.toBeEmpty()
  })

  test('should display the show poster image', async ({ page }) => {
    const article = page.locator('article.show-detail')
    const imgLocator = article.locator(`img[alt*="poster"]`)
    await expect(imgLocator).toBeVisible()
    await expect(imgLocator).toHaveAttribute('alt', /.+/)
    await expect(imgLocator).toHaveAttribute('src', /^https?:\/\/.+/)
  })

  test('should display show genres', async ({ page }) => {
    const article = page.locator('article.show-detail')
    const genreContainer = article.locator('.flex.flex-wrap.gap-2')
    await expect(genreContainer).toBeVisible()
    await expect(genreContainer.locator('span').first()).toBeVisible()
  })

  test('should display rating, type, language, and runtime', async ({ page }) => {
    const article = page.locator('article.show-detail')
    const ratingElement = article.locator('span:has-text("★")').locator('xpath=./following-sibling::span')
    await expect(ratingElement).toBeVisible()
    await expect(ratingElement).not.toBeEmpty()

    const metaInfoContainer = ratingElement.locator('xpath=ancestor::div[contains(@class, "flex-wrap")]')
    const dataSpans = metaInfoContainer.locator('> span:not(.hidden)')
    await expect(dataSpans).toHaveCount(3)
    await expect(dataSpans.nth(0)).toBeVisible()
    await expect(dataSpans.nth(1)).toBeVisible()
    await expect(dataSpans.nth(2)).toBeVisible()
  })

  test('should display the show summary', async ({ page }) => {
    const article = page.locator('article.show-detail')
    const summaryElement = article.locator('p.text-gray-300.leading-relaxed')
    await expect(summaryElement).toBeVisible()
    await expect(summaryElement).not.toBeEmpty()
  })

  test('should display show details section', async ({ page }) => {
    const article = page.locator('article.show-detail')
    await expect(article.locator('p').filter({ hasText: /Network:|Web Channel:/ })).toBeVisible()
    await expect(article.locator('p').filter({ hasText: 'Schedule:' })).toBeVisible()
    await expect(article.locator('p').filter({ hasText: 'Status:' })).toBeVisible()
    await expect(article.locator('p').filter({ hasText: 'Premiered:' })).toBeVisible()
  })

  test('should display external links (Website/IMDb)', async ({ page }) => {
    const article = page.locator('article.show-detail')
    const officialSiteLink = article.locator('a:has-text("Visit Website")')
    const imdbLink = article.locator('a:has-text("View on IMDb")')
    await expect(officialSiteLink.or(imdbLink).first()).toBeVisible()
  })

  test('should navigate back when the back button is clicked', async ({ page }) => {
    const backButton = page.locator('a[aria-label="Back to shows overview"]')
    await expect(backButton).toBeVisible()
    await backButton.click()
    await page.waitForURL('/', { timeout: 15000 })
    await expect(page).toHaveURL('/')
  })
})
