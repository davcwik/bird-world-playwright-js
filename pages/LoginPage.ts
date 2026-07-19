import { expect, type Locator, type Page } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';

export class LoginPage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;
  private readonly logInForm: Locator;
  private readonly usernameEmailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly logInButton: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.logInForm = page.locator('#loginform');
    this.usernameEmailInput = page.getByRole('textbox', { name: 'Username or Email Address' })
    this.passwordInput = page.getByRole('textbox', { name: 'Password' })
    this.logInButton = page.getByRole('button', { name: 'Log In' });
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

  async inputTextInUsernameEmailField(myText: string) {
      const username = EnvFileReader.getProperty(myText);
      await this.usernameEmailInput.fill(username, { sensitive: true });
  }  

  async inputTextInPasswordField(myText: string) {
      const password = EnvFileReader.getProperty(myText);
      await this.passwordInput.fill(password, { sensitive: true });
  }   

  async clickLogInButton() {
      await this.logInButton.click();
  }   




      // 
      // await page.getByRole('menuitem', { name: 'Log Out' }).click();

  // async login(user: string, pass: string) {
  //   await this.usernameInput.fill(user);
  //   await this.passwordInput.fill(pass);
  //   await this.submitButton.click();
  // }
}