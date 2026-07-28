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

  async goToLoginPage(): Promise<void> {
    await this.page.goto('/wp-login.php');
  }

  async expectLoginPageToBeVisible(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.logInFormContainer).toBeVisible();
  }

    /**
   * Input text in Username Email input field (fillSecret will mask text in logs)
   * @param myText - text to input
   */
  async inputTextInUsernameEmailField(myText: string): Promise<void> {
    const username = EnvFileReader.getProperty(myText);
    await fillSecret(this.usernameEmailInput, username);
  }  

  /**
   * Input text in Password input field (fillSecret will mask text in logs)
   * @param myText - text to input
   */
  async inputTextInPasswordField(myText: string): Promise<void> {
    const password = EnvFileReader.getProperty(myText);
    await fillSecret(this.passwordInput, password);
  }   

  async expectMessageTextToBeVisible(myText: string): Promise<void> {
    await expect(this.messageTextBlock.getByText(myText)).toBeVisible();
  }

  async clickLogInButton(): Promise<void> {
    await this.logInButton.click();
  }   

  async clickLostYourPasswordLink(): Promise<void> {
    await this.lostYourPasswordLink.click();
  }   


}