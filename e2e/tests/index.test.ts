import { expect, test } from '@playwright/test'
import { expectNoA11yViolations } from '../plugins/a11y'

test.describe('Index Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('has no detectable a11y violations on load', async ({ page }) => {
    await expectNoA11yViolations(page)
  })

  test('should display the hero section with a show', async ({ page }) => {
    const heroSection = page.locator('[data-testid="hero-section"]')
    await expect(heroSection).toBeVisible()

    const heroTitle = heroSection.locator('h2:visible')
    await expect(heroTitle).toBeVisible()
    await expect(heroTitle).not.toBeEmpty()
  })

  test('should display shows grouped by genre', async ({ page }) => {
    await page.waitForSelector('[data-testid^="genre-list-"]', { timeout: 10000 })

    const genreSection = page.locator('[data-testid^="genre-list-"]').first()
    await expect(genreSection).toBeVisible()
    await expect(genreSection.locator('h2')).toBeVisible()

    const showCard = genreSection.locator('[data-testid^="show-card-"]').first()
    await expect(showCard).toBeVisible()
  })

  test('should open search modal, perform search, and navigate on result click', async ({ page }) => {
    const searchButton = page.locator('[data-testid="search-button"]')
    await expect(searchButton).toBeVisible()
    await searchButton.click()

    await page.waitForSelector('[data-testid="base-modal"]', { state: 'visible' })

    const searchModal = page.locator('[data-testid="base-modal"]')
    await expect(searchModal).toBeVisible()

    const searchInput = searchModal.locator('[data-testid="search-input"]')
    await searchInput.fill('Star Trek')

    const searchResultsContainer = searchModal.locator('[data-testid="search-results"]')
    await expect(searchResultsContainer).toBeVisible()

    await expect(searchResultsContainer.locator('[data-testid="loading-spinner"]')).not.toBeVisible({ timeout: 10000 })

    const firstResultCard = searchResultsContainer.locator('article').first()
    await expect(firstResultCard).toBeVisible()

    await firstResultCard.click()

    await page.waitForURL(/\/shows\/\d+/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/shows\/\d+/)
  })
})
