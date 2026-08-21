## Overview:
This repository contains a custom Test Automation framework for Playwright UI and API tests.

The framework can run tests locally on a laptop for individual development work, or within a Github Actions CI/CD pipeline in a Self-Hosted Runner with the test results being saved to a PostgreSQL database.

The saved test data is ultimately displayed on a custom Test Results Dashboard Page built with Next.js framework (see repo [here](https://github.com/davcwik/playwright-results-dashboard)).

## Technical Details:
Automation: Playwright
Browsers: Installed Chrome Desktop, Playwright Chrome Desktop, Installed Chrome Mobile Emulator, Playwright Chrome Mobile Emulator, and API mode (no browser)
Build Tools: Maven
CI/CD: Github Actions
Database: PostgreSQL

## Highlights:


Local Runner Requirements: To execute these tests, ensure Node.js and Playwright browsers are installed locally, as the ephemeral runner uses the host machine's environment.

Although the python script for parse and save to db will only run for test runs launched from Github Actions, it is recommended that you install a python venv locally on your laptop in the project's root directory and activate it anytime you are working with a python script in the IDE. This will prevent error notifications (red squiggle underlines) in your python script files due to missing packages.

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
