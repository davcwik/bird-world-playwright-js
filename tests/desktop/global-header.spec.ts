import { test, expect } from '../../utils/PageFixtures';
import { BrowserUtils } from '../../utils/BrowserUtils';


test.describe('Desktop - Global Header', { tag: ['@platform-desktop', '@feature-global-header'] }, () => {

  test('Global Header: Navigation menu button and link functionality for logged out user @priority-critical', async ({ categoryPage, loginPage, globalHeaderDesktop, homePage, page }) => {
  
    await homePage.goToHomePage();
    await homePage.expectHomePageToBeVisible();
    await globalHeaderDesktop.clickLinkInNavigationMenu("Announcements");
    await categoryPage.expectCategoryPageToBeVisible("Announcements");

    await page.goBack()
    await homePage.expectHomePageToBeVisible();
    await globalHeaderDesktop.clickLinkInNavigationMenu("Test");
    await categoryPage.expectCategoryPageToBeVisible("Test");

    await globalHeaderDesktop.clickLinkInNavigationMenu("Home");
    await homePage.expectHomePageToBeVisible();

    await globalHeaderDesktop.clickLinkInNavigationMenu("Log In");
    await loginPage.expectLoginPageToBeVisible();
 
  }); // end test


}); 