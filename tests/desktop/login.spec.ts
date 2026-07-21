import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { GlobalHeader } from '../../pages/GlobalHeader';

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
  // instantiate a fresh page object for every test, necessary to run tests in parallel
  globalHeader = new GlobalHeader(page);
  loginPage = new LoginPage(page);
  profilePage = new ProfilePage(page);
});


///////////
// TESTS //
///////////

test.describe('Login', { tag: ['@platform-desktop', '@feature-login'] }, () => {

  test('Login Success and Logout happy path (user email) @priority-critical', async ({ page }) => {
  
    // Log in
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();

    // Log out
    await globalHeader.hoverOverUserAvatarImage();
    await globalHeader.clickLogOutButton();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.expectMessageTextToBeVisible("You are now logged out.");
  });

  
  test('Login Page Loads @priority-high', async ({ page }) => {
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
  });


  
});




