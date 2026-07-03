# Trailhead Collective — Orchestrator Dispatch

Cross-track rule for research-backed strategic decisions (supplier selection, lease terms, depot expansion, processor changes) that need multiple evidence dossiers before a `D{N}` lock. Governs how those dossiers are dispatched, verified, and synthesized. This repo has no code-runtime — dispatch here means research + synthesis + a ledger entry, never a build.

## SURFACE ROUTING PER PHASE (first match wins)

| Phase | Surface | Why |
|---|---|---|
| Individual research dispatch (per dossier) | **Chat + Research mode** | Inline citation renderer; fresh-session isolation; cited primary-source verification |
| Final synthesis (multi-dossier) | **Code** | Filesystem reads across dossiers; sub-agent dispatch; writes the deliverable + ledger entry |
| Ledger lock (`D{N}` edit + commit) | **Code** | Repo writes; append-only discipline; commit trail |
| Vendor-portal / bookkeeping-dashboard audits | **Cowork** | Browser + native + filesystem composite (e.g. Ledgerline export review) |

Regulated / privacy note: this business handles customer deposit and card data through DepotHold Payments — never paste PII or card data into any surface, and never route a customer-data task through a surface without an audit log. Card/PII work stays out of research dossiers entirely.

## WAVE DAG — DEFERRED DEPENDENCIES

Build the dependency DAG before dispatching. Group independent research questions into Wave 1; defer dependents (a question whose answer needs an earlier dossier) to Wave 2; synthesis is the terminal wave. NEVER split questions evenly across waves mechanically. Example: "which drysuit supplier" depends on "what is summer paddle volume" — the volume dossier is Wave 1, the supplier decision Wave 2.

## SUB-AGENT MODEL DIRECTIVE

For decision-grade synthesis, force the strongest reasoning model. Paste into synthesis-session prompts:

```
Sub-agent model directive (CRITICAL): every Task tool invocation in this
session MUST use model: "opus" — decision-grade synthesis requires Opus-class
reasoning for quote extraction, freshness aggregation, and ranking-matrix
construction. Do NOT default to Haiku/Sonnet for a money-gate decision.
```

Apply for: final synthesis, cross-dossier integration, any decision touching a money gate (`D6`-class). Skip for: trivial mechanical lookups.

## SYNTHESIS PROMPT QUALITY BAR (condensed)

1. **Dossier-anchored** — every claim cites a dossier section, not memory.
2. **Cross-dossier tensions pre-identified** — list the specific conflicts the synthesizer must resolve.
3. **Twin-view ranking** — if a major assumption (e.g. summer volume high vs low) splits the answer, produce both views ranked.
4. **Money-gate discipline** — any spend recommendation states cost at launch AND at scale, and lands as a `D{N}` with a stated ceiling.
5. **Re-verification schedule** + **decidable reversal triggers per stage**.
6. **Universal Blocks A/B/C** consolidated (Context Envelope / Common Pitfalls / Freshness Log).

## LEDGER NUMBERING VERIFICATION

```bash
grep -c '^## D[0-9]' governance/DECISIONS.md   # count of D{N} entries
grep -oE '^## D[0-9]+' governance/DECISIONS.md | tail -1   # last entry
```

Last entry is `D6`; the next free number is `D7`. Never reuse a number, never renumber a locked entry, never start a second ledger. On any ambiguity, escalate to the founder — do NOT silently mutate.

## ANTI-PATTERNS

- Run multi-dossier synthesis in Chat (large input crashes the session) — synthesize in Code.
- Dispatch a dependent research question in parallel with its dependency (violates the wave DAG).
- Lock a `D{N}` without `grep`-checking numbering.
- Recommend a spend without a stated ceiling, or an integration without the D4 propose-only path.
- Route customer card/PII data through any research or non-audited surface.
- Silently edit a locked ledger entry instead of adding a superseding `D{N}`.

## REFERENCES

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §4 — canonical dispatch mechanics
- `<KIT_ROOT>/knowledge-base/CLAUDE-SURFACE-ROUTING.md` — cross-project surface rubric
- `.claude/rules/research.md` — sibling 3-layer research methodology rule
