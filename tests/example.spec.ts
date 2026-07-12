import { test, expect } from '@playwright/test';

test('has title and navigates to getting started page', async ({ page }) => {
  // 1. Navigate to the website
  await page.goto('https://playwright.dev');

  // 2. Expect the page title to contain a specific word
  await expect(page).toHaveTitle(/Playwright/);

  // 3. Find the "Get Started" button and click it
  await page.getByRole('link', { name: 'Get started' }).click();

  // 4. Expect the new URL to contain the word "intro"
  await expect(page).toHaveURL(/.*intro/);
});

