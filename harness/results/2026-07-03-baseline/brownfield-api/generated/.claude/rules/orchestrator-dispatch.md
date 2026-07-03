# SlotHarbor — Orchestrator Dispatch

Cross-track rule for multi-prompt orchestrators (research suites, implementation tracks, any workflow that dispatches N dossiers + a synthesis pass). SlotHarbor is a small maintenance-mode service; use this only when a decision genuinely warrants multi-dossier research.

## SURFACE ROUTING PER PHASE (first match wins)

| Phase | Surface | Why |
|---|---|---|
| Individual research dispatch (per dossier) | **Chat + Research mode** | Inline citation renderer; fresh-session isolation |
| Final synthesis (≥200 K tokens of dossier input) | **Code** | 1M context auto-on; filesystem reads beat upload friction |
| Phase 3 lock (DECISIONS edit + commit) | **Code** | Repo writes; commit discipline; rule-file mirrors |
| Cross-app audits (Heroku dashboard, DB console, vendor portals) | **Cowork** | Browser + native + filesystem composite |

## WAVE DAG — LAW #4 DEFERRED DEPENDENCIES

Build the dependency DAG before dispatching. Group independent prompts into Wave 1; defer dependents; synthesis is the terminal wave. NEVER mechanically split prompts evenly across waves. Subsequent-wave prompts need RAG access to upstream output; uploading everything at the end degrades subsequent-wave quality. Final synthesis reads dossiers via `@`-mention / filesystem in Code, not Project RAG.

## SUB-AGENT MODEL DIRECTIVE

For decision-grade synthesis, force the strongest reasoning model. Paste into synthesis-session prompts:

```
Sub-agent model directive (CRITICAL): every Task tool invocation in this
session MUST use model: "opus" — NOT default Haiku/Sonnet. Decision-grade
synthesis requires Opus-class reasoning for quote extraction, freshness
aggregation, and ranking-matrix construction.
```

Apply for: final synthesis, Phase 3 elicitation, cross-dossier integration. Skip for: trivial mechanical tasks.

## DECISIONS.md NUMBERING VERIFICATION

```bash
grep -c "^### Implementation #" DECISIONS.md
```

Result + 1 = next free number. Cross-check reservation comments (`git log --since='2 weeks ago' --grep='reserve'`). On conflict, escalate to the human — NEVER silently mutate.

## PRE-DISPATCH VERIFICATION CHECKLIST

- All upstream dossiers exist + 8-gate-verified + committed
- Track-specific custom instructions applied to the Chat Project
- User on a plan tier that supports the required surface affordances (Research mode, 1M context)
- Cross-orchestrator boundary clean (no silent mutation of a peer track's scope)

## ANTI-PATTERNS

- Run synthesis in Chat (≥200K input crashes the session)
- Dispatch dependent prompts in parallel with their dependencies (violates Law #4)
- Lock DECISIONS without `grep`-checking numbering
- Dispatch synthesis without the sub-agent Opus directive

## REFERENCES

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §4 — canonical dispatch mechanics
- `<KIT_ROOT>/knowledge-base/CLAUDE-SURFACE-ROUTING.md` — cross-project surface rubric
- `.claude/rules/research.md` — sibling 3-layer research methodology rule
