---
name: run-all-api-tests
description: 'Run all API Playwright tests. Use when asked to execute the platform-api test suite or run all API tests.'
argument-hint: 'Optional Playwright test filters'
user-invocable: true
disable-model-invocation: false
---

# Run All API Tests

Run the complete API Playwright test suite.

## Procedure

1. Execute:
   `ENV=production npx playwright test --grep "@platform-api" --project="API"`
2. Report the test summary, failures, and any generated report URL.

## Requirements

- Run the command from the repository root.
- Do not stop the HTML report server unless explicitly requested.
- Report command or test failures clearly.
