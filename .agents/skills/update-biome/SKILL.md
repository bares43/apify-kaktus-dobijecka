---
name: update-biome
description: >
  Updates the Biome linter/formatter to a new version and ensures all code passes the updated rules.
  Use this skill whenever the user asks to update Biome, upgrade the Biome linter, bump the Biome version,
  or fix linting errors after a Biome upgrade. Also trigger when the user says something like "update the
  linter", "upgrade biome", or "biome is showing new errors after update". The skill handles the full
  update cycle: package upgrade, config sync, auto-fixing, manual fixing, and test verification — all
  without ever disabling lint rules.
---

# Update Biome Linter

Your job is to update the Biome linter to its latest version and make sure the codebase fully passes
the updated rules — formatter, linter, and tests — without disabling or suppressing any rules.

## Step 1: Check whether an update is needed

First, find the version currently specified in `package.json` (strip any range prefix like `^` or `~`),
then fetch the latest published version from the npm registry:

```bash
node -e "console.log(require('./package.json').devDependencies['@biomejs/biome'] || require('./package.json').dependencies['@biomejs/biome'])"
npm view @biomejs/biome version
```

Compare the two. If they already match (accounting for range prefixes), tell the user Biome is already
up to date and stop — there's nothing to do.

If the latest version is newer, continue with the steps below.

## Step 2: Install the new version

Install the exact latest version (no range prefix — pin it precisely so the project stays reproducible):

```bash
npm install @biomejs/biome@<latest-version>
```

Then update `package.json` so the version entry reflects the pinned version, e.g. `"2.5.0"` not
`"^2.5.0"` — match whatever pinning style was already used in the file for this package.

## Step 3: Sync biome.json schema

Open `biome.json` (or `biome.jsonc`) and update the `$schema` field to match the newly installed version.
The schema URL follows the pattern:

```
https://biomejs.dev/schemas/{version}/schema.json
```

For example, if the installed version is `2.5.0`, set:

```json
"$schema": "https://biomejs.dev/schemas/2.5.0/schema.json"
```

This keeps the editor integration and validation in sync with the installed binary.

## Step 4: Auto-fix what Biome can handle

Run the auto-fixer first — this handles formatting and many lint issues in one pass:

```bash
npm run lint:fix
```

(If the project uses a different fix command, look in `package.json` scripts for the equivalent — usually
`biome check --write .` or similar.)

## Step 5: Check what's left

Run the linter to see all remaining issues:

```bash
npm run lint
```

Read every error and warning. Group them by type so you can tackle them systematically.

## Step 6: Fix all remaining issues manually

Work through the issues file by file. The most important constraint: **never disable a rule or add a
suppression comment** (`// biome-ignore`). The goal is clean code that genuinely satisfies the rules.

Common patterns and how to fix them properly:

- **`noUnusedVariables`** — remove the variable, or use it if the omission was a bug
- **`noConsole`** — replace with a proper logger, or remove the debug statement entirely
- **`useConst`** — change `let` to `const` where the variable is never reassigned
- **`noExplicitAny`** — add a proper type or narrow the type appropriately
- **Formatting issues** — re-run `npm run lint:fix`; if still failing, fix the code structure causing the issue

If a new rule flags something that's clearly intentional design (e.g., a deliberate pattern the codebase
uses consistently), don't suppress it — refactor to satisfy the rule's intent.

After fixing a batch of issues, re-run `npm run lint` to confirm progress and catch any new issues the
fixes may have introduced.

## Step 7: Verify tests still pass

Once the linter is clean, run the test suite:

```bash
npm run test
```

If tests fail, investigate — lint fixes sometimes reveal bugs (unused variables that were accidentally
shadowing something, etc.). Fix root causes, not symptoms.

## Step 8: Final check

Run the linter one more time to confirm zero issues:

```bash
npm run lint
```

The output should show no errors or warnings. If it does, go back and fix them.

## When to ask the user for help

Work independently through the full cycle. Only pause and ask the user if:

- A rule flags a pattern that requires a design decision you can't make confidently (e.g., a new
  security rule that would require restructuring an API)
- A test failure is in an area where you don't have enough context to safely fix it
- There's a conflict where satisfying one rule seems to break another and no clean solution is obvious

In those cases, describe exactly what you found and what options you see, so the user can make an
informed call.

## Done

When both `npm run lint` and `npm run test` pass cleanly with zero issues, the update is complete.
Summarize what version you updated from and to, how many issues were fixed, and what kinds of changes
were made.
