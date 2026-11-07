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


}