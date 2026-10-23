import { Locator, test } from '@playwright/test';
import { GlobalHeaderBase } from './GlobalHeaderBase';


export class GlobalHeaderDesktop extends GlobalHeaderBase {

  ///////////////
  // VARIABLES //
  ///////////////



  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: any) {
    super(page);
  }


  ///////////////
  // FUNCTIONS //
  ///////////////

  /**
  * Hover over the user avatar image
  * Verify the Flyout Menu is visible
  */
  async hoverOverUserAvatarImage(): Promise<void> {
    await test.step(`Hover over User avatar image`, async () => {
      await this.avatarImage.hover();
      this.expectProfileFlyoutMenuToBeVisible();
    });      
  }

  /**
   * Click a link in the navigation menu for a logged out user
   * @param linkText 
   */
  async clickLinkInNavigationMenu(linkText: string): Promise<void> {
    await test.step(`Click link in Navigation Menu: ${linkText}`, async () => {
      const linkInNavigationMenu = this.page.locator(`div.primary-menu-container a:has-text("${linkText}")`);
      await linkInNavigationMenu.click();
    });
  }

}