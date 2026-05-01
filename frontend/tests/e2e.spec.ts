import { test, expect } from '@playwright/test'

test('homepage shows catalog title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=Petstore Catalog')).toBeVisible()
})
