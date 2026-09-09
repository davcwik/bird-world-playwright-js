import { test, expect } from '../../utils/PageFixtures';
import { BrowserUtils } from '../../utils/BrowserUtils';



test.describe('Mobile - Login', { tag: ['@platform-mobile', '@feature-login'] }, () => {

  test('Login Fail, Login Success and Logout happy path (user email) @priority-critical', async ({ loginPage, globalHeaderMobile, profilePage }) => {
  
    // Login Fail
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.inputTextInPasswordField("InVaLidPw");
    await loginPage.clickLogInButton();
    await loginPage.expectErrorMessageTextToBeVisible("ERROR: Incorrect Username or Password");

    // Login Success
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

  
  test('Login success using username @priority-high', async ({ loginPage, profilePage }) => {
    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_NAME");
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();
  });


  test('Login input Required fields logic @priority-high', async ({ loginPage }) => {

    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();

    // Password field empty
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.clickLogInButton();
    await loginPage.expectRequiredFieldValidationMessage('password', 'Please fill out this field.');
    await loginPage.expectLoginPageToBeVisible();

    // Username field empty
    await loginPage.clearUsernameEmailField();
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await loginPage.expectRequiredFieldValidationMessage('username', 'Please fill out this field.');
    await loginPage.expectLoginPageToBeVisible();

  });


  test('Show/hide password control @priority-medium', async ({ loginPage }) => {

    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");

    await loginPage.expectPasswordFieldType('password');
    await loginPage.clickShowPasswordButton();
    await loginPage.expectPasswordFieldType('text');
    await loginPage.clickHidePasswordButton();
    await loginPage.expectPasswordFieldType('password');

  });


  test('Remember Me checkbox session logic @priority-high', async ({ globalHeaderMobile, loginPage, profilePage, page }) => {

    await loginPage.goToLoginPage();
    await loginPage.expectLoginPageToBeVisible();

    // Remember Me checkbox not selected
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();
    await BrowserUtils.verifyWordPressRememberMeCookie(page.context(), 'disabled');

    await globalHeaderMobile.tapUserAvatarImage();
    await globalHeaderMobile.clickLogOutButton();
    await loginPage.expectLoginPageToBeVisible();

    // Remember Me checkbox selected
    await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    await loginPage.clickRememberMeCheckbox();
    await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    await loginPage.clickLogInButton();
    await profilePage.expectProfilePageToBeVisible();
    await BrowserUtils.verifyWordPressRememberMeCookie(page.context(), 'enabled');

  });


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

  });


  
});




