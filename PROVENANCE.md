# PROVENANCE

This public repository is a **fresh-init snapshot** of a private research lab repo.
The lab's full git history is private (it contains client work the privacy rules
protect); everything measurable ships here.

- Private-repo release commit for this snapshot: `d1efd8ace9cf2d0d621cf38234f1fb737f291f3b`
- Snapshot built: 2026-07-03T22:12:52Z
- `fixture_sha` values inside `harness/results/**/run-metadata.json` (e.g.
  `853c653`) are PRIVATE-repo commit SHAs — they order pre-registration
  vs. measurement inside the lab history and are attested by the operator, not
  publicly resolvable. From v0.20.0 onward, all new pre-registration runs happen in
  THIS repository, so future proofs are publicly git-provable end to end.
- A small set of machine-local path constants was replaced before publication; the
  transform is **fully disclosed and one-command reproducible** — see
  `SCRUB-TRANSFORM.md` + `scripts/verify-transform.sh`. All other harness
  artifacts are byte-identical to the lab tree at the commit above.
- Frozen measured artifacts (`harness/results/**`, baseline runner records)
  predate the public name and carry the kit's pre-launch working title and the
  `.ai-kit-manifest.json` filename — historical fidelity, not a second brand
  (see `NAMING-DECISION.md` §5).
- Attestation: the operator attests this snapshot content equals the lab tree at
  `d1efd8ace9cf2d0d621cf38234f1fb737f291f3b` modulo exactly (a) the exclusions listed in the lab's snapshot
  manifest (private client material and launch-ops files) and (b) the disclosed
  transforms. Bound to the annotated tag `v0.20.0-public`.
