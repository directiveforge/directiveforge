---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*), Read, Glob, Grep
description: Security review of pending changes on the current branch
---

Review the current branch's changes against `main` for security vulnerabilities.

## Context

GIT STATUS:
```
$ git status
```

DIFF:
```
$ git diff main...HEAD
```

## Review Focus

Only flag issues where you are **>80% confident** of actual exploitability. Skip theoretical issues, style concerns, and low-impact findings.

**Input Validation**
- SQL injection via unsanitized input (require SQLAlchemy bound params; no `text()` with interpolation)
- Command injection in any subprocess call
- Path traversal in file operations (e.g. the legacy CSV export, if ever wired in)
- Pydantic bypass (missing or incorrect `Field`/`Query` constraint on an endpoint)

**Secrets & Token Integrity**
- `SECRET_KEY` (HMAC signing key for appointment tokens) hardcoded, logged, or returned
- Signature verification using a non-constant-time compare
- Missing auth on any endpoint that should not be public (this is an internal service — confirm the deployment network boundary)

**Data Exposure**
- `SECRET_KEY`, connection strings, or PII (carrier names, SCAC) in logs, responses, or error messages
- Sensitive data in URL query parameters

**Dependency Risks**
- New dependencies with known vulnerabilities (`pip-audit` if available)
- Deprecated or unmaintained packages
- Unexpected network calls from new dependencies

**Appointment-token / booking-integrity**
- Token generation/verification correctness; booking uniqueness (`dock_id, window_start`) enforced at the DB, not just in Python

## Output Format

### Critical (must fix before merge)
- `file:line` -- vulnerability type -- exploitation scenario

### Warning (should fix)
- `file:line` -- issue -- risk level (high/medium)

### Info
- Observations that are not vulnerabilities but worth noting

### Passed
List security categories that look good in this diff.
