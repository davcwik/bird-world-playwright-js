import { expect, type Locator, type Page } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';
import { fillSecret } from '../utils/SecureActions';

export class LoginPageBase {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly logInButton: Locator;
  private readonly logInFormContainer: Locator;
  private readonly lostYourPasswordLink: Locator;  
  private readonly messageTextBlock: Locator;
  private readonly page: Page;
  private readonly passwordInput: Locator;
  private readonly usernameEmailInput: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.logInButton = page.getByRole('button', { name: 'Log In' });
    this.logInFormContainer = page.locator('#loginform');
    this.lostYourPasswordLink = page.getByRole('link', { name: 'Lost your password?' });
    this.messageTextBlock = page.locator("#login-message p");
    this.page = page;
    this.passwordInput = page.getByRole('textbox', { name: 'Password' })
    this.usernameEmailInput = page.getByRole('textbox', { name: 'Username or Email Address' })
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLoginPage() {
    await this.page.goto('/wp-login.php');
  }

  async expectLoginPageToBeVisible() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.logInFormContainer).toBeVisible();
  }

    /**
   * Input text in Username Email input field (fillSecret will mask text in logs)
   * @param myText - text to input
   */
  async inputTextInUsernameEmailField(myText: string) {
    const username = EnvFileReader.getProperty(myText);
    await fillSecret(this.usernameEmailInput, username);
  }  

  /**
   * Input text in Password input field (fillSecret will mask text in logs)
   * @param myText - text to input
   */
  async inputTextInPasswordField(myText: string) {
    const password = EnvFileReader.getProperty(myText);
    await fillSecret(this.passwordInput, password);
  }   

  async expectMessageTextToBeVisible(myText: string) {
    await expect(this.messageTextBlock.getByText(myText)).toBeVisible();
  }

  async clickLogInButton() {
    await this.logInButton.click();
  }   

  async clickLostYourPasswordLink() {
    await this.lostYourPasswordLink.click();
  }   


}