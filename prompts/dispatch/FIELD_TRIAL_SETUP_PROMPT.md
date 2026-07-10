# DirectiveForge — Real-Project Field Trial & Stress Test

> **How to use.** Open **Claude Code** at the **root of the target project** (a real repo, on a machine where
> DirectiveForge is NOT installed) and paste this whole message. The agent will set DirectiveForge up
> end-to-end for this project **and** produce a strong, honest, sanitized field report. Then send that report
> back to the person who gave you this prompt — it's the real-world signal the kit needs.

---

You are running a **real-world field trial and stress test** of DirectiveForge on a codebase and a machine it
has never seen. You have two jobs, equally important:

1. **Set it up end-to-end** for this project, exactly the way a brand-new user would.
2. **Come back with a strong, honest, sanitized field report** — every friction point, every rough edge, and
   a straight verdict on whether it actually helped *this real project*.

DirectiveForge's whole identity is **"measured, not claimed"** — it publishes its own failures. So your report
is most valuable when it's *critical*. Weak spots, confusion, and breakage are the deliverable, not a failure
of the run. Do not flatter the tool.

---

## HARD RULES — read before doing anything (this is someone else's machine and a real, private project)

1. **Non-destructive & reversible.** First action after preflight: create a branch `df-field-trial` and do all
   work there. Never modify a tracked file without showing the diff and getting an explicit OK. Back up any
   pre-existing file before it's changed. **Never delete files. Never `git push`. Never commit to `main`.**
2. **Never touch secrets.** Do not read, move, print, or include `.env*`, credentials, tokens, keys, or private
   config in anything — especially not the report.
3. **Consent gates.** Pause and confirm with the operator (the person running this) at three points: before
   installing, before the generator writes any file, and before finishing. Explain what's about to happen.
4. **Record, don't hide.** Log **every** friction point — errors, confusing steps, missing instructions, wrong
   output — exactly as a new user hits them. **Do NOT silently work around a defect.** If you must work around
   something to continue, first record the defect, then note the workaround. A hidden workaround defeats the
   entire purpose of this trial.
5. **Follow the DOCUMENTED flow like a real new user.** Do not use insider tricks to smooth the path. If the
   docs are unclear or a step fails, that IS the finding. You're testing the real onboarding, not proving it
   can be made to work by an expert.
6. **Sanitize the report ruthlessly.** The project is private. In the final report: describe the project only as
   a *bucket* ("a ~15k-LOC TypeScript/Next.js API", never its name); include no secrets; quote proprietary code
   only as the minimal snippet needed to evidence a specific defect; redact person/company/client names and
   absolute private paths. When in doubt, leave it out.

---

## PHASE 0 — Preflight & baseline (capture everything)

- Confirm you are at the project root. If not, stop and ask.
- Start a running log file `DF-FIELD-LOG.md` in a scratch location (not committed) — timestamp each step and
  each friction point as you go.
- Capture the baseline (these are stress-test data, sanitized): OS + arch; **`claude --version`** (the CLI
  version matters — the plugin was validated on an older CLI, so version skew is a thing to watch); a bucketed
  description of the project (language(s), framework, rough LOC, has-tests?, monorepo?); and `git status`
  (must be clean — if not, note it and stop for the operator's decision).
- Create the branch: `git checkout -b df-field-trial`.

## PHASE 1 — Install DirectiveForge (as a brand-new user)

Run the **documented** install (run the `claude plugin …` commands yourself via the shell if you can; otherwise
print them and ask the operator to run them, then paste the output back):

```
claude plugin marketplace add directiveforge/directiveforge
claude plugin install directiveforge
claude plugin validate --strict
claude plugin list
```

Record, precisely: did the marketplace add succeed? did install succeed? **any CLI-version mismatch or
validate warnings/errors** (quote them verbatim)? does `claude plugin list` show `directiveforge` enabled? Did
the `/directiveforge:report-friction` command become available, or does it need a **session restart** to load
(note that as a UX finding)?

**Fallback (only if the public install fails — and record WHY it was needed):** clone the repo and install from
the local path per the kit's `QUICK_START.md` local-path variant. Treat needing the fallback as a significant
finding.

## PHASE 2 — Fetch the generator

The generator is a prompt that references the kit's presets and templates, so get the whole kit:

```
git clone --depth 1 https://github.com/directiveforge/directiveforge /tmp/df-kit
```

Confirm `/tmp/df-kit/generator/PROJECT_SETUP_PROMPT.md` exists. Record any access problem (private repo? 404?
auth prompt?) — each is a finding for a first-time user.

## PHASE 3 — Run the generator END-TO-END (test the REAL generator — do not improvise)

Read `/tmp/df-kit/generator/PROJECT_SETUP_PROMPT.md` and **execute it verbatim** against this project, following
its own phases (codebase inventory → stack detection → the short profile questions → generation), using
`/tmp/df-kit` as the kit path. **Do not substitute your own idea of a good setup** — the point is to test what
the real generator produces.

While running it, record:
- The **profile questions** it asks (verbatim) and whether they were clear and answerable for this project. Put
  the operator's (sanitized) answers in the log. Confusing or unanswerable questions are prime findings.
- Every file it proposes to write — show the diff, get the OK, back up any pre-existing file it modifies (the
  generator should ask before writing; if it tries to write without asking, that's a finding).
- A first-look correctness note per generated file (`CLAUDE.md`, `.claude/rules/*`, commands, agents, MCP
  config, `AGENTS.md`, etc.): does it fit **this** codebase, or did it assume the wrong stack, invent commands
  that don't exist here, reference phantom paths/routes, or state something that contradicts the real repo?

## PHASE 4 — Verify (run the kit's own checklist, then the harder test)

- Run `/tmp/df-kit/generator/VALIDATION_CHECKLIST.md` against the generated output; record pass/fail per section
  (INDETERMINATE counts as fail — note it).
- Then the test the synthetic harness **cannot** do — real usefulness: pick 3–5 generated rules/commands and
  judge honestly whether they are **correct and useful for this actual project**, or generic/wrong/misleading.
  Would they help or hinder an agent working in this repo tomorrow?

## PHASE 5 — The field report (the main deliverable)

Write `DIRECTIVEFORGE-FIELD-REPORT.md` (sanitized, in a scratch location the operator can send). Structure:

- **Environment:** OS, `claude` CLI version, project bucket (stack/size/shape) — no names.
- **Run summary:** timeline, rough token/time cost, what installed, what generated.
- **Install findings / Generation findings / Verification findings** — narrative, honest.
- **Defect table** — one row per issue: `{ step or file:line | expected | actual | severity: blocker/major/minor
  | class }`. If the kit's friction-report form / feedback taxonomy is visible in `/tmp/df-kit`, tag each defect
  with its class; otherwise use a short plain class.
- **Accuracy / hallucination check (highest-value section):** anything the generator wrote that contradicts the
  real repo — wrong commands, phantom routes, false claims, mis-detected stack. This is exactly what synthetic
  fixtures can't catch, so be thorough.
- **The honest verdict:** Did DirectiveForge actually improve this project's AI-workflow setup? Would the
  operator **keep** the generated files, or revert them? What's missing or wrong for a *real* (non-synthetic)
  codebase? Then a ranked **Top-5 frictions** and **Top-5 wins**.
- **Sanitization statement:** confirm no secrets, no proprietary code beyond minimal defect evidence, no
  names/private paths.

**Optional formalization:** if `/directiveforge:report-friction` is available, run it on the top defects to push
them through DirectiveForge's own pipeline — but **STOP at its review gate and submit nothing** without the
operator's explicit approval.

## FINISH — hand back, don't ship

Leave the generated files on the `df-field-trial` branch (the operator decides keep / merge / discard). **Do not
push. Do not merge. Do not submit any friction report** without explicit consent. Give the operator: the report
path, the log path, and a 5-line spoken summary — biggest win, biggest breakage, and the one-word answer to
"would you keep it?"

> **Operator:** send the sanitized `DIRECTIVEFORGE-FIELD-REPORT.md` back to whoever gave you this prompt. That
> report — a real project, a fresh machine, a new user, warts and all — is the exact signal DirectiveForge
> can't get from its synthetic tests.

---

**Begin with Phase 0. Follow the documented flow, record every rough edge honestly, protect the project, and
report the truth.**
