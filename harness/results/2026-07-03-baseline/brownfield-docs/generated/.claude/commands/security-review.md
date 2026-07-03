---
allowed-tools: Read, Glob, Grep, Bash(git diff:*), Bash(git status:*), Bash(git log:*)
description: Governance & data-hygiene review of changed docs — no leaked credentials, D4 respected, money gates intact
---

Review changed docs for the security dimensions that actually exist in a pure-Markdown ops repo. There is no code, no auth, no injection surface — the real risks here are **leaked credentials, governance-bypass, and unbounded spend**.

## Review focus (only flag issues you are >80% confident are real)

**Credential & secret hygiene**
- No API key, token, password, account credential, or connection string committed anywhere (this repo is meant to hold none — D4)
- No pre-wired integration: a registry entry moved to "vetted/in use" must have a founder credential-owner, not a self-installed key
- No customer PII or card data pasted into a playbook or report

**Governance integrity (D4)**
- No integration was wired up without a founder bootstrap — proposals only
- The integrations registry proposal protocol was followed (proposed row, credential surface stated, stopped there)
- No second decision ledger created; no in-place edit of a locked `D{N}` entry

**Money gates**
- Any spend / recurring-bill change is backed by a `D{N}` with a stated ceiling (`D6` is the model: hard $48,000/yr)
- No commitment above a decision's authorized ceiling
- Recurring costs flagged, never assumed

**Fact integrity**
- No invented dollar figures, depot names, or gear lines that could mislead an operator into a costly action

## Output Format

### Critical (must fix before merge)
- `path` — issue — why it is exploitable/costly here

### Warning (should fix)
- `path` — issue — risk level

### Info
- Observations worth noting, not violations

### Passed
List the governance/hygiene categories that look clean in this change.
