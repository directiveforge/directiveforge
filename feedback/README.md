# Feedback Loop

> Record lessons learned after using the generator on a real project. This directory is the primary mechanism for improving the knowledge base and templates over time.

**Disposition convention (since v0.17.0):** at each release that answers feedback, a `DISPOSITIONS-vX.Y.Z.md` file maps EVERY Suggested-Changes row from the open friction reports to `SHIPPED` / `DEFERRED → home` / `REJECTED — reason` / `N/A — project-local`. Zero silently dropped rows is a release gate. Feedback files themselves stay immutable field evidence (same-day addenda only).

**Inbound public reports (since v0.20.0):** external operators file friction via the `/report-friction` command (plugin or generated workflow), which arrives here as a GitHub issue labeled `friction-report` using the `.github/ISSUE_TEMPLATE/friction-report.yml` issue form. At triage, each accepted issue is transcribed to `feedback/YYYY-MM-DD-gh<issue#>-<short-tag>.md` with the same five sections (Project Profile / What Worked Well / What Didn't Work / Missing Patterns / Suggested Changes) and enters the identical pipeline: every Suggested-Changes row is dispositioned `SHIPPED` / `DEFERRED` / `REJECTED` / `N-A` in the next `DISPOSITIONS-vX.Y.Z.md`, and the issue is closed with a link to its rows. The zero-silent-drops gate covers inbound reports exactly as it covers operator-authored ones.

## Why This Exists

The generator and templates are built from synthesized research (March 2026). Research is a starting point — production usage reveals what the research missed, what the templates get wrong, and what patterns actually work in the field.

Without a feedback loop, the kit degrades as codebases evolve, framework APIs change, and new patterns emerge.

## What to Record

After running the generator on a real project, create a file `feedback/YYYY-MM-DD-[project-slug].md` with:

### Required Sections

**1. Project Profile**
- Stack (frameworks, language, DB, deployment)
- Project size (lines of code, team size, age)
- Generator presets used (nextjs / fastapi / general-node / none)

**2. What Worked Well**
- Templates that needed zero or minimal edits
- Rules that AI assistants followed consistently
- Skills that were actually triggered and useful

**3. What Didn't Work**
- Templates that needed significant modification — and what changed
- Rules that AI assistants ignored or misapplied
- Skills that were confusing, triggered at wrong times, or lacked key information
- Validation checklist items that were hard to verify or gave false positives

**4. Missing Patterns**
- Conventions the generator didn't capture that you had to add manually
- File structures or commands the templates didn't account for
- Edge cases in the stack that aren't in the presets

**5. Suggested Changes**
- Specific text changes to templates (with file path and line)
- New placeholder variables needed
- New preset needed (specify the stack)
- KB sections that were outdated or wrong

## What NOT to Record

- General impressions without specifics ("it was pretty good")
- Issues that were already fixed in the next version
- Project-specific configuration that won't generalize

## Format Example

```markdown
# Feedback: 2026-04-15 — my-saas-app

## Project Profile
- Stack: Next.js 15, Prisma, PostgreSQL, Clerk, Tailwind, Vitest
- Size: 18K LOC, 3 devs, 14 months old
- Presets: nextjs

## What Worked Well
- base.mdc template was accurate after 3 placeholder fills
- AGENTS.md template structure matched what we needed; no structural changes
- deployment skill triggered correctly for "deploy to staging" requests
- Context7 MCP eliminated Next.js App Router API hallucinations almost entirely

## What Didn't Work
- frontend-react.mdc.template assumed Tailwind; project uses CSS Modules + Sass
  → needs {{STYLING_SYSTEM}} branch that handles non-Tailwind setups
- review-pr.md command lacked Clerk-specific auth checks
  → PR review agents missed missing auth middleware on 2 routes

## Missing Patterns
- No template guidance for Next.js Parallel Routes and Intercepting Routes
- No pitfall for Clerk + middleware.ts edge runtime restrictions

## Suggested Changes
- templates/cursor/rules/frontend-react.mdc.template line 18:
  Add conditional block for CSS Modules styling pattern
- generator/presets/nextjs.md:
  Add Clerk integration pitfalls section
```

## How Feedback Gets Incorporated

1. Collect 3+ feedback files covering the same issue
2. Update the relevant template or preset file
3. If the issue reveals a knowledge gap, update KB-01 or KB-02
4. Record the change in `CHANGELOG.md`
5. Delete incorporated feedback files (they're no longer needed after merging)

## Where Past Feedback Lives

Once a feedback file has been mined for general patterns and those patterns are merged into the kit, the original project-specific file moves to `case-studies/<project>/` to keep the main kit project-agnostic. See `case-studies/README.md` for the index of past worked examples.

This directory holds only current, unprocessed feedback awaiting incorporation.
