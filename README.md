## Overview:
This repository contains a custom full-scale Test Automation platform for Playwright UI and API tests.

The platform can run tests locally on a laptop for individual development work, or within Github Actions CI/CD in a pipeline or triggered manually using a Self-Hosted Runner with the test results being saved to a PostgreSQL database.

The saved test data is ultimately displayed on a custom Test Results Dashboard Page built with Next.js framework (see repo [here](https://github.com/davcwik/playwright-results-dashboard)).

## Technical Details:
- Test Automation Framework: Playwright (TypeScript)
- Browsers: Installed Chrome Desktop, Playwright Chrome Desktop, Installed Chrome Mobile Emulator, Playwright Chrome Mobile Emulator, and API mode (no browser)
- CI/CD: Github Actions using a Self-Hosted Runner
- Database: PostgreSQL

## Highlights:
- Test Website: Tests are executed against a WordPress test website hosted on a 3rd party Web Hosting platform. The site has typical WordPress features such as Login, Lost Password, different User Types, User Profile settings and creating/editing blog posts
- Test Coverage: Desktop UI, Mobile UI and API tests
- Code Structure: Page Object Model to keep code modular and easy to maintain
- Parallel Execution: Tests can be run in parallel either with a browser (UI tests) or without a browser (API tests)
- Test Filtering: Test runs can be configured by using system variables and tags such as: environment, browser and various custom Playwright test tags (ex. priority, feature, platform)
- Security: Only GnuPG encrypted versions of .env files with sensitive test data (ex. user credentials, configuration details) are saved in the repository. During Github cloud test executions the files are decrypted to obtain the data. The data is provided temporarily during the test run execution but destroyed upon test run completion (see Self-Hosted Runner notes below), and never appears in logs or test result reports.
- Deployment: Test runs can be launched manually or via various types of triggers using workflow scripts in Github Actions. Upon completion of any test run launched from Github Actions, a python script is triggered to save the test results to the database.
- Historical Data: The PostgreSQL database contains test run metadata, scenario results and failed step details (including error messages)

## Additional Notes

### Executing tests:
* Locally on laptop:
    * ENV=production npx playwright test --headed --grep "@platform-desktop.*@priority-critical" --project="Installed Desktop Chrome"
    * remove the "--headed" parameter to run tests as headless

* Via the Github cloud UI:
    * Activate the Self-Hosted Github Runner on the laptop
    * Go to Github cloud > Actions tab
    * Select one of the workflow script options
    * Launch the workflow via the "Run Workflow" button

Note: Workflows can also be configured to run in the pipeline from other Github actions, such as Creating Pull Requests

### Self-Hosted Github Test Runner:
Test runs that are triggered via workflow scripts in Github Actions will execute in a Self-Hosted Runner that is installed locally on my laptop. This allows the automated test requests to have a static IP (local Wifi) that can be whitelisted to avoid firewalls implemented by the Web Hosting Provider that protect the test website.

The Runner needs to be re-activated every time a workflow script is run, because each Runner instance is destroyed at the end of every test run (aka "ephemeral" mode). This is necessary as a security precaution to prevent sensitive test data leaks.

### AI Agent Skills:
A variety of Skills are included in this codebase:
* create-Jira-bug-ticket: creates a Jira bug ticket for each test failure in the Playwright results report
* run-all-desktop-tests: launches a test run locally on laptop for the applicable test cases (other options: mobile, API)
* update-playwright-dependencies: creates a new branch, updates dependencies to current version, fixes any broken code, runs Playwright tests to verify fixes and then creates a Github PR for human review

