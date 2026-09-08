import { test, expect } from '../../utils/PageFixtures';



test.describe('Mobile - Login', { tag: ['@platform-mobile', '@feature-login'] }, () => {

  test('Login Success and Logout happy path (user email) @priority-critical', async ({ loginPage, globalHeaderMobile, profilePage }) => {
  
    // Log in
    await loginPage.goToLoginPage();
    await loginPage .expectLoginPageToBeVisible();
    await loginPage .inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage .inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage .clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();

    // Log out
    await globalHeaderMobile.tapUserAvatarImage();
    await globalHeaderMobile.clickLogOutButton();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.expectMessageTextToBeVisible("You are now logged out.");
  });

  
  test('Login Page Loads @priority-high', async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
  });


  
});




