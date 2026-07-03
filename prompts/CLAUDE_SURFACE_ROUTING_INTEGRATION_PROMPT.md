# Claude Surface Routing — Per-Project Integration Prompt

*Path: `~/Projects/AI/prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md`*
*Surface: Cowork session opened at the target project root.*
*Prerequisite: DirectiveForge kit available at `{{KIT_PATH}}` (default `~/Projects/AI`). Target project has a `CLAUDE.md` at its root.*

---

## Purpose

This is the prompt you paste into a fresh Cowork session at any project's root to install Claude surface routing for that project. After it runs, the project has its own `.claude/rules/ai-workflow.md` (plus a Cursor mirror if applicable) that maps **the project's actual recurring tasks** to the right Claude surface (Chat / Cowork / Code). The kit-wide rubric, behavior spec, and prompt libraries do not need to be regenerated — they already exist at `{{KIT_PATH}}` and the per-project rule points back to them.

If you are the kit owner trying to *refresh* the kit-wide artifacts (capability matrix, decision rubric, behavior spec) against a newer Anthropic dossier, that is a different job — see `{{KIT_PATH}}/knowledge-base/CLAUDE-SURFACE-ROUTING.md` §5 Refresh cadence and dispatch a Chat Research mission against the dossier.

---

## How to use

1. Make sure the kit is reachable from this machine. Default path: `~/Projects/AI`. Substitute below if elsewhere.
2. Make sure the target project has a `CLAUDE.md`. If it does not, run `{{KIT_PATH}}/generator/PROJECT_SETUP_PROMPT.md` first.
3. Open Claude Cowork in the Desktop app and switch the working folder to the target project.
4. Paste the **Dispatch block** below verbatim into the Cowork chat. The agent will execute end-to-end.

---

## Dispatch block (copy-paste into Cowork)

```
You are integrating Claude surface routing into THIS project. The kit lives at {{KIT_PATH}} (substitute if your machine differs). Do NOT regenerate kit-wide artifacts; they already exist. Your output is project-specific.

== Identity ==

You are a senior AI workflow engineer. You have read the kit's surface-routing
knowledge and you map this project's recurring task patterns to the correct
Claude surface so that future agents in this repo never run the wrong task on
the wrong surface.

== Ground rules ==

1. No invention. Capability claims footnote {{KIT_PATH}}/knowledge-base/CLAUDE-SURFACE-ROUTING.md §section. If the kit is silent on a capability, flag it; do not extrapolate from training data.
2. Project-specific only. The kit-wide rubric, behavior spec, and prompt libraries are inputs, not outputs. Your job is the per-project `.claude/rules/ai-workflow.md` rule file plus optional pins.
3. Decidable + composable. Rules must trigger from task text alone (no interpretation), stack without conflict, and never reroute a task that IS a fit for the current surface.
4. Concise. Match the project's existing rule-file voice. If the project's other rules are short and imperative, this one is too. Hard ceiling: 60 lines for the rule file, 30 lines for the Cursor mirror frontmatter included.

== Reading order (hard cap: 5 files from the kit + 4 from the project) ==

From the kit (read FIRST, in this order):
1. {{KIT_PATH}}/knowledge-base/CLAUDE-SURFACE-ROUTING.md  (the rubric + capability matrix)
2. {{KIT_PATH}}/workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md  (the behavior + worked examples)
3. {{KIT_PATH}}/prompts/cowork-browser-operations.md  (templates the project can adapt)
4. {{KIT_PATH}}/prompts/chat-research-missions.md
5. {{KIT_PATH}}/prompts/code-handoff-prompts.md

From the target project (read SECOND):
6. ./CLAUDE.md  (project identity, stack, conventions, pitfalls)
7. ./.claude/rules/*.md  (already-locked rules — your new rule must compose with these)
8. ./package.json or equivalent manifest (stack confirmation)
9. ./.cursor/rules/  (does the project use Cursor? if yes, you must produce a `.mdc` mirror)

== Steps ==

Step 1 — Profile the project. From CLAUDE.md and the manifest, extract:
  - Primary stack (framework, runtime, DB, deploy target)
  - Recurring task patterns (deploy audits, perf hunts, content sweeps, finance recon, etc.)
  - External dashboards the team uses (deploy platform, analytics, payments, CMS, queue, etc.)
  - The locked rule files (`.claude/rules/*.md`) the new rule will reference

Step 2 — Map tasks to surfaces. For 6-10 of the project's most common recurring tasks, decide the correct surface using the kit's decision rubric (`CLAUDE-SURFACE-ROUTING.md` §3 Q1-Q5). Record the mapping as a small table inside the rule file. Each row: task pattern, target surface, one-sentence why, pointer to the matching template in the kit's prompt libraries.

Step 3 — Write `.claude/rules/ai-workflow.md`. Required sections (no more, no less):
  a. One-paragraph purpose statement referencing {{KIT_PATH}}/knowledge-base/CLAUDE-SURFACE-ROUTING.md as the authoritative rubric.
  b. Project task → surface table (6-10 rows).
  c. 3-5 "trigger phrase" examples per surface drawn from real recurring work in this project (in the operator's primary language if it is not English — match the project's CLAUDE.md voice).
  d. Refresh cadence reminder: "Re-run this integration when the kit's CLAUDE-SURFACE-ROUTING.md is refreshed (quarterly or on Anthropic release)."
  e. Footer with absolute paths back to the kit artifacts and to the case study at {{KIT_PATH}}/case-studies/ if a similar-stack project is documented there.

Step 4 — If `.cursor/rules/` exists in the project, write a mirror at `.cursor/rules/ai-workflow.mdc`. Same content; add the `.mdc` frontmatter pattern used by other rules in that directory (do not invent — read a sibling `.mdc` to learn the convention).

Step 5 — Offer (do NOT auto-apply) a global pin block for `~/.claude/CLAUDE.md`. Produce it as a markdown code fence the user copy-pastes. 20-25 lines: 3-bullet surface distillation, 4-question decision rubric (abbreviated from the kit's §3), cross-reference paths. This is one-time per machine, not per project.

Step 6 — Verify. Run grep on the produced rule file for: the project's stack names (should appear), the kit path (should appear once or twice), names of other projects (should not appear). If the grep surfaces another project, stop and report — the integration leaked context.

== Out of scope (strict) ==

- Do not modify the kit's own files. Read only.
- Do not write project-specific content into the kit. Project-specific lessons go into the project's own `.claude/rules/` or into a `case-studies/<this-project>/` entry under the kit if the kit owner has asked for it explicitly.
- Do not invent new surface capabilities. Capability matrix is fixed by the kit's CLAUDE-SURFACE-ROUTING.md.
- Do not generate end-user-facing copy in any language (the rule file is agent-facing only).

== Deliverables ==

1. `./.claude/rules/ai-workflow.md` (≤60 lines)
2. `./.cursor/rules/ai-workflow.mdc` (only if `.cursor/rules/` already exists in the project)
3. A `## Claude Surface Routing` code-fenced block for the user to paste into `~/.claude/CLAUDE.md` (do not edit that file directly)
4. A 10-line summary in chat: what shipped, what the user needs to paste manually, refresh cadence reminder

== Success criteria ==

- [ ] Rule file ≤60 lines, references kit by absolute path, no other-project leakage
- [ ] Task→surface table has 6-10 rows, every row cites a kit §section or template
- [ ] Cursor mirror produced if and only if `.cursor/rules/` exists; matches sibling frontmatter convention
- [ ] Global pin produced as a paste block, not as a direct file edit
- [ ] Summary distinguishes auto-shipped artifacts from user-paste artifacts
```

---

## What you get

After the prompt runs, the project has one new rule file (plus optionally a Cursor mirror), the user has a global pin to paste once per machine, and the project's future Claude sessions (in any surface) know how to reroute. The kit-wide rubric and behavior spec are unchanged — the new rule file references them by absolute path.

## When to re-run

- The kit's `CLAUDE-SURFACE-ROUTING.md` gets a fresh refresh (cadence: quarterly per the kit, or on an Anthropic surface-feature release).
- The project's task surface changes materially — new deploy platform, new dashboard, new ops cadence.
- A reroute fails in practice — agent picked the wrong surface for a real task twice in a row.

## Worked example

For a fully-instantiated run on a production e-commerce project stack (Next.js + Medusa + Sanity + Stripe + Vercel + Railway + Resend), see `../the private lab's worked instance (not shipped)`. The case-study version shows the dispatch prompt fully filled with one project's specific task patterns and trigger phrases.

## Sibling templates

- `chat-research-missions.md` — research mission template (Chat Research surface)
- `cowork-browser-operations.md` — dashboard/browser ops template (Cowork)
- `code-handoff-prompts.md` — code-change handoff template (Code)
