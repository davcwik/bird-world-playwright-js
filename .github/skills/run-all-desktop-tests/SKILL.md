---
name: run-all-desktop-tests
description: 'Run all desktop Playwright tests in headed Installed Desktop Chrome mode. Use when asked to execute the platform-desktop test suite or run all desktop tests.'
argument-hint: 'Optional Playwright test filters'
user-invocable: true
disable-model-invocation: false
---

# Run All Desktop Tests

Run the complete desktop Playwright test suite in headed mode with the locally installed Chrome browser.

## Procedure

1. Execute:
   `ENV=production npx playwright test --headed --grep "@platform-desktop" --project="Installed Desktop Chrome"`
2. Report the test summary, failures, and any generated report URL.

## Requirements

- Run the command from the repository root.
- Do not stop the HTML report server unless explicitly requested.
- Report command or test failures clearly.
