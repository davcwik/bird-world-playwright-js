## Overview:
This repository contains a custom full-scale Test Automation platform for Playwright UI and API tests.

The platform can run tests locally on a laptop for individual development work, or within a Github Actions CI/CD pipeline using a Self-Hosted Runner with the test results being saved to a PostgreSQL database.

The saved test data is ultimately displayed on a custom Test Results Dashboard Page built with Next.js framework (see repo [here](https://github.com/davcwik/playwright-results-dashboard)).

## Technical Details:
- Test Automation Framework: Playwright (TypeScript)
- Browsers: Installed Chrome Desktop, Playwright Chrome Desktop, Installed Chrome Mobile Emulator, Playwright Chrome Mobile Emulator, and API mode (no browser)
- CI/CD: Github Actions using a Self-Hosted Runner
- Database: PostgreSQL

## Highlights:
- Test Coverage: Desktop UI, Mobile UI and API tests
- Code Structure: Page Object Model to keep code modular and easy to maintain
- Parallel Execution: tests can be run in parallel either with a browser (UI tests) or without a browser (API tests)
- Test Filtering: test runs can be configured by using system variables and tags such as: environment, browser and various custom Playwright test tags (ex. priority, feature, platform)
- Security: no files with sensitive data (ex. user credentials, configuration details) are saved in the repository without being encrypted. During remote test executions the files are decrypted to obtain the data. The data is provided temporarily during the test run execution but destroyed upon test run completion (see Self-Hosted Runner notes below), and never appears in logs or test result reports.
- Deployment: Test runs can be launched manually or via various types of triggers using workflow scripts in Github Actions. Upon completion of the test run, a python script is triggered to save the test results to the database.
- Historical Data: the PostgreSQL database contains test run metadata, scenario results and failed step details (including error messages and screenshots)

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

Note: Workflows can also be confifured to run from other Github actions, such as Creating Pull Requests

### Self-Hosted Github Test Runner:
Test runs that are triggered via workflow scripts in Github Actions will execute in a Self-Hosted Runner that is installed locally on my laptop. This allows the automated test requests to have a static IP (local Wifi) that can be whitelisted to avoid firewalls.

The Runner needs to be re-activated every time a workflow script is run, because each Runner instance is destroyed at the end of every test run (aka "ephemeral" mode). This is necessary as a security precaution to prevent sensitive test data leaks.

### Copilot AI Agent Skills:



### Working with Python locally in an IDE
A python virtual environment (venv) has been installed locally on my laptop in the project's root directory. When working with any python script in the codebase, activating this venv will prevent IDE code error notifications in python files (ex. missing packages). It's not required to have this because currently the python scripts only execute for test runs launched from Github Cloud, but it's a good practice nonetheless.

First time only:
1. Navigate to project root directory in Terminal
2. Create a virtual environment: python3 -m venv .venv
3. Activate the virtual environment: source .venv/bin/activate
4. Install the dependencies from requirements.txt: pip install -r requirements.txt

Then whenever you work with python script files:  
1. Navigate to project root directory in Terminal
2. Activate the venv: source .venv/bin/activate
3. When finished, deactivate the venv: deactivate
