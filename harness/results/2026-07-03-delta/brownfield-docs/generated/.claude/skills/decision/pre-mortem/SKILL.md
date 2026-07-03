---
name: pre-mortem
description: Run a Klein-Kahneman pre-mortem on a plan before it ships. Forces the agent to assert the plan failed and reverse-engineer the failure modes BEFORE evaluating its merits, so the sycophantic baseline never lands first. Fires on phrases like "I'm about to launch X", "is this plan solid", "imagine it already failed", "what could go wrong before we ship", "stress-test the plan". Pre-mortem is the highest-leverage anti-sycophancy move in the catalog. Kahneman called it his "single most valuable decision technique."
severity: BLOCKER
confidence: 0.95
surface: Chat-or-Code
---

# Pre-Mortem Skill

> **Trigger**: User brings a plan they are about to commit to (launch, ship, deploy, sign, hire, expand). The plan is owned by the user, the cost of being wrong is non-trivial, and the default agent response would be "great plan, three considerations to keep in mind…"

> **Tier note (this project = Intermediate).** `council-3-voice`, `10-10-10`, and `cost-of-inaction` are NOT installed here (Advanced-only). Wherever this skill says to route to one of them: at this tier, run `steelman` + `pre-mortem` sequentially in place of `council-3-voice` (for a Type-1 decision) and recommend a `governance/DECISIONS.md` entry; for the `10-10-10` / `cost-of-inaction` "should I do X eventually" route, handle it inline with a short now-vs-later framing. Installed siblings: `pre-mortem`, `steelman`, `confidence-calibration`, `reversibility-check`, `anti-sycophancy-meta`, `inversion`, `second-order-thinking`, `disconfirming-evidence-first`.

## What this skill produces

A ranked failure-narrative dossier that the user can act on: top failure modes, each tagged Tiger / Paper-Tiger / Elephant, with a top-3 mitigations table (owner + due date). Output is decision-grade, not affirmation-grade. The user leaves with a worked checklist of what to fix before committing, not a pat on the back.

## Before invoking — mandatory reads

1. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §4 (anti-sycophancy as meta-skill) and §7.1 (frame-reversal pattern).
2. `research/2026-05-26-decision-techniques.md` §2 row 1 (the canonical procedure) and §7 quote #4 (Anthropic's sycophancy definition).
3. The plan itself — restate it back to the user before generating failures. A pre-mortem on a vague plan produces generic doom.
4. If the user is on a Type-1 (irreversible) decision per `templates/skills/decision/reversibility-check/SKILL.md`, escalate to `council-3-voice` after this skill completes — pre-mortem alone is single-perspective.

## Procedure

1. **Restate plan, audience, success criteria, timeline.** Get the user to confirm the restatement is accurate before going further. A pre-mortem on a misunderstood plan is worse than no pre-mortem.
2. **Assert: "It is [date 6 months out]; the project failed."** Use the literal date. Vague "imagine it failed" framing degrades into hedging. The assertion is what flips the agent out of sycophantic mode.
3. **Generate 5-8 specific failure narratives** with chain-of-events + user-experience vignettes. Each narrative names a concrete trigger, a chain of consequences, and the moment the user realized it had gone wrong. Generic ("market conditions changed") fails this step; specific ("the third-largest customer churned in week 4 because the migration broke their SSO integration") passes.
4. **Tag each failure Tiger / Paper-Tiger / Elephant.** Tiger = real and chargeable to act on now. Paper-Tiger = looks scary, is actually unlikely or low-impact. Elephant = obvious in hindsight, currently being ignored by the team. The tags force prioritization.
5. **Verify each failure before flagging — two-pass.** First pass generates; second pass asks "is this failure mode actually plausible given the plan as restated in step 1?" The two-pass protocol prevents motivated-reasoning-toward-worst-case, which is the dominant pre-mortem failure mode (`parcadei-continuous-claude-v3-premortem` ships this verbatim).
6. **Output top-3 mitigations** with owner + due date. Mitigations without owners are aspirations; aspirations don't ship. Force the user to name a person (or themselves) for each.
7. **Recommend follow-up checks.** What second-order skill should fire after this? (`second-order-thinking`, `reversibility-check`, or `council-3-voice` if Type-1.) What re-verification cadence applies? When should the user re-run this pre-mortem?

## Output format

Markdown with three sections in this order:

```markdown
## Plan as restated
[1-3 sentence restatement, user-confirmed]

## Failure modes (ranked)
| # | Narrative | Tag | Chain of events | When you'd notice |
|---|-----------|-----|------------------|-------------------|
| 1 | [Specific failure] | Tiger | [3-step chain] | [Concrete signal] |
| 2 | [Specific failure] | Elephant | [3-step chain] | [Concrete signal] |
| 3 | [Specific failure] | Paper-Tiger | [3-step chain] | [Concrete signal] |
...

## Top-3 mitigations
| Mitigation | Owner | Due | Disconfirmer it addresses |
|------------|-------|-----|---------------------------|
| [Concrete action] | [Person] | [Date] | Failure #1 |
| [Concrete action] | [Person] | [Date] | Failure #2 |
| [Concrete action] | [Person] | [Date] | Failure #3 |

## Follow-up
- Next skill to run: [pre-mortem / reversibility-check / council-3-voice / etc.]
- Re-verification trigger: [event or date]
```

Worked example shape: a plan to migrate auth provider gets a pre-mortem that surfaces "SSO breakage on customer #3 (Tiger, week 4 signal)", "session-token format change desyncs mobile (Elephant, day 1)", and "vendor support ticket SLA worse than current (Paper-Tiger, low-impact)". Mitigations name owners; follow-up routes to `reversibility-check` because auth migration is Type-1.

## Anti-patterns

- **Generic doom.** "The market could shift" / "key personnel could leave" — fails step 3. Force specificity to chain-of-events level.
- **Mistaking persistent agreement for resolved risk.** Sycophancy resurfaces during mitigation discussion ("yes, owner X can absolutely handle that"). Stay in pressure-test mode through the whole skill.
- **Running on a vague plan.** Step 1's restatement is a gate — if the user can't confirm the restatement, the plan isn't concrete enough to pre-mortem. Send them back to scope the plan first.
- **Skipping the two-pass verify.** Motivated-reasoning-toward-worst-case is the dominant pre-mortem failure; the second pass catches the most obviously implausible narratives before they reach the user.
- **Omitting Paper-Tiger and Elephant tags.** Without tag diversity the output reads as monotone catastrophizing; tagging forces the model to acknowledge that some risks are overrated and others are being ignored.

## Gotchas

- **Emotional-attachment override** — if the user is visibly invested in the plan succeeding, the pre-mortem can read as adversarial. The framing fix is in step 2: it's not "your plan is bad"; it's "let's see what 6-months-from-now you would tell present-you."
- **Date specificity matters** — "6 months from now" degrades into "someday"; using the literal calendar date (e.g., "2026-11-26") keeps the assertion concrete enough to generate specific narratives.
- **Owner naming is non-negotiable** — if step 6 produces mitigations without owners, the skill has failed. Re-prompt until each mitigation has a named person.
- **Two-pass verify is cheap and load-bearing** — the dossier flags this as the difference between pre-mortems that ship 3 false alarms and ones that ship a clean ranked list. Don't skip it to save tokens.
- **Pre-mortem ≠ blame-mortem** — the technique targets the plan, not the people. If the output reads like a personnel critique, re-frame in step 1.

## When NOT to use

- **Tone checks or single-fact lookups** — wrong tool, wrong cost. Route to `disconfirming-evidence-first` instead.
- **Emotional-support framings** — "I'm feeling stuck about X" / "this is hard, just want to talk through it" — `anti-sycophancy-meta` should detect this first and skip pre-mortem. Pressure-testing emotional vulnerability is the bad reading.
- **Vague proposals not yet committed to** — pre-mortem requires a concrete plan. For "should I think about doing X eventually", route to `10-10-10` or `cost-of-inaction` instead.
- **Project-scale strategic locks** — multi-dossier decisions belong in KB-04's architect-prompt + DECISIONS.md flow, not a conversational pre-mortem. KB-05 escalates to KB-04 via `council-3-voice`'s "this needs a DECISIONS.md entry" verdict.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §4, §7.1, §10.
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 1.
- Primary sources:
  - Klein, *Performing a Project Premortem*, Harvard Business Review 85(9):18-19, Sep 2007.
  - Kahneman, *Thinking, Fast and Slow* (Macmillan, 2011) — attributed pre-mortem as his "single most valuable decision technique."
  - `lobehub.com/skills/carlkibler-agent-skills-pre-mortem` and `parcadei-continuous-claude-v3-premortem` — production-shipped installable Skills with public reviews; the two-pass verify protocol is sourced from the latter.
- Sibling skills:
  - `anti-sycophancy-meta` — fires before pre-mortem on user-owned-plan questions.
  - `reversibility-check` — gates whether pre-mortem alone is sufficient (Type-2) or `council-3-voice` should follow (Type-1).
  - `second-order-thinking` — natural follow-up when pre-mortem surfaces downstream-effect risks.
