import { expect, type Locator, type Page } from '@playwright/test';


export class LostPasswordPage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;
    private readonly lostPasswordForm: Locator;
//   private readonly usernameEmailInput: Locator;
//   private readonly passwordInput: Locator;
//   private readonly logInButton: Locator;
   private readonly notificationMessageTextBlock: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.lostPasswordForm = page.locator('#lostpasswordform');
    // this.usernameEmailInput = page.getByRole('textbox', { name: 'Username or Email Address' })
    // this.passwordInput = page.getByRole('textbox', { name: 'Password' })
    // this.logInButton = page.getByRole('button', { name: 'Log In' });
    this.notificationMessageTextBlock = page.locator("div.notice-info > p");
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLostPasswordPage() {
    await this.page.goto('/wp-login.php?action=lostpassword');
  }

  async expectLostPasswordPageToBeVisible() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.lostPasswordForm).toBeVisible();
  }

  async expectNotificationMessageTextToBeVisible(myText: string) {
    await expect(this.notificationMessageTextBlock.getByText(myText)).toBeVisible();
  }

//     /**
//    * Input text in Username Email input field (fillSecret will mask text in logs)
//    * @param myText - text to input
//    */
//   async inputTextInUsernameEmailField(myText: string) {
//     const username = EnvFileReader.getProperty(myText);
//     await fillSecret(this.usernameEmailInput, username);
//   }  

//   /**
//    * Input text in Password input field (fillSecret will mask text in logs)
//    * @param myText - text to input
//    */
//   async inputTextInPasswordField(myText: string) {
//     const password = EnvFileReader.getProperty(myText);
//     await fillSecret(this.passwordInput, password);
//   }   

//   async expectMessageTextToBeVisible(myText: string) {
//     await expect(this.messageTextBlock.getByText(myText)).toBeVisible();
//   }

//   async clickLogInButton() {
//     await this.logInButton.click();
//   }   


}