---
description: Turn friction with the AI-workflow kit into a sanitized, submittable GitHub issue — harvest defects, redact anything project-identifying, gate on user review, then file it against directiveforge/directiveforge.
---

# Report Friction

Capture where the kit fought you — a wrong template line, a rule the agent ignored, a skill that misfired, a checklist item that gave a false positive — and turn it into a clean, non-identifying issue that lands against `directiveforge/directiveforge`. It enters the same disposition pipeline as operator-authored feedback: every Suggested-Changes row is answered in the next release, zero silent drops.

This command is READ-ONLY on the project and never sends anything without an explicit "submit" from the user.

## When to Run

- A kit template, rule, skill, command, or checklist item did the wrong thing and you want it fixed upstream
- Right after finishing a task where the workflow got in your way
- End of a session where you patched around a generated file instead of using it as-is

## Procedure

Work through the steps in order. Steps 3 and 5 are gates — do not skip them.

### Step 0 — Context harvest

Read `.ai-kit-manifest.json` at the project root if present, and record: `kit_version`, `presets`, `packs`, `maturity_tier`, `ide_scope`. If it is absent, note "manifest absent — plugin-only install" and use the plugin version **0.20.0** as the kit version. These values populate the Project Profile and the issue title; nothing here is user-identifying on its own.

### Step 1 — Defect loop

Repeat until the user says they are done. For each defect, collect:

- **Artifact** — repo-RELATIVE path + line (e.g. `.claude/rules/base.md:18`). Never an absolute path.
- **Expected vs actual** — BOTH are mandatory. What the kit should have produced/done, and what it actually produced/did.
- **Trigger** — what surfaced it: a prompt, a skill, a command, or a workflow phase.
- **Severity** — one of BLOCKER / HIGH / MEDIUM / LOW.
- **Suggested change** (optional) — a concrete `file:line` plus the proposed replacement text.

### Step 2 — Non-identifying project profile

Collect the project shape in BUCKETS ONLY — never names, never URLs:

- **Stack** (frameworks / language / DB)
- **Size** — `<10k` / `10-100k` / `>100k` LOC
- **Team** — `1` / `2-5` / `6+`
- **Age** — `<6mo` / `6-24mo` / `>24mo`
- **Presets / tier / surface** — from Step 0

### Step 3 — Mechanical sanitization pass (GATE, before rendering)

Run this pass over everything collected BEFORE assembling the output:

1. Replace every absolute path with its repo-relative form.
2. Replace `unitkit` and the repo directory name with `<project>` everywhere they appear.
3. Strip git remotes, internal URLs, email addresses, `git config` `user.name` / `user.email`, and `$USER`.

Then RE-SCAN the assembled draft for residual hits (leftover absolute paths, the project name, emails, remotes) and build a **redaction list** enumerating exactly what was redacted. If the re-scan finds anything, redact it and note it too.

### Step 4 — Render in the feedback taxonomy

Assemble the output in EXACTLY these five sections, in this order:

1. **Project Profile** — the buckets from Step 2.
2. **What Worked Well** — templates/rules/skills that needed zero or minimal edits.
3. **What Didn't Work** — each defect as a `file:line — expected vs actual` row (from the Step 1 loop).
4. **Missing Patterns** — conventions the kit did not capture that you had to add by hand.
5. **Suggested Changes** — the concrete `file:line` + proposed-text rows from Step 1.

Defects land in **What Didn't Work** (the observation) AND **Suggested Changes** (the fix), both keyed by `file:line`.

### Step 5 — User review gate (GATE)

Print the FULL assembled output plus the Step 3 redaction list. Tell the user they may edit any part. Require an explicit **"submit"** to proceed. If the user aborts, offer to save it to `./friction-report-YYYY-MM-DD.md` (using today's date) and send NOTHING.

### Step 6 — Submit

Preferred path — file the issue with the GitHub CLI:

```bash
gh issue create \
  --repo directiveforge/directiveforge \
  --title "Friction: <one-line summary> (kit vX.Y.Z)" \
  --label friction-report \
  --body-file <tmp-file-with-the-rendered-body>
```

Fallback (no `gh`, or the user prefers manual): print the rendered body and this URL for the user to paste into:

```
https://github.com/directiveforge/directiveforge/issues/new?template=friction-report.yml
```

### Step 7 — Confirm & close out

Print the created issue URL. Suggest the user keep the local copy until the release disposition lands: every Suggested-Changes row is answered `SHIPPED` / `DEFERRED` / `REJECTED` / `N-A` in the next `feedback/DISPOSITIONS-vX.Y.Z.md`, and the issue is closed with a link to its rows. Zero silent drops.

## Constraints

- READ-ONLY on the project; the only write is the optional local `friction-report-YYYY-MM-DD.md` on abort.
- Steps 3 and 5 are mandatory gates — never render before sanitizing, never submit before the user types "submit".
- Repo-relative paths only in the body. An absolute path in the output is a defect in THIS command.
- Expected AND actual are both required for every defect — a report with only "actual" is not actionable.
