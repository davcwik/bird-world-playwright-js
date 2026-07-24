import { expect, type Locator, type Page } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';
import { fillSecret } from '../utils/SecureActions';


export class LostPasswordPageBase {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly getNewPasswordButton: Locator;
  private readonly loginPageLink: Locator;
  private readonly lostPasswordFormContainer: Locator;
  private readonly notificationMessageTextBlock: Locator;
  private readonly page: Page;
  private readonly usernameEmailAddressInput: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.getNewPasswordButton = page.getByRole('button', { name: 'Get New Password' })
    this.loginPageLink = page.getByRole('link', { name: 'login page' });
    this.lostPasswordFormContainer = page.locator('#lostpasswordform');
    this.notificationMessageTextBlock = page.locator("div.notice-info > p");
    this.page = page;
    this.usernameEmailAddressInput = page.getByRole('textbox', { name: 'Username or Email Address' })
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLostPasswordPage() {
    await this.page.goto('/wp-login.php?action=lostpassword');
  }

  async expectLostPasswordPageToBeVisible() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.lostPasswordFormContainer).toBeVisible();
  }

  async expectNotificationMessageTextToBeVisible(myText: string) {
    await expect(this.notificationMessageTextBlock.getByText(myText)).toBeVisible();
  }

    /**
   * Input text in Username Email Address input field (fillSecret will mask text in logs)
   * @param myText - text to input
   */
  async inputTextInLostPasswordForm(myText: string) {
    const username = EnvFileReader.getProperty(myText);
    await fillSecret(this.usernameEmailAddressInput, username);
  }  

  async clickGetNewPasswordButton() {
    await this.getNewPasswordButton.click();
  }   

  async clickLoginPageLink() {
    await this.loginPageLink.click();
  }  


}