import { test, expect } from '../../utils/PageFixtures';


test.describe('Desktop - Login', { tag: ['@platform-desktop', '@feature-login'] }, () => {

  test('Login Fail, LoginSuccess and Logout happy path (user email) @priority-critical', async ({ loginPage, globalHeaderDesktop, profilePage }) => {
  
    // Log in Fail
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.inputTextInPasswordField("InVaLidPw");
    await loginPage.clickLogInButton();
    await loginPage.expectErrorMessageTextToBeVisible("ERROR: Incorrect Username or Password");

        // Log in Success
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();

    // Log out
    await globalHeaderDesktop.hoverOverUserAvatarImage();
    await globalHeaderDesktop.clickLogOutButton();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.expectMessageTextToBeVisible("You are now logged out.");

  }); // end test

  



  
});