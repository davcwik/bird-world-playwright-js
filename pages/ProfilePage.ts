import { expect, test, type Page } from '@playwright/test';

export class ProfilePage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async expectProfilePageToBeVisible(): Promise<void> {
    await test.step(`Verify Profile Page is visible`, async () => {
      await this.page.waitForLoadState('networkidle');
      const profileForm = this.page.locator('#your-profile');
      await expect(profileForm).toBeVisible();
    });       
  }


}