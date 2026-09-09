import { test, expect } from '../../utils/PageFixtures';
import { BrowserUtils } from '../../utils/BrowserUtils';


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


  test('Login input fields empty state logic @priority-high', async ({ loginPage }) => {
  
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();

    // Password field empty
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.clickLogInButton();
    await loginPage.expectLoginPageToBeVisible();

    // Username field empty
    await loginPage.clearUsernameEmailField();
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await loginPage.expectLoginPageToBeVisible();

  }); // end test


  test('Remember Me checkbox session logic @priority-high @dave', async ({ globalHeaderDesktop,loginPage, profilePage, page }) => {
  
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();

    // Remember Me checkbox not selected
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();
    await BrowserUtils.verifyWordPressRememberMeCookie(page.context(), 'disabled');

    await globalHeaderDesktop.hoverOverUserAvatarImage();
    await globalHeaderDesktop.clickLogOutButton();
    await loginPage.expectLoginPageToBeVisible();

      // Remember Me checkbox selected
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.clickRememberMeCheckbox();
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();
    await BrowserUtils.verifyWordPressRememberMeCookie(page.context(), 'enabled');

  }); // end test  


    test('Login Page miscellaneous functionality @priority-medium', async ({ homePage, loginPage }) => {
  
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();

    // Remember Me tooltip icon functionality
    await loginPage.clickRememberMeTooltipIcon();
    const tooltipText: string = "Selecting \"Remember Me\" increases the length of time until you’re asked to log in again on this device. To keep your account secure, use this option only on your personal devices.";
    await loginPage.expectRememberMeTooltipTextToBeVisible(tooltipText);
    await loginPage.clickRememberMeTooltipXCloseButton();
    await loginPage.expectRememberMeTooltipNotToBeVisible();

    // Go to Bird World link functionality
    await loginPage.clickGoToBirdWorldLink();
    await homePage.expectHomePageToBeVisible();
  

  }); // end test





  
});