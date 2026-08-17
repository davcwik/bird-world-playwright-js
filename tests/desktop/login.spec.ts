import { test, expect } from '../../utils/PageFixtures';



test.describe('Desktop - Login', { tag: ['@platform-desktop', '@feature-login'] }, () => {

  test('Login Success and Logout happy path (user email) @priority-critical', async ({ loginPageBase, globalHeaderDesktop, profilePageBase }) => {
  
    // Log in
    await loginPageBase.goToLoginPage();
    await loginPageBase.expectLoginPageToBeVisible();
    await loginPageBase.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPageBase.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPageBase.clickLogInButton();
    await profilePageBase.expectProfilePageToBeVisible();

    // Log out
    await globalHeaderDesktop.hoverOverUserAvatarImage();
    await globalHeaderDesktop.clickLogOutButton();
    await loginPageBase.expectLoginPageToBeVisible();
    await loginPageBase.expectMessageTextToBeVisible("You are now logged out.");

  }); // end test

  
  test('Login Page Loads @priority-high', async ({ loginPageBase }) => {

    await loginPageBase.goToLoginPage();
    await loginPageBase.expectLoginPageToBeVisible();

  }); // end test


  
});