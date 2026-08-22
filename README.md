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

### Self-Hosted Github Test Runner:



Local Runner Requirements: To execute these tests, ensure Node.js and Playwright browsers are installed locally, as the ephemeral runner uses the host machine's environment.

### Copilot AI Agent Skills:



### Working with Python locally in an IDE
It is recommended that you install a python venv locally on your laptop in the project's root directory and activate it anytime you are working with a python script in the IDE. This will prevent error notifications (red squiggle underlines) in your python script files due to missing packages.

First time only:
1. Navigate to project root directory
2. Create a virtual environment: python3 -m venv .venv
3. Activate the virtual environment: source .venv/bin/activate
4. Install the dependencies from requirements.txt: pip install -r requirements.txt

Then whenever you work with python script files:  
1. Navigate to project root directory
2. Activate the venv: source .venv/bin/activate
3. When finished, deactivate the venv: deactivate
Note: If you are not working with any python script files in the IDE, no need to activate it.
