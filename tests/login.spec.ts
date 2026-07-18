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
  // instantiate a completely fresh loginPage object before every single test run
  // necessary to run tests in parallel
  loginPage = new LoginPage(page);
});


///////////
// TESTS //
///////////

test.describe('Login', { tag: ['@platform-desktop', '@feature-login'] }, () => {

  test('Login Success and Logout happy path (user email) @priority-critical', async ({ page }) => {
  
      await loginPage.goToLoginPage();
      await loginPage.theLoginPageIsDisplayed();


  });

      //     When R: I input the following values in the Login form on the Login Page:
    //   | Email Username        | Password                 |
    //   | subscriber_user_email | subscriber_user_password |
    // And R: I click the Log In button on the Login Page
    // Then R: The Profile Page is displayed

    // When D: I hover over the User avatar image in the Global Header
    // And R: I click the Log Out button in the Global Header
    // Then R: The Login Page is displayed
    // And R: The following message text is displayed on the Login Page:
    //   | You are now logged out. |

  // // 2. Expect the page title to contain a specific word
  // await expect(page).toHaveTitle(/Playwright/);

  // // 3. Find the "Get Started" button and click it
  // await page.getByRole('link', { name: 'Get started' }).click();

  // // 4. Expect the new URL to contain the word "intro"
  // await expect(page).toHaveURL(/.*intro/);


});