import { test as base, Page, APIRequestContext } from '@playwright/test';

/////////////////////////////////////////////////
// Import Page Classes (Base, Desktop, Mobile) //
/////////////////////////////////////////////////

import { ApiBase } from '../pages/ApiBase';
import { GlobalHeaderBase } from '../pages/global-header/GlobalHeaderBase';
import { GlobalHeaderDesktop } from '../pages/global-header/GlobalHeaderDesktop';
import { GlobalHeaderMobile } from '../pages/global-header/GlobalHeaderMobile';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { LostPasswordPage } from '../pages/LostPasswordPage';
import { ProfilePage } from '../pages/ProfilePage';


/////////////////////////////////////////////////////////////
// Factory Helper (Replaces repetitive if/else statements) //
/////////////////////////////////////////////////////////////

type PageConstructor<T> = new (page: Page) => T;

function createPage<T>(
  isMobile: boolean,
  page: Page,
  DesktopClass: PageConstructor<T>,
  MobileClass: PageConstructor<T>
): T {
  return isMobile ? new MobileClass(page) : new DesktopClass(page);
}


///////////////////
// Fixture Types //
///////////////////

type FrameworkFixtures = {

  // API Objects
  apiBase: ApiBase;
  request: APIRequestContext;

  // Non-Polymorphic Page Objects (no subclasses)
  homePage: HomePage;
  loginPage: LoginPage;
  lostPasswordPage: LostPasswordPage;
  profilePage: ProfilePage;

  // Polymorphic Page Objects (has subclasses)
  globalHeaderBase: GlobalHeaderBase;

  // Subclasses (Desktop and/or Mobile subclasses)
  globalHeaderDesktop: GlobalHeaderDesktop;
  globalHeaderMobile: GlobalHeaderMobile;

};

// Fixture Setup (Playwright lazy-loads these automatically per test)
export const test = base.extend<FrameworkFixtures>({

  // Non-Polymorphic Page Objects (no subclasses)
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  apiBase: async ({ request }, use) => {
    await use(new ApiBase(request));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  lostPasswordPage: async ({ page }, use) => {
    await use(new LostPasswordPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },

  // Polymorphic Page Objects (has subclasses)
  globalHeaderBase: async ({ page, isMobile }, use) => {
    await use(createPage<GlobalHeaderBase>(isMobile, page, GlobalHeaderDesktop, GlobalHeaderMobile));
  },

  // Subclasses (Desktop and/or Mobile subclasses)
  globalHeaderDesktop: async ({ page }, use) => {
    await use(new GlobalHeaderDesktop(page));
  },
  globalHeaderMobile: async ({ page }, use) => {
    await use(new GlobalHeaderMobile(page));
  },

});

export { expect } from '@playwright/test';