---
name: create-Jira-bug-ticket
description: 'Create Jira Bug tickets in Atlassian from each failure in the most recent Playwright test run report. Use when asked to file Playwright failures as Jira bugs, create Jira tickets from test results, or report automated test failures to Jira.'
argument-hint: 'Optional Playwright report path or ticket creation scope'
user-invocable: true
disable-model-invocation: false
---

# Create Jira Bug Tickets

Create and verify one Jira Bug ticket for each failed test case in the most recent Playwright test run report.

## Procedure

1. From the repository root, identify the most recent Playwright report. Prefer `results.json` and use its `stats.startTime` and failed test results; use `results.xml` and `test-results/` to confirm attachments and failure context.
2. For every failed test case, collect:
   - The exact error message from the Playwright report, with terminal color escape sequences removed only for readability.
   - The `projectName` value from the failed result. This is the Browser value.
   - Every Playwright step title in execution order, including nested step titles.
   - The failing step and its failure error.
   - Any screenshot attachment path for the failed result. Attach screenshots only; do not attach video, trace, or error-context files unless explicitly requested.
3. Read `.env.production` for `JIRA_HOST`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY`. Never print, log, commit, or include the API token or other secrets in output. If required configuration is missing, stop and report the missing variable names.
4. Authenticate against Jira Cloud using HTTPS and the Jira REST API. If `JIRA_HOST` does not include a scheme, use `https://$JIRA_HOST`.
5. Resolve the Jira account for the assignee named `David Cwik`. Use the returned `accountId` in the issue payload. If the account cannot be found or is not assignable, stop and ask for clarification.
6. Create one issue per failed test with these fields:
   - Work Type / issue type: `Bug`
   - Project: `JIRA_PROJECT_KEY`
   - Summary: a short human-readable sentence describing the failure. If the failure cannot be summarized reliably, use the report error message.
   - Assignee: `David Cwik`
   - Environment: `Production`
   - Browser: the failed result's `projectName`
   - Description: use separate lines in this order:
     ```text
     Details: <exact Playwright error message>
     Browser: <projectName>
     Environment: Production
     Steps to Reproduce:
     1. <step title>
     2. <step title>
     ...
     Current Result: <human-readable observed failure result>
     Expected Result: <correct outcome required for the test to pass>
     ```
     Place `Current Result:` immediately after the failing step title and then place `Expected Result:` on the next line. Use the exact report error in `Details:` and preserve locator text where useful.
7. Before creating an issue, check for an obvious duplicate in the target Jira project using the summary and failure context. Do not create a duplicate if a matching issue already exists; report the existing issue link instead.
8. After issue creation, upload the failed test screenshot, when present, through Jira's issue attachment endpoint. Do not expose attachment contents or credentials in logs.
9. Verify each issue with a Jira GET request. Confirm the issue key, summary, issue type `Bug`, assignee `David Cwik`, and screenshot attachment filename when applicable.
10. Return one clickable Jira browse URL per created or already-existing issue, for example `https://<jira-host>/browse/PLAY-12`. Report any authentication, validation, attachment, or verification failure clearly.

## Requirements

- Stop and ask for clarification if the latest report, failed test details, expected result, Jira project, assignee, or attachment mapping is ambiguous.
- Do not modify the Playwright tests or report artifacts while filing tickets.
- Do not claim a ticket was created until Jira returns an issue key and a follow-up verification succeeds.
- Keep unrelated worktree changes intact.
- Use the Jira REST API or an available Jira integration; do not place secrets in source files or shell history where avoidable.
