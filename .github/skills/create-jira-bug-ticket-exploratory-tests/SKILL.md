---
name: create-jira-bug-ticket-exploratory-tests
description: 'Create Jira Bug tickets in Atlassian from failures documented in exploratory UI test results. Use when asked to file an exploratory test failure as a Jira bug or create Jira tickets from exploratory testing results.'
argument-hint: 'Optional exploratory test number or ticket creation scope'
user-invocable: true
disable-model-invocation: false
---

# Create Jira Bug Tickets From Exploratory Tests

Create and verify one Jira Bug ticket for each failed exploratory UI test in the supplied test results. When a specific test number is requested, create a ticket only for that test.

## Procedure

1. Use the most recent exploratory UI test results provided in the conversation or by the user as the source of truth. Do not infer failures from automated test artifacts or other test runs.
2. Identify the requested failed exploratory test. For every selected failed test, collect:
   - The test number and title.
   - The executed steps in their original order.
   - The observed failure or current result.
   - The expected result, if documented.
   - The page URL, browser/device context, and environment, when documented.
  - Whether the test covers accessibility. Clearly label accessibility-related tests as `Accessibility test` in the results and ticket details.
   - Any screenshot explicitly associated with the exploratory test. Attach screenshots only; do not attach unrelated files.
3. If the exploratory results do not clearly identify the selected test, its failure, its executed steps, or its expected result, stop and ask for the missing detail before contacting Jira.
4. Read `.env.production` for `JIRA_HOST`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY`. Never print, log, commit, or include the API token or other secrets in output. If required configuration is missing, stop and report the missing variable names.
5. Authenticate against Jira Cloud using HTTPS and the Jira REST API. If `JIRA_HOST` does not include a scheme, use `https://$JIRA_HOST`.
6. Resolve the Jira account for the assignee named `David Cwik`. Use the returned `accountId` in the issue payload. If the account cannot be found or is not assignable, stop and ask for clarification.
7. Create one issue per selected failed exploratory test with these fields:
   - Work Type / issue type: `Bug`
   - Project: `JIRA_PROJECT_KEY`
   - Summary: a short human-readable sentence describing the observed exploratory failure.
   - Assignee: `David Cwik`
  - Environment: `Production` by default; use another value only when the prompt explicitly instructs you to do so.
   - Browser: the documented browser/device context, or `Not documented` when absent.
   - Description: use separate lines in this order:
     ```text
     Details: <observed exploratory failure>

   Affected Page: <tested URL>

     Browser: <browser/device context or Not documented>

    Environment: Production

    Test Type: <Accessibility test or UI test>

     Steps to Reproduce:
     1. <executed step>
     2. <executed step>
     ...

     Current Result: <observed failure or current result>

     Expected Result: <documented expected result>
     ```
  Use `Not documented` only for optional context that is absent. Do not invent steps, expected behavior, browser, or failure details. Use `Production` for Environment unless the prompt explicitly instructs another value.
8. Before creating an issue, check for an obvious duplicate in the target Jira project using the summary and failure context. Do not create a duplicate if a matching issue already exists; report the existing issue link instead.
9. After issue creation, upload the associated exploratory-test screenshot, when present, through Jira's issue attachment endpoint. Do not expose attachment contents or credentials in logs.
10. Verify each issue with a Jira GET request. Confirm the issue key, summary, issue type `Bug`, assignee `David Cwik`, and screenshot attachment filename when applicable.
11. Return one clickable Jira browse URL per created or already-existing issue, for example `https://<jira-host>/browse/PLAY-12`. Report any authentication, validation, attachment, or verification failure clearly.

## Requirements

- Stop and ask for clarification if the exploratory test number, failure details, executed steps, expected result, Jira project, assignee, or attachment mapping is ambiguous.
- Do not modify application source files or exploratory test evidence while filing tickets.
- Clearly label any test covering keyboard navigation, focus management, skip links, screen-reader behavior, semantic structure, or another accessibility feature as `Accessibility test`.
- Do not claim a ticket was created until Jira returns an issue key and a follow-up verification succeeds.
- Keep unrelated worktree changes intact.
- Use the Jira REST API or an available Jira integration; do not place secrets in source files or shell history where avoidable.
- Do not use unrelated automated-test artifacts as the source of exploratory failure details.
