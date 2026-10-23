import { test, expect } from '../../utils/PageFixtures';
import { BrowserUtils } from '../../utils/BrowserUtils';


test.describe('Mobile - Global Header', { tag: ['@platform-mobile', '@feature-global-header'] }, () => {

  test('Global Header: Navigation menu button and link functionality for logged out user @priority-critical @dave', async ({ categoryPage, loginPage, globalHeaderMobile, homePage, page }) => {
  
    await homePage.goToHomePage();
    await homePage.expectHomePageToBeVisible();

    await globalHeaderMobile.clickHamburgerMenuButton();
    await globalHeaderMobile.clickCloseXButtonInNavigationMenu();
    await globalHeaderMobile.expectNavigationFlyoutMenuToBeHidden();


    // await globalHeaderDesktop.clickLinkInNavigationMenu("Announcements");
    // await categoryPage.expectCategoryPageToBeVisible("Announcements");

    // await homePage.expectHomePageToBeVisible();
    // await globalHeaderDesktop.clickLinkInNavigationMenu("Test");
    // await categoryPage.expectCategoryPageToBeVisible("Test");

    // await globalHeaderDesktop.clickLinkInNavigationMenu("Home");
    // await homePage.expectHomePageToBeVisible();

    // await globalHeaderDesktop.clickLinkInNavigationMenu("Log In");
    // await loginPage.expectLoginPageToBeVisible();
 
  }); // end test


}); 