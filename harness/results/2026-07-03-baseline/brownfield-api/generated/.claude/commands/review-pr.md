# Review PR

Review the current branch's changes against `main` for correctness, security, and SlotHarbor conventions.

## Steps

1. Get the diff: `git diff main...HEAD`
2. List changed files: `git diff --name-only main...HEAD`
3. For each changed file: read the full file (not just the diff)
4. Search for related patterns the change may duplicate
5. Apply the checklist below

## Checklist

**Correctness**
- [ ] Logic matches stated intent
- [ ] Edge cases handled (`None` lookups, empty results, `window_end <= window_start`)
- [ ] Error paths raise `HTTPException` with correct status codes (404 / 422)

**Security**
- [ ] No user input in raw SQL (SQLAlchemy `select()` is parameterized)
- [ ] `SECRET_KEY` / `DATABASE_URL` not in logs, responses, or error messages
- [ ] Input bounds enforced (`Field(gt=0)`, `Query(..., le=settings.MAX_PAGE_SIZE)`)

**SlotHarbor Conventions**
- [ ] Sync only — no `async def` / `AsyncSession` (DECISIONS #1)
- [ ] Pydantic v2 API (`ConfigDict`, `model_dump`) — no v1
- [ ] Response through a `response_model` — no raw ORM object
- [ ] App boots: `python -c "import app.main"`
- [ ] `legacy_export.py` still unmounted (DECISIONS #2)

**Tests**
- [ ] If a test suite exists, new behavior has coverage (note: none installed by default — see `.claude/agents/tester.md`)

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
