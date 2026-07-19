import { expect, type Locator, type Page } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';
import { fillSecret } from '../utils/SecureActions';

export class LoginPage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;
  private readonly logInForm: Locator;
  private readonly usernameEmailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly logInButton: Locator;
  private readonly messageTextBlock: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.logInForm = page.locator('#loginform');
    this.usernameEmailInput = page.getByRole('textbox', { name: 'Username or Email Address' })
    this.passwordInput = page.getByRole('textbox', { name: 'Password' })
    this.logInButton = page.getByRole('button', { name: 'Log In' });
    this.messageTextBlock = page.locator("//div[@id = 'login_error']//li[1]");
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLoginPage() {
    await this.page.goto('/wp-login.php');
  }

  async expectLoginPageToBeVisible() {
    await expect(this.logInForm).toBeVisible();
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


}