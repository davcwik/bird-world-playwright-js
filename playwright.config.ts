import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';


///////////////
// VARIABLES //
///////////////

const environment = process.env.ENV || 'production';

// Define shared options once
// Were originally in the defineConfig > use block but some were getting overwritten by the device defaults in the projects block
const globalOptions = {
  baseURL: process.env.BASE_URL, // Base URL to use in actions like "await page.goto()"
  screenshot: 'only-on-failure' as const,
  trace: 'retain-on-failure' as const, // record throughout test and keep if test fails, else auto-delete upon test completion
  video: 'retain-on-failure' as const,
  launchOptions: {
    slowMo: 500, // Delays every browser action by X ms to mimic human behavior
  },
};

////////////////////////
// LOAD ENV FILE DATA //
////////////////////////

// verify that the ENV variable was passed
if (!environment) {
  throw new Error("ERROR: The ENV environment variable is not set.");
}

// construct the path for the decrypted .env file
const envFilePath = path.resolve(__dirname, `.env.${environment}`);

// if the file does not exist, end the run
if (!fs.existsSync(envFilePath)) {
  throw new Error(`ERROR: Environment file not found at expected path: "${envFilePath}". Ensure decryption step completed successfully.`);
}

// load the file
dotenv.config({ path: envFilePath });


///////////////////////////////
// DEFAULT CONFIG PROPERTIES //
///////////////////////////////

/**
 * See https://playwright.dev/docs/test-configuration
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
  reporter: [
    ['html'],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'results.xml' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    // /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: process.env.BASE_URL,

    // /* Collect trace and screenshot */
    // trace: 'retain-on-failure', // record throughout test and keep if test fails, else auto-delete upon test completion
    // screenshot: 'only-on-failure', // only taken if test fails
    // video: 'retain-on-failure', // record throughout test and keep if test fails, else auto-delete upon test completion

    // // Delays every browser action by X ms to mimic human behavior
    // launchOptions: {
    //   slowMo: 500, 
    // },

  },


  /////////////////////
  // BROWSER CONFIGS //
  /////////////////////

  projects: [
    { // default chromium installation used by Github to run tests in the cloud
      name: 'Github Chrome (Chromium)',
      use: { 
        ...devices['Desktop Chrome'],
        ...globalOptions,
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['iPhone X'],
        defaultBrowserType: 'chromium', // do not delete or else Webkit will be used instead of Chromium engine
        ...globalOptions,
      }
    },
    { // actual Chrome browser on laptop, cannot be used when running tests in the cloud on Github
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        ...globalOptions,
      },
    },
    {
      name: 'API',
      // No 'use' block because browser not needed
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // can't load webkit on old OS (Ventura 13)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

}); // end defineConfig
