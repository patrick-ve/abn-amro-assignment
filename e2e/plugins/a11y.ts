import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { expect } from '@playwright/test'

const DEFAULT_EXCLUDE = ['#nuxt-devtools-container']

export async function runA11yScan(page: Page, options: {
  exclude?: string[]
  include?: string[]
} = {}) {
  await page.waitForLoadState('networkidle')

  let builder = new AxeBuilder({ page })

  const excludeSelectors = [...DEFAULT_EXCLUDE, ...(options.exclude || [])]
  excludeSelectors.forEach((selector) => {
    builder = builder.exclude(selector)
  })

  if (options.include?.length) {
    options.include.forEach((selector) => {
      builder = builder.include(selector)
    })
  }

  return builder.analyze()
}

export async function expectNoA11yViolations(page: Page, options?: {
  exclude?: string[]
  include?: string[]
}) {
  const results = await runA11yScan(page, options)
  expect(results.violations).toEqual([])
}
