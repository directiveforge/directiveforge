# Three-surface drift check — DF-RUN-CONTRACT sentinel block

Method: extract between the literal sentinels `<!-- DF-RUN-CONTRACT v1` and
`<!-- /DF-RUN-CONTRACT v1 -->` in each surface, `shasum -a 256`.

## At verification time (verifier W7-e, pre-fix)

| Surface | Hash (inclusive of sentinels) |
|---|---|
| generator/PROJECT_SETUP_PROMPT.md | `ed83d9e2bb340d02058656588c08972504a9b4771ba1cbd460b1385e69ba83ae` |
| QUICK_START.md | `ed83d9e2bb340d02058656588c08972504a9b4771ba1cbd460b1385e69ba83ae` |
| README.md | `ed83d9e2bb340d02058656588c08972504a9b4771ba1cbd460b1385e69ba83ae` |

Identical — PASS. (Verifier also computed the payload-only hash `41b91c42…272b` — identical.)

## After the post-verification F1/F4 doc fixes (orchestrator re-check, commit cd74a8b)

| Surface | Hash |
|---|---|
| generator/PROJECT_SETUP_PROMPT.md | `064a560e2690f8e593be7f0d16b775e5e6a7c224066d573216834dfab552193e` |
| QUICK_START.md | `064a560e2690f8e593be7f0d16b775e5e6a7c224066d573216834dfab552193e` |
| README.md | `064a560e2690f8e593be7f0d16b775e5e6a7c224066d573216834dfab552193e` |

Identical — PASS. The block changed (Writes range 29–44; resumed-run cost clause) and stayed
byte-identical across all three surfaces.
