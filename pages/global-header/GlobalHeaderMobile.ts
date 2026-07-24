import { Locator } from '@playwright/test';
import { GlobalHeaderBase } from './GlobalHeaderBase';


export class GlobalHeaderMobile extends GlobalHeaderBase {

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

    async tapUserAvatarImage() {
      await this.avatarImage.tap();
      this.expectProfileFlyoutMenuToBeVisible();
    }


}