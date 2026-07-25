import { test, expect } from '../../utils/PageFixtures';



test.describe('Mobile - Login', { tag: ['@platform-mobile', '@feature-login'] }, () => {

  test('Login Success and Logout happy path (user email) @priority-critical', async ({ loginPageBase, globalHeaderMobile, profilePageBase }) => {
  
    // Log in
    await loginPageBase.goToLoginPage();
    await loginPageBase .expectLoginPageToBeVisible();
    await loginPageBase .inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPageBase .inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPageBase .clickLogInButton();
    await profilePageBase.expectProfilePageToBeVisible();

    // Log out
    await globalHeaderMobile.tapUserAvatarImage();
    await globalHeaderMobile.clickLogOutButton();
    await loginPageBase.expectLoginPageToBeVisible();
    await loginPageBase.expectMessageTextToBeVisible("You are now logged out.");
  });

  
  test('Login Page Loads @priority-high', async ({ loginPageBase }) => {
    await loginPageBase.goToLoginPage();
    await loginPageBase.expectLoginPageToBeVisible();
  });


  
});




