---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*), Read, Glob, Grep
description: Security review of pending changes on the current branch
---

Review the current branch's changes against `master` for security vulnerabilities.

## Context

GIT STATUS:
```
$ git status
```

DIFF:
```
$ git diff master...HEAD
```

## Review Focus

Only flag issues where you are **>80% confident** of actual exploitability. Skip theoretical issues, style concerns, and low-impact findings.

unitkit is a local CLI with no network, database, auth, filesystem writes, or secrets — most categories below are N/A by construction. The real surface is CLI argument handling. Flag a finding only if a change *introduces* one of these.

**Input Validation**
- Command injection: does any change pass `argv` to a shell, `eval`, `child_process`, or a `Function` constructor? (Today: none — keep it that way.)
- Unvalidated input reaching filesystem or network APIs newly introduced by the change
- The `Number()` guard and unknown-unit guard still reject bad input before use

**Data Exposure**
- Credentials, API keys, or PII in output, logs, or error messages (unitkit should only print conversions)
- New dependency that phones home or bundles telemetry

**Dependency Risks**
- New dependencies with known vulnerabilities (`npm audit`)
- Deprecated or unmaintained packages
- Unexpected network calls from a new dependency

**CLI Input Surface**
- New argument or flag parsing that could be abused (path arguments, format strings, unbounded input)
- Any move from pure computation toward I/O (file read/write, spawning processes)

## Output Format

### Critical (must fix before merge)
- `file:line` -- vulnerability type -- exploitation scenario

### Warning (should fix)
- `file:line` -- issue -- risk level (high/medium)

### Info
- Observations that are not vulnerabilities but worth noting

### Passed
List security categories that look good in this diff.
