import { Locator } from '@playwright/test';
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
  async hoverOverUserAvatarImage() {
    await this.avatarImage.hover();
    this.expectProfileFlyoutMenuToBeVisible();
  }


}