---
name: update-playwright-dependencies
description: 'Update and validate npm dependencies in a Playwright project. Use when asked to check package.json for outdated dependencies, create a date-stamped dependency update branch, run npm install, fix upgrade-related errors, execute desktop, mobile, and API Playwright tests, commit, push, and create a pull request.'
argument-hint: 'Optional dependency update scope or package constraints'
user-invocable: true
disable-model-invocation: false
---

# Update Playwright Dependencies

Use this workflow for dependency maintenance in the Playwright project.

## Procedure

1. Inspect the repository state with `git status --short --branch`, inspect `package.json`, and confirm the configured Git remote.
2. Determine today's date in `MMDDYY` format. Create and switch to a new branch from the current `main` branch named `chore/MMDDYY_dependency_updates`.
3. Analyze `package.json` for outdated dependencies with `npm outdated`.
4. If no dependency upgrades are available, stop immediately and report exactly: `No dependency upgrades are needed at this time.` Do not run the remaining steps.
5. If upgrades are available, update the outdated package versions in `package.json` while preserving the project's existing dependency conventions.
6. Run `npm install` and include the resulting lockfile changes.
7. Check for code and type errors in the codebase. Fix errors caused by the package upgrades, keeping unrelated changes out of scope.
8. Run each test command one at a time. Wait for each command to finish and verify that failures are not caused by the dependency upgrades:
   - `ENV=production npx playwright test --headed --grep "@platform-desktop" --project="Installed Desktop Chrome"`
   - `ENV=production npx playwright test --headed --grep "@platform-mobile" --project="Installed Mobile Chrome"`
   - `ENV=production npx playwright test --headed --grep "@platform-api" --project="API"`
9. Review the final diff and repository status. Commit the dependency updates and any required upgrade fixes with a concise message.
10. Push the branch to the configured cloud repository.
11. Create a pull request from the update branch into `main`, including a concise summary of dependency changes and test results.

## Requirements

- Do not commit, push, or create a pull request when `npm outdated` finds no upgrades.
- Run the three test commands sequentially, never as a combined or parallel command.
- Do not revert unrelated user changes in a dirty worktree.
- Report any command, test, authentication, or pull request failure clearly instead of claiming completion.
