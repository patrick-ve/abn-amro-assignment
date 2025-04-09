import type { Page, PageAssertionsToHaveScreenshotOptions } from '@playwright/test'
import { expect } from '@playwright/test'

export const colorModes = ['light', 'dark', 'lightHighContrast', 'darkHighContrast']
export type ColorMode = typeof colorModes[number]

export async function setColorMode(page: Page, mode: ColorMode) {
  await page.evaluate(({ mode }) => {
    localStorage.setItem('nuxt-color-mode', mode)
  }, { mode })
  await page.reload()
}

export async function expectVisualSnapshotInColorMode(
  page: Page,
  mode: ColorMode,
  options: PageAssertionsToHaveScreenshotOptions = { fullPage: true },
) {
  await setColorMode(page, mode)
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot(options)
}
