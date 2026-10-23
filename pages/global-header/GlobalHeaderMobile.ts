import { Locator, test, expect } from '@playwright/test';
import { GlobalHeaderBase } from './GlobalHeaderBase';


export class GlobalHeaderMobile extends GlobalHeaderBase {

  ///////////////
  // VARIABLES //
  ///////////////

  readonly closeXButton: Locator; 
  

  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: any) {
    super(page);
    this.closeXButton = page.getByRole('button', { name: 'Close', exact: true });
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

    async clickHamburgerMenuButton(): Promise<void> {
      await test.step(`Click Hamburger menu button`, async () => {
        const hamburgerMenuButton = this.page.getByRole('button', { name: 'Menu', exact: true })
        await hamburgerMenuButton.click();
      });
    }

    async clickCloseXButtonInNavigationMenu(): Promise<void> {
      await test.step(`Click Close X button in navigation menu`, async () => {
        await this.closeXButton.click();
      });
    }

    async expectNavigationFlyoutMenuToBeHidden(): Promise<void> {
      await test.step(`Expect Navigation flyout menu to be hidden`, async () => {
        await expect(this.closeXButton).toBeHidden();
      });
    } 


}