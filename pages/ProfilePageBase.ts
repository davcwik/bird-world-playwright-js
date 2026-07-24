import { expect, type Locator, type Page } from '@playwright/test';

export class ProfilePageBase {

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
    await this.page.waitForLoadState('networkidle');
    await expect(this.profileForm).toBeVisible();
  }


}