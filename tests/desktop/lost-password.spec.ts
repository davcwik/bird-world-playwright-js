import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPageBase';
import { LostPasswordPage } from '../../pages/LostPasswordPageBase';

///////////////
// VARIABLES //
///////////////

let loginPage: LoginPage;
let lostPasswordPage: LostPasswordPage;


///////////
// SETUP //
///////////

test.beforeEach(async ({ page }) => {
  // instantiate a fresh page object for every test, necessary to run tests in parallel
  lostPasswordPage = new LostPasswordPage(page);
  loginPage = new LoginPage(page);
});


///////////
// TESTS //
///////////

test.describe('Desktop - Lost Password', { tag: ['@platform-desktop', '@feature-lostPassword'] }, () => {

  test('Lost Password happy path (user email) @priority-critical', async ({ page }) => {

    // Preconditions
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();

    // Test
    await loginPage.clickLostYourPasswordLink();
    await lostPasswordPage.expectLostPasswordPageToBeVisible();
    await lostPasswordPage.expectNotificationMessageTextToBeVisible("Please enter your username or email address. You will receive an email message with instructions on how to reset your password.");
    
    await lostPasswordPage.inputTextInLostPasswordForm("SUBSCRIBER_USER_EMAIL");
    await lostPasswordPage.clickGetNewPasswordButton();
    await lostPasswordPage.expectNotificationMessageTextToBeVisible("Check your email for the confirmation link, then visit the login page.");
    
    await lostPasswordPage.clickLoginPageLink();
    await loginPage.expectLoginPageToBeVisible();
  });


  
});