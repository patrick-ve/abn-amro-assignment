import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Overview Page')
  })
})
