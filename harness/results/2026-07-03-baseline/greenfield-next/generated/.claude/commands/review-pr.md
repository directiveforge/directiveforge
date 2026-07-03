# Review PR

Review the current branch's changes against `main` for correctness, security, and Tempo Deck conventions.

## Steps

1. Get the diff: `git diff main...HEAD`
2. List changed files: `git diff --name-only main...HEAD`
3. For each changed file: read the full file (not just the diff)
4. Apply the checklist below

## Checklist

**Correctness**
- [ ] Logic matches stated intent
- [ ] Edge cases handled (empty session list, null, boundary BPM values)
- [ ] Server/client component boundary correct — `'use client'` only where interactivity requires it

**Security**
- [ ] No `RESEND_API_KEY` value or other secret in code, logs, or committed files
- [ ] `lib/email.ts` still guards on missing `RESEND_API_KEY`
- [ ] No secret placed in a `NEXT_PUBLIC_*` var (ships to browser)

**Tempo Deck Conventions**
- [ ] kebab-case files / PascalCase components
- [ ] Named exports for components; `export default` only on route entry files
- [ ] Tailwind brand tokens, not raw hex
- [ ] `@/` imports (project root); no reference to non-existent `src/` / `app/api/` / `middleware.ts`
- [ ] Passes: `npx tsc --noEmit` and `npm run lint`

## Output Format

```
## PR Review

### Critical (must fix)
- file.tsx:42 — description — why it matters

### Warning (should fix)
- file.tsx:17 — description

### Passed
✓ [list items that look good]

### Verdict
APPROVE / REQUEST CHANGES
```
