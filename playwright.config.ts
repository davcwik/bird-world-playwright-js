import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const environment = process.env.ENV || 'production';

// verify that the ENV variable was passed
if (!environment) {
  throw new Error("CRITICAL CONFIG ERROR: The ENV environment variable is not set.");
}

// construct the path for the decrypted .env file
const envFilePath = path.resolve(__dirname, `.env.${environment}`);

// if the file does not exist, end the run
if (!fs.existsSync(envFilePath)) {
  throw new Error(`CRITICAL CONFIG ERROR: Environment file not found at expected path: "${envFilePath}". Ensure decryption step completed successfully.`);
}

// load the file
dotenv.config({ path: envFilePath });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  // This uses the defaulty chromium installation that Github actions uses to run tests in the cloud
  // if you want to use the actual Chrome browser on your laptop, you need to instead scroll down to
  // the similar code block that also includes the "channel: 'chrome'" code
  // but be aware that using 'channel' property will cause problems when Github Actions runs tests in the c
  projects: [
    {
      name: 'Github Chrome (Chromium)',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // Causes error during setup because webkit wont' load since laptop is running old OS (Ventura 13)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    //{
    //  name: 'Google Chrome',
    //  use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    //},
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
