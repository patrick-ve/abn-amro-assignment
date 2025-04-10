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

  test('should display the show details correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/.* - TV Shows/)

    const article = page.locator('article.show-detail')
    await expect(article).toBeVisible()

    await expect(article.locator('h1')).toBeVisible()
    await expect(article.locator('h1')).not.toBeEmpty()

    const imgLocator = article.locator(`img[alt*="poster"]`)
    await expect(imgLocator).toBeVisible()
    await expect(imgLocator).toHaveAttribute('alt', /.*/)
    await expect(imgLocator).toHaveAttribute('src', /https?:\/\/.+/)

    const genreContainer = article.locator('.flex.flex-wrap.gap-2')
    await expect(genreContainer).toBeVisible()
    await expect(genreContainer.locator('span').first()).toBeVisible()

    const ratingElement = article.locator('span:has-text("★")').locator('xpath=./following-sibling::span')
    await expect(ratingElement).toBeVisible()
    await expect(ratingElement).not.toBeEmpty()

    const summaryElement = article.locator('p.text-gray-300.leading-relaxed')
    await expect(summaryElement).toBeVisible()
    await expect(summaryElement).not.toBeEmpty()

    await expect(article.locator('p:has-text("Network:"), p:has-text("Web Channel:")').first()).toBeVisible()

    await expect(article.locator('p:has-text("Schedule:")')).toBeVisible()

    await expect(article.locator('p:has-text("Status:")')).toBeVisible()

    await expect(article.locator('p:has-text("Runtime:")')).toBeVisible()

    const officialSiteLink = article.locator('a:has-text("Visit Website")')
    const imdbLink = article.locator('a:has-text("View on IMDb")')
    await expect(officialSiteLink.or(imdbLink).first()).toBeVisible()
  })

  test('should navigate back when the back button is clicked', async ({ page }) => {
    const backButton = page.locator('a[aria-label="Back to shows overview"]')
    await expect(backButton).toBeVisible()

    await backButton.click()

    await page.waitForURL('/', { timeout: 10000 })
    await expect(page).toHaveURL('/')
  })
})
