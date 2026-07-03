# Trailhead Collective — Orchestrator Dispatch

Cross-track rule for any workflow that dispatches multiple research dossiers + a synthesis pass (e.g., several vendor comparisons feeding one locked supplier decision). Small repo — most decisions here are single-dossier; this rule applies only when a call genuinely needs multiple evidence dossiers.

## SURFACE ROUTING PER PHASE (first match wins)

| Phase | Surface | Why |
|---|---|---|
| Individual research dispatch (per dossier) | **Chat + Research mode** | Inline citation renderer; fresh-session isolation; long compute per dossier |
| Final synthesis (large dossier input) | **Code** | Filesystem reads beat upload friction; sub-agent dispatch; 1M context on Max/Team/Ent |
| Lock phase (DECISIONS append + architect-prompt draft) | **Code** | Repo writes; ledger discipline |
| Cross-app audits (vendor portals, dashboards) | **Cowork** | Browser + native + filesystem composite |

NEVER route regulated or credential-bearing work through a surface without an audit log. Vendor-portal research that would touch a login is a Cowork task the founder runs — never wire a credential (D4).

## WAVE DAG — DEFERRED DEPENDENCIES

Build the dependency DAG before dispatching. Independent dossiers → Wave 1; dependents deferred; synthesis is the terminal wave. NEVER mechanically split prompts evenly. Between waves, upstream dossiers feed downstream prompts; dispatching a dependent prompt in parallel with its dependency wastes the dependency.

## SUB-AGENT MODEL DIRECTIVE

For decision-grade synthesis, force the strongest available reasoning model. Paste into synthesis-session prompts:

```
Sub-agent model directive (CRITICAL): every Task tool invocation in this
session MUST use model: "opus" — NOT default Haiku/Sonnet. Decision-grade
synthesis requires Opus-class reasoning for quote extraction and ranking.
```

Apply for final synthesis + lock-phase work. Skip for trivial mechanical tasks.

## SYNTHESIS PROMPT QUALITY BAR (8 components)

1. Dossier-anchored (every claim cites `R{N} §{X}`, not memory)
2. Cross-dossier tensions pre-identified
3. Twin-view ranking when a major assumption splits the answer (e.g., summer volume high vs low)
4. Founder elicitation Q1–Q4 pre-loaded, grounded in dossier evidence
5. Architect-prompt skeleton for the next phase
6. Re-verification schedule (quarterly / semiannual / annual / event-triggered)
7. Universal Blocks A/B/C consolidated
8. Length target 600–1,500 lines

## DECISIONS NUMBERING VERIFICATION

```bash
grep -c "^## D" governance/DECISIONS.md
```

Result + 1 = next free number (currently: after D7 → D8). This repo has no `.git`, so there are no reservation commits to cross-check — the grep is authoritative. On any ambiguity, escalate to the founder; NEVER silently renumber a locked entry (it breaks every reference).

## PRE-DISPATCH VERIFICATION CHECKLIST

- All upstream dossiers exist + 8-gate-verified
- Track custom instructions applied
- No governance conflict — a vendor dispatch never instructs wiring anything (D4)
- No money-gate breach implied without a superseding decision (D6-class)

## ANTI-PATTERNS

- Run synthesis in Chat (large input crashes the session)
- Dispatch a dependent prompt in parallel with its dependency
- Lock a decision without grep-checking numbering
- Wire up a vendor credential during research (D4 violation)
- Start a second ledger instead of appending to `governance/DECISIONS.md`

## REFERENCES

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §4 — canonical dispatch mechanics
- `<KIT_ROOT>/knowledge-base/CLAUDE-SURFACE-ROUTING.md` — cross-project surface rubric
- `.claude/rules/research.md` — sibling 3-layer research methodology rule
