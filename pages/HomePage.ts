import { expect, test, type Locator, type Page } from '@playwright/test';


export class HomePage {

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

  async expectHomePageToBeVisible(): Promise<void> {
    await test.step(`Verify Home Page is visible`, async () => {
      await this.page.waitForLoadState('networkidle');
      const homePageContent = this.page.locator("//h2/a[contains(text(), 'Welcome to Bird World')]");
      await expect(homePageContent).toBeVisible();
    });
  }

}
