# Feedback — pre-HN hardening findings (2026-07-10)

**Source:** internal pre-launch review (fresh-context architect pass) + a live field upgrade of a
kit-generated project (content/editorial repo, kit v0.16.2 → v0.20.0, reconstructed-manifest path —
everything adjudicate-only). Project identified by bucket only, per the sanitization rules.

| # | Finding | Disposition |
|---|---|---|
| PH-1 | Kit-voice unmeasured multipliers survived the v0.20.0 README sweep in five files (KB-01 §11.7, KB-02 §6.6, WORKFLOW-CLAUDE-CODE §9/§11/§15, VALIDATION_CHECKLIST §11, PROJECT_SETUP_PROMPT cost tips): "2-3x quality", "40-60%", "~50%", "25x cheaper" — contradicting the published "measured, not claimed" rule. | FIXED this commit — numbers deleted or made price-derived/attributed. research/ keeps third-party figures as attributed source material; frozen harness artifacts untouched (historical records). |
| PH-2 | Model-state stale in the kit's own doctrine: Fable 5 still written as SUSPENDED (restored 2026-07-01; usage-credits-only since 2026-07-07); Sonnet 5 GA (2026-07-01) absent from routing docs. A freshness-first kit was stale about its own strongest model. | FIXED (minimal state refresh: CLAUDE-SURFACE-ROUTING §1a/§1b, KB-02 §4.8, KB-04 §4.1, KB-06). Full kit-wide default-model routing rewrite stays queued as 2026-08-01 monthly integration priority 1. |
| PH-3 | UPGRADE_MODE still emitted legacy `AI-KIT-UPGRADE-PLAN-*.md` output filenames post-rename (found by the live field upgrade). | FIXED — output renamed `UPGRADE-PLAN-*.md`; `.ai-kit-manifest.json` deliberately KEPT (load-bearing: upgrade mode matches existing installs by that filename). |
| PH-4 | Cross-project lock-bleed hazard: a hand-drafted upgrade prompt imported compliance locks belonging to a *different* project of the same operator; caught in review before execution. Root cause: locks written from operator memory instead of discovered from the target repo. | DEFERRED (post-launch, named home): add a "locks are DISCOVERED from the target repo's DECISIONS.md/rules — never imported from operator memory or another project" rule to UPGRADE_MODE and PROJECT_SETUP_PROMPT Phase 0/1. |
| PH-5 | Dirty-tree hazard: launch-critical prompts sat untracked in the working tree for days (one `git clean` from loss), violating the W0-commits-at-W0 lock. | FIXED — all committed this session; lesson re-affirmed. |
| PH-6 | Provenance freeze-row lag: the RELEASES.md row recording the *actually pushed* public tree (`8206c4c`, built at `d1efd8a`) was uncommitted; HANDOFF still pointed at the prior freeze. The W5-verified tree differs from the pushed tree by the same-day provenance rebuild. | FIXED — row committed, HANDOFF pointers refreshed; future freezes commit the row in the same action as the build. |

**Zero silent drops:** every finding above is FIXED here or DEFERRED with a named home.
