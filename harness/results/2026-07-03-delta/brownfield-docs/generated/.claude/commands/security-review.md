---
allowed-tools: Read, Glob, Grep, Bash(grep:*), Bash(find:*)
description: Governance-security review of changed docs — leaked credentials, unauthorized integrations, ledger tampering
---

Review changed docs for governance-security problems. This is a docs repo, so the threat model is not code injection — it is credential leakage, unauthorized integrations, and ledger integrity.

## Review Focus

Only flag issues you are confident are real.

**Credential & secret exposure**
- Any literal API key, token, password, or connection string committed into a doc (`grep` for `sk-`, `key=`, `token=`, `password=`, `Bearer `) — the registry names services; it must never carry their secrets
- A credential owner other than the founder recorded in `governance/INTEGRATIONS-REGISTRY.md` (D4 violation)

**Unauthorized integration (D4)**
- A registry row moved to "Vetted and in use" without a founder bootstrap
- A doc that instructs an operator to wire up / create an account / store a key for an external service
- A proposal that arrives pre-wired (per the registry protocol, this gets torn out)

**Money-gate integrity (D6-class)**
- A spend or lease figure that exceeds a signed ceiling without a superseding decision
- Recurring-cost advice presented as a casual step rather than a flagged money decision

**Ledger integrity**
- An existing DECISIONS entry edited in place (must be append-only)
- The D-number sequence broken (gap, duplicate, or renumber)
- A second ledger started outside `governance/DECISIONS.md`

## Output Format

### Critical (must fix before finalizing)
- `file:line` — issue — governance rule violated (D4 / D6 / ledger discipline)

### Warning (should fix)
- `file:line` — issue — risk

### Passed
List the governance categories that look clean in this change.
