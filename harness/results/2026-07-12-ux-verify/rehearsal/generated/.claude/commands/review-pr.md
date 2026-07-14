# Review PR

Review the current branch's changes against `master` for correctness, security, and unitkit conventions.

## Steps

1. Get the diff: `git diff master...HEAD`
2. List changed files: `git diff --name-only master...HEAD`
3. For each changed file: read the full file (not just the diff)
4. Search for related tests — note if new code lacks coverage (unitkit has no test suite yet — DECISIONS #5)
5. Apply the checklist below

## Checklist

**Correctness**
- [ ] Logic matches stated intent
- [ ] Edge cases handled: NaN value, unknown unit, cross-dimension conversion
- [ ] Error paths throw `ConversionError` and map to the right exit code (1 conversion / 2 usage)

**Security**
- [ ] No unsanitized input reaches a shell/eval (unitkit does neither — keep it that way)
- [ ] No credentials or PII in output — unitkit only prints conversions to stdout/stderr
- [ ] CLI arg parsing keeps the `Number()` guard and the unknown-unit guard

**unitkit Conventions**
- [ ] Lowercase file naming; named exports only
- [ ] New units added as `UNITS` rows in `src/units.ts` (not scattered factors)
- [ ] No `any` (lint error); temperature NOT added to the factor table (DECISIONS #3)
- [ ] Commands pass: `npm run build` and `npm run lint`

**Tests**
- [ ] If a test runner now exists, new behavior has behavioral (not implementation-detail) coverage

## Output Format

```
## PR Review

### Critical (must fix)
- file.ts:42 — description — why it matters

### Warning (should fix)
- file.ts:17 — description

### Passed
✓ [list items that look good]

### Verdict
APPROVE / REQUEST CHANGES
```
