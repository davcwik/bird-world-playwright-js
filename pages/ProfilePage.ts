import { expect, type Locator, type Page } from '@playwright/test';

export class ProfilePage {

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

    async theProfilePageIsDisplayed() {
      await expect(this.logInForm).toBeVisible();
  }


}