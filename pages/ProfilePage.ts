import { expect, type Locator, type Page } from '@playwright/test';

export class ProfilePage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;
  private readonly profileForm: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.profileForm = page.locator('#your-profile');
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async expectProfilePageToBeVisible() {
    await expect(this.profileForm).toBeVisible();
  }


}