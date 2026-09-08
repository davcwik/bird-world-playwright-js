import { expect, BrowserContext } from '@playwright/test';

export class BrowserUtils {
  /**
   * Verifies the WordPress authentication cookie expiry based on Remember Me status.
   */
  public static async verifyWordPressRememberMeCookie(
    context: BrowserContext, 
    expectedStatus: string
  ): Promise<void> {
    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name.startsWith('wordpress_logged_in_'));

    if (!authCookie) {
      throw new Error("WordPress auth cookie (wordpress_logged_in_) was not found!");
    }

    const expires = authCookie.expires;

    if (expectedStatus.toLowerCase() === 'enabled') {
      expect(expires, "FAIL: 'Remember Me' was checked, but cookie is a Session cookie.").toBeGreaterThan(0);

      const nowInSeconds = Math.floor(Date.now() / 1000);
      const durationInDays = Math.floor((expires - nowInSeconds) / (24 * 60 * 60));

      expect(
        durationInDays >= 13 && durationInDays <= 14,
        `FAIL: Expected ~14 days expiry duration, but got: ${durationInDays} days.`
      ).toBeTruthy();

    } else if (expectedStatus.toLowerCase() === 'disabled') {
      const isSessionCookie = expires === -1 || expires === undefined;
      expect(
        isSessionCookie,
        `FAIL: 'Remember Me' was UNCHECKED, but cookie has a persistent expiry date.`
      ).toBeTruthy();
    }
  }
}