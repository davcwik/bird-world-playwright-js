import { expect, test, type Locator, type Page } from '@playwright/test';


export class CategoryPage {

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

  async expectCategoryPageToBeVisible(categoryName: string): Promise<void> {
    await test.step(`Verify ${categoryName} Category Page is visible`, async () => {
      await this.page.waitForLoadState('networkidle');
      const pageTitleText = "Category: " + categoryName;
      const pageTitle = this.page.locator(`//h1[@class='page-title'][normalize-space()='${pageTitleText}']`);
      await expect(pageTitle).toBeVisible();
    });
  }

}
