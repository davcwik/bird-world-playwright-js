---
name: run-all-mobile-tests
description: 'Run all mobile Playwright tests in headed Installed Mobile Chrome mode. Use when asked to execute the platform-mobile test suite or run all mobile tests.'
argument-hint: 'Optional Playwright test filters'
user-invocable: true
disable-model-invocation: false
---

# Run All Mobile Tests

Run the complete mobile Playwright test suite in headed mode with the locally installed Chrome browser.

## Procedure

1. Execute:
   `ENV=production npx playwright test --headed --grep "@platform-mobile" --project="Installed Mobile Chrome"`
2. Report the test summary, failures, and any generated report URL.

## Requirements

- Run the command from the repository root.
- Do not stop the HTML report server unless explicitly requested.
- Report command or test failures clearly.
