import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPageBase';
import { ProfilePage } from '../../pages/ProfilePageBase';
import { GlobalHeaderBase } from '../../pages/global-header/GlobalHeaderBase';

///////////////
// VARIABLES //
///////////////

let globalHeaderBase: GlobalHeaderBase;
let loginPage: LoginPage;
let profilePage: ProfilePage;


///////////
// SETUP //
///////////

test.beforeEach(async ({ page }) => {
  // instantiate a fresh page object for every test, necessary to run tests in parallel
  globalHeaderBase = new GlobalHeaderBase(page);
  loginPage = new LoginPage(page);
  profilePage = new ProfilePage(page);
});


///////////
// TESTS //
///////////

test.describe('Mobile - Login', { tag: ['@platform-mobile', '@feature-login'] }, () => {

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




