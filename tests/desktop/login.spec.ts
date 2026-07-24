import { test, expect } from '../../utils/PageFixtures';


///////////////
// VARIABLES //
///////////////



///////////
// SETUP //
///////////




///////////
// TESTS //
///////////

test.describe('Desktop - Login', { tag: ['@platform-desktop', '@feature-login'] }, () => {

  test('Login Success and Logout happy path (user email) @priority-critical', async ({ loginPage, globalHeader, profilePage }) => {
  
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

  
  test('Login Page Loads @priority-high', async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
  });


  
});




