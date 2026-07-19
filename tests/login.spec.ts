import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { GlobalHeader } from '../pages/GlobalHeader';

///////////////
// VARIABLES //
///////////////

let globalHeader: GlobalHeader;
let loginPage: LoginPage;
let profilePage: ProfilePage;


///////////
// SETUP //
///////////


test.beforeEach(async ({ page }) => {
  // instantiate a completely fresh page object before every single test run
  // necessary to run tests in parallel
  globalHeader = new GlobalHeader(page);
  loginPage = new LoginPage(page);
  profilePage = new ProfilePage(page);
});


///////////
// TESTS //
///////////

test.describe('Login', { tag: ['@platform-desktop', '@feature-login'] }, () => {

  test('Login Success and Logout happy path (user email) @priority-critical', async ({ page }) => {
  
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();

    await globalHeader.hoverOverUserAvatarImage();
    await globalHeader.clickLogOutButton();
    await loginPage.expectLoginPageToBeVisible();
    await.loginPage.expectMessageTextToBeVisible();






  });
});

    // And R: The following message text is displayed on the Login Page:
    //   | You are now logged out. |

  // // 2. Expect the page title to contain a specific word
  // await expect(page).toHaveTitle(/Playwright/);

  // // 3. Find the "Get Started" button and click it
  // await page.getByRole('link', { name: 'Get started' }).click();

  // // 4. Expect the new URL to contain the word "intro"
  // await expect(page).toHaveURL(/.*intro/);


