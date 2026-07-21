import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LostPasswordPage } from '../../pages/LostPasswordPage';

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

test.describe('Lost Password', { tag: ['@platform-desktop', '@feature-lostPassword'] }, () => {

  test('Lost Password happy path (user email) @priority-critical', async ({ page }) => {
  
    await lostPasswordPage.goToLostPasswordPage();
    await lostPasswordPage.expectLostPasswordPageToBeVisible();
    await lostPasswordPage.expectNotificationMessageTextToBeVisible("Please enter your username or email address. You will receive an email message with instructions on how to reset your password.");
    
    
    // await loginPage.inputTextInUsernameEmailField("SUBSCRIBER_USER_EMAIL");
    // await loginPage.inputTextInPasswordField("SUBSCRIBER_USER_PASSWORD");
    // await loginPage.clickLogInButton();
    // await profilePage.expectProfilePageToBeVisible();

    // // Log out
    // await globalHeader.hoverOverUserAvatarImage();
    // await globalHeader.clickLogOutButton();
    // await loginPage.expectLoginPageToBeVisible();
    // await loginPage.expectMessageTextToBeVisible("You are now logged out.");
  });

  
  // @priority-critical
  // Scenario: Lost Password happy path (user email)

  //   When R: I go to the Lost Password Page
  //   Then R: The Lost Password Page is displayed
  //   And R: The following notification message is displayed on the Lost Password Page:
  //     | Please enter your username or email address. You will receive an email message with instructions on how to reset your password. |

  //   When R: I input the following values in the Lost Password form on the Lost Password Page:
  //     | Email Username        |
  //     | subscriber_user_email |
  //   And R: I click the Get New Password button on the Lost Password Page
  //   Then R: The following notification message is displayed on the Lost Password Page:
  //     | Check your email for the confirmation link, then visit the login page |

  //   When R: I click the login-page link on the Lost Password Page
  //   Then R: The Login Page is displayed


  
});