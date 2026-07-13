import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

///////////////
// VARIABLES //
///////////////

let loginPage: LoginPage;


///////////
// SETUP //
///////////


test.beforeEach(async ({ page }) => {
  // instantiate a completely fresh page object before every single test run
  // necessary to run tests in parallel
  loginPage = new LoginPage(page);
});

///////////
// TESTS //
///////////

test('Login Success and Logout happy path (user email)', async ({ page }) => {
  
    await loginPage.goToLoginPage();

  // 2. Expect the page title to contain a specific word
  await expect(page).toHaveTitle(/Playwright/);

  // 3. Find the "Get Started" button and click it
  await page.getByRole('link', { name: 'Get started' }).click();

  // 4. Expect the new URL to contain the word "intro"
  await expect(page).toHaveURL(/.*intro/);
});