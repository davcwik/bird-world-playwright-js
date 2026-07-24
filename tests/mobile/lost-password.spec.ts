import { test, expect } from '../../utils/PageFixtures';



test.describe('Mobile - Lost Password', { tag: ['@platform-mobile', '@feature-lostPassword'] }, () => {

  test('Lost Password happy path (user email) @priority-critical', async ({ loginPageBase, lostPasswordPageBase }) => {

    // Preconditions
    await loginPageBase.goToLoginPage();
    await loginPageBase.expectLoginPageToBeVisible();

    // Test
    await loginPageBase.clickLostYourPasswordLink();
    await lostPasswordPageBase.expectLostPasswordPageToBeVisible();
    await lostPasswordPageBase.expectNotificationMessageTextToBeVisible("Please enter your username or email address. You will receive an email message with instructions on how to reset your password.");
    
    await lostPasswordPageBase.inputTextInLostPasswordForm("SUBSCRIBER_USER_EMAIL");
    await lostPasswordPageBase.clickGetNewPasswordButton();
    await lostPasswordPageBase.expectNotificationMessageTextToBeVisible("Check your email for the confirmation link, then visit the login page.");
    
    await lostPasswordPageBase.clickLoginPageLink();
    await loginPageBase.expectLoginPageToBeVisible();

  }); // end test


  
});