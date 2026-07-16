import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;
  private readonly logInForm: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly logInButton: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.logInForm = page.locator('#loginform');
    this.usernameInput = page.getByLabel('Username or Email Address');
    this.passwordInput = page.getByLabel('Password');
    this.logInButton = page.getByRole('button', { name: 'Log In' });
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLoginPage() {
    await this.page.goto('https://blackbird77.com/wp-login.php');
  }

    async theLoginPageIsDisplayed() {
      await expect(this.logInForm).toBeVisible();
  }

  // async login(user: string, pass: string) {
  //   await this.usernameInput.fill(user);
  //   await this.passwordInput.fill(pass);
  //   await this.submitButton.click();
  // }
}