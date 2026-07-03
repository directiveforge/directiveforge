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

Only flag issues where you are **>80% confident** of actual exploitability. Skip theoretical issues, style concerns, and low-impact findings. Tempo Deck is a static, no-auth, no-database app — the realistic surface is small; focus there.

**Secret & Data Exposure** (the primary risk here)
- `RESEND_API_KEY` value committed, logged, or leaked into client code
- Any secret placed in a `NEXT_PUBLIC_*` variable (those are inlined into the browser bundle)
- `lib/email.ts` sending data without the `RESEND_API_KEY` guard

**Input Validation**
- If a form, route handler, or dynamic route is added: unvalidated input reaching `fetch`/shell/file paths
- Injection into the Resend request body (email header injection via unescaped user input)

**Dependency Risks**
- New dependencies with known vulnerabilities (`npm audit`)
- Unexpected network calls from new dependencies

## Output Format

### Critical (must fix before merge)
- `file:line` — vulnerability type — exploitation scenario

### Warning (should fix)
- `file:line` — issue — risk level (high/medium)

### Info
- Observations that are not vulnerabilities but worth noting

### Passed
List security categories that look good in this diff.
