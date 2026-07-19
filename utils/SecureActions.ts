import { test, Locator } from '@playwright/test';

/**
 * Fills an input field without leaking the secret value into Playwright logs
 */
export async function fillSecret(locator: Locator, value: string): Promise<void> {

  // wrap in a test step so the console report has a clean, generic name
  await test.step(`Input text masked for locator: ${locator.toString()}`, async () => {
    
    // wait for the field to be ready
    await locator.waitFor({ state: 'visible' });
    
    // inject the value via DOM evaluation to bypass Playwright's plaintext argument logger
    await locator.evaluate((el: HTMLInputElement, val) => {
      el.value = val;
      // Dispatch input/change events so frameworks (React, Angular, Vue) register the typing
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  });
}