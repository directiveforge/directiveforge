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
- SQL injection via unsanitized input (verify any raw `text()` or f-string SQL — `select()` is safe)
- Command injection in any shell/subprocess call
- Missing/incorrect Pydantic validation at the API boundary (`Field`, `Query` bounds)

**Secrets & Token Integrity**
- Hardcoded credentials or secrets (the `dev-secret-change-me` fallback in `app/config.py` must be overridden in prod)
- `SECRET_KEY` used for appointment-token HMAC — verify it comes from env and is verified with a constant-time compare
- `DATABASE_URL` sourced from env only

**Data Exposure**
- `SECRET_KEY`, connection strings, or PII (carrier names, SCAC codes) in logs, responses, or error messages
- Sensitive data in URL query strings

**Dependency Risks**
- New dependencies with known vulnerabilities (`pip-audit` if available)
- Deprecated or unmaintained packages

**Appointment-Token Security**
- Token signing uses `settings.SECRET_KEY`, not a literal key
- Signature verified before the token is trusted
- No token or signing key echoed back to the client

## Output Format

### Critical (must fix before merge)
- `file:line` -- vulnerability type -- exploitation scenario

### Warning (should fix)
- `file:line` -- issue -- risk level (high/medium)

### Info
- Observations that are not vulnerabilities but worth noting

### Passed
List security categories that look good in this diff.
