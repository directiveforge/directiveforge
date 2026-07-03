# SlotHarbor — Orchestrator Dispatch

Cross-track rule for multi-prompt orchestrators (research suites, implementation tracks, any workflow that dispatches N dossiers + a synthesis pass).

## SURFACE ROUTING PER PHASE (first match wins)

| Phase | Surface | Why |
|---|---|---|
| Individual research dispatch (per dossier) | **Chat + Research mode** | Inline citation renderer; fresh-session isolation; 1–3 h compute per dossier |
| Final synthesis (≥200 K tokens of dossier input) | **Code** | 1M context auto-on; filesystem reads beat upload friction; sub-agent dispatch |
| Phase 3 lock (DECISIONS edit + architect prompt draft + commit) | **Code** | Repo writes; commit discipline; rule-file mirrors |
| Cross-app audits (dashboards, vendor portals, native apps) | **Cowork** | Browser + native + filesystem composite |

NEVER route regulated workloads through Cowork — any surface without an audit log is wrong for compliance-bearing work. (SlotHarbor is an internal logistics service; no regulated-data workloads are in scope today — revisit if carrier PII handling expands.)

## WAVE DAG — LAW #4 DEFERRED DEPENDENCIES

Build the dependency DAG before dispatching. Read each prompt's stated dependencies + cross-references. Group independent prompts into Wave 1; defer dependents to Wave 1.5/2; synthesis is the terminal wave. NEVER mechanically split prompts evenly across waves.

**Per-wave cycle:** parallel chats → 8-gate verify each dossier → squash-merge wave PR → user drags dossiers into Project Knowledge → next wave unblocked. Subsequent-wave prompts need RAG access to upstream output; uploading everything at the end degrades subsequent-wave quality.

Final synthesis does NOT use Project RAG — Code reads dossiers via `@`-mention or filesystem, faster + complete vs retrieval ceilings.

## SUB-AGENT MODEL DIRECTIVE

Default sub-agent dispatch uses an efficiency-tier model. For decision-grade synthesis, force the strongest available reasoning model. Paste verbatim into synthesis-session prompts:

```
Sub-agent model directive (CRITICAL): every Task tool invocation in this
session MUST use model: "opus" — NOT default Haiku/Sonnet. Decision-grade
synthesis requires Opus-class reasoning for quote extraction, freshness
aggregation, and ranking-matrix construction.
```

Apply for: final synthesis, Phase 3 elicitation, cross-dossier integration. Skip for: trivial mechanical tasks.

## SYNTHESIS PROMPT QUALITY BAR (8 components)

1. **Dossier-anchored** — every claim cites `R{N} §{X}` not training data
2. **Cross-dossier tensions pre-identified** — list specific conflicts the synthesizer must resolve
3. **Twin-view ranking when applicable** — if a major assumption splits the answer, produce both views ranked
4. **Phase 3 elicitation Q1–Q4 pre-loaded** — questions grounded in dossier evidence, ready for `AskUserQuestion`
5. **Architect prompt skeleton for next phase** — section headers + knowledge-manifest paths + identity statement
6. **Re-verification schedule** — quarterly / semiannual / annual / event-triggered items with monitoring approach
7. **Universal Blocks A/B/C consolidated** — Context Envelope, Common Pitfalls, Freshness Log aggregated across corpus
8. **Length target** — 600–1,500 lines. Shorter = under-explored tensions; longer = re-derivation

Rewrite stale synthesis prompts BEFORE dispatch. Pre-dispatch upgrade is high-leverage; stale-baseline against fresh corpus wastes the corpus.

## DECISIONS.md NUMBERING VERIFICATION

```bash
grep -c "^## Implementation #" DECISIONS.md
```

Result + 1 = next free number. Cross-check reservation comments in recent commits (`git log --since='2 weeks ago' --grep='reserve'`). On conflict (two orchestrators racing), escalate to the human user — NEVER silently mutate.

## PRE-DISPATCH VERIFICATION CHECKLIST

- All upstream dossiers exist + 8-gate-verified + committed
- Wave dossiers uploaded to Project Knowledge (between waves)
- Track-specific custom instructions applied to the Project
- User on a plan tier that supports required surface affordances (Research mode, 1M context)
- Cross-orchestrator boundary clean (no silent mutation of a peer orchestrator's scope)

## ANTI-PATTERNS

- Run synthesis in Chat (≥200K input crashes the session)
- Upload all dossiers at the end (skip wave-RAG refresh)
- Dispatch dependent prompts in parallel with their dependencies (violates Law #4)
- Pre-lock specific waves before running the DAG analysis
- Use Cowork for regulated workloads (no audit log)
- Silently mutate a peer orchestrator's scope (their DECISIONS entries, rule files, agents)
- Lock DECISIONS without `grep`-checking numbering
- Dispatch synthesis without the sub-agent Opus directive

## REFERENCES

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §4 — canonical dispatch mechanics
- `<KIT_ROOT>/knowledge-base/CLAUDE-SURFACE-ROUTING.md` — cross-project surface rubric
- `.claude/rules/research.md` — sibling 3-layer research methodology rule
