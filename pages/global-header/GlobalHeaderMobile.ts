import { Locator, test } from '@playwright/test';
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

    async tapUserAvatarImage(): Promise<void> {
      await test.step(`Tap User avatar image`, async () => {
        await this.avatarImage.tap();
        this.expectProfileFlyoutMenuToBeVisible();
      });         

    }


}