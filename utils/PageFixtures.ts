import { test as base, Page } from '@playwright/test';


/////////////////////////////////////////////////
// Import Page Classes (Base, Desktop, Mobile) //
/////////////////////////////////////////////////

import { GlobalHeaderBase } from '../pages/global-header/GlobalHeaderBase';
import { GlobalHeaderDesktop } from '../pages/global-header/GlobalHeaderDesktop';
import { GlobalHeaderMobile } from '../pages/global-header/GlobalHeaderMobile';
import { LoginPageBase } from '../pages/LoginPageBase';
import { LostPasswordPageBase } from '../pages/LostPasswordPageBase';
import { ProfilePageBase } from '../pages/ProfilePageBase';


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

  // Non-Polymorphic Page Objects (no subclasses)
  loginPageBase: LoginPageBase;
  lostPasswordPageBase: LostPasswordPageBase;
  profilePageBase: ProfilePageBase;

  // Polymorphic Page Objects (has subclasses)
  globalHeaderBase: GlobalHeaderBase;

  // Subclasses (Desktop and/or Mobile subclasses)
  globalHeaderDesktop: GlobalHeaderDesktop;
  globalHeaderMobile: GlobalHeaderMobile;

};

// Fixture Setup (Playwright lazy-loads these automatically per test)
export const test = base.extend<FrameworkFixtures>({

  // Non-Polymorphic Page Objects (no subclasses)
  loginPageBase: async ({ page }, use) => {
    await use(new LoginPageBase(page));
  },
  lostPasswordPageBase: async ({ page }, use) => {
    await use(new LostPasswordPageBase(page));
  },
  profilePageBase: async ({ page }, use) => {
    await use(new ProfilePageBase(page));
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