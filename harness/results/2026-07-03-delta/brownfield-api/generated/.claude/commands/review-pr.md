# Review PR

Review the current branch's changes against `main` for correctness, security, and SlotHarbor conventions.

## Steps

1. Get the diff: `git diff main...HEAD`
2. List changed files: `git diff --name-only main...HEAD`
3. For each changed file: read the full file (not just the diff)
4. Search for related patterns — note where a convention is broken
5. Apply the checklist below

## Checklist

**Correctness**
- [ ] Logic matches stated intent
- [ ] Edge cases handled (missing dock/carrier, empty results, `window_end <= window_start`, duplicate `(dock_id, window_start)`)
- [ ] Error paths raise `HTTPException` with the correct status code

**Security**
- [ ] No unsanitized user input in SQL (SQLAlchemy bound params only)
- [ ] `SECRET_KEY`, connection strings, or request bodies never logged or returned
- [ ] Config from env only — no secret literal committed

**SlotHarbor Conventions**
- [ ] Synchronous only — no `async def`/`AsyncSession` (DECISIONS #1)
- [ ] Pydantic v2 with `response_model` on every route; schemas inline (DECISIONS #2); no service layer (DECISIONS #3)
- [ ] App boots: `python -c "import app.main"`; any migration applies: `alembic upgrade head`

**Tests**
- [ ] If a test suite exists, new behavior has coverage (note: none is configured today — flag if the change warrants adding one)

## Output Format

```
## PR Review

### Critical (must fix)
- file.py:42 — description — why it matters

### Warning (should fix)
- file.py:17 — description

### Passed
✓ [list items that look good]

### Verdict
APPROVE / REQUEST CHANGES
```
