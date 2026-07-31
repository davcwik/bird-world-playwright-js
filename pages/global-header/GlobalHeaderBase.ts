import { expect, test, type Locator, type Page } from '@playwright/test';


export abstract class GlobalHeaderBase {

  ///////////////
  // VARIABLES //
  ///////////////

  protected readonly page: Page
  protected readonly avatarImage: Locator;
  private readonly logOutButton: Locator;
  private readonly profileFlyoutMenu: Locator;  


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.avatarImage = page.locator('li.menupop.with-avatar');
    this.logOutButton = page.getByRole('menuitem', { name: 'Log Out' });
    this.profileFlyoutMenu = page.locator('li.menupop.with-avatar.hover');
  }


  ///////////////
  // FUNCTIONS //
  ///////////////

  async expectProfileFlyoutMenuToBeVisible(): Promise<void> {
    await test.step(`Verify Profile flyout menu is visible`, async () => {
      await expect(this.profileFlyoutMenu).toBeVisible();
    });  
  }

  async clickLogOutButton(): Promise<void> {
    await test.step(`Click Log Out button`, async () => {
      await this.logOutButton.click();
    });  
  }


}