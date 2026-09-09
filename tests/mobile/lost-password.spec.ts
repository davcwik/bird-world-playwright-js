import { test, expect } from '../../utils/PageFixtures';



test.describe('Mobile - Lost Password', { tag: ['@platform-mobile', '@feature-lostPassword'] }, () => {

  test('Lost Password happy path (user email) @priority-critical', async ({ loginPage, lostPasswordPage }) => {

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

  }); // end test


  
});