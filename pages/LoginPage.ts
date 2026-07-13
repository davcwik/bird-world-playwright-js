import { type Locator, type Page } from '@playwright/test';

export class LoginPage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Log in' });
  }

  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLoginPage() {
    await this.page.goto('https://blackbird77.com/wp-login');
  }

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }
}