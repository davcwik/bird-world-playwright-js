import { expect, type Locator, type Page } from '@playwright/test';

export class GlobalHeader {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;
  private readonly avatarImage: Locator;
  private readonly logOutButton: Locator;
  private readonly profileFlyoutMenu: Locator;  


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
    this.avatarImage = page.locator('img.avatar');
    this.logOutButton = page.getByRole('menuitem', { name: 'Log Out' });
    this.profileFlyoutMenu = page.locator('li.menupop.with-avatar.hover');
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async expectProfileFlyoutMenuToBeVisible() {
    await expect(this.profileFlyoutMenu).toBeVisible();
  }

  /**
   * Hover over the user avatar image
   * Verify the Flyout Menu is visible
   */
  async hoverOverUserAvatarImage() {
    await this.avatarImage.hover();
    this.expectProfileFlyoutMenuToBeVisible();
  }

  async clickLogOutButton() {
    await this.logOutButton.click();
  }


}