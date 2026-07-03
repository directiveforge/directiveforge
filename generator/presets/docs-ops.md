# Generator Preset: Docs/Ops (Markdown-First, No Code Manifest)

> Supplement for `PROJECT_SETUP_PROMPT.md` when the target repo has NO package manifests and its corpus is Markdown — business ops, research, strategy, governance ledgers.
> Detected by: Phase 1.1's no-manifest branch — no `package.json` / `pyproject.toml` / lockfiles; `*.md` dominates the tree; git present.
> Division of responsibility: the Phase 1.1 no-manifest branch is *analysis*; this preset is *generation guidance* — do not restate the branch here.

---

## Corpus Analysis Signals

Replaces Stack Detection — there is no stack, there is a corpus:

```bash
find . -name '*.md' -not -path './node_modules/*' | wc -l      # corpus size
find . -name '*.md' | sed 's|/[^/]*$||' | sort | uniq -c | sort -rn | head   # where docs cluster
head -20 $(find . -name '*.md' | head -5)                       # frontmatter / heading-style sample
grep -rln 'verified:\|Last updated\|Last verified' --include='*.md' . | head  # freshness-field convention?
ls *INDEX* *README* 2>/dev/null; grep -c '](' README.md 2>/dev/null           # index files + link density
grep -rln 'DECISIONS\|LEDGER\|append-only' --include='*.md' . | head          # governance artifacts
```

## CLAUDE.md Additions

Replace the Architecture section with a corpus map; commands become doc-lint gates:

```markdown
## Architecture (corpus map)
- [directory]: [what class of documents lives here — ledgers, research, ops runbooks]
- Index files: [which files are navigation — every doc reachable from one]
- Ledgers: [DECISIONS.md etc. — append-only, numbered entries]

## Key Conventions
- File naming: [detected — e.g. YYYY-MM-DD-topic.md for dated docs]
- Frontmatter/heading style: [detected convention]
- Freshness discipline: date-stamped claims carry a `verified:` field; stale = older than [detected cadence]
- Citation discipline: claims cite sources; one source of truth per fact — link, don't restate
```

## Quality Gates (replaces build/lint/test — these ARE the feedback loop chain)

Fill the quality-gates rule with corpus checks instead of compiler gates:

```markdown
## Doc-Lint Gates
| Gate | Command | Blocking |
|------|---------|----------|
| Link health | `python3 .claude/scripts/check-links.py templates examples` | Yes |
| Index drift | every doc listed in its index ⇄ every index row points at a real file | Yes |
| Stale `verified:` | grep dates older than the corpus's stated cadence | No (report) |
| Ledger integrity | numbering monotonic, append-only (`git log -p` spot-check on ledger files) | Yes |
| Frontmatter lint | changed docs carry the corpus's frontmatter/heading convention | No (report) |
```

### CANONICAL link-check script (single source — copy verbatim; do NOT improvise a shell one-liner)

Write this **exact** file to `.claude/scripts/check-links.py` in the target repo. It is the one canonical link-checker referenced by every quality-gates gate (Claude Code + Cursor). Docs repos have no package manager, so it is python3-stdlib only — zero installs on macOS and Linux.

**WHY this file exists (the trap it closes):** a naive checker (`grep '](' | test -f`) resolves each relative link from the **cwd / repo root**, so an intra-subdir link like `docs/a.md → [b](b.md)` is tested as `./b.md` and reported DEAD even though `docs/b.md` exists. In a real corpus that mis-reports *every* sibling link and drowns the genuine dead links (measured: HD-6 baseline — 13 false DEAD LINK lines burying 2 real ones). The fix is one line of discipline: resolve each link against **the linking file's own directory** (`os.path.dirname(fpath)`), never the cwd.

```python
#!/usr/bin/env python3
# Doc link-checker. WHY: naive checkers resolve relative links from the cwd/repo
# root, so every intra-subdir link (docs/a.md -> b.md) misfires. This resolves
# each link against the LINKING FILE's own directory (os.path.dirname), the only
# correct base. POSIX + python3 stdlib only — no installs.
# Usage: python3 .claude/scripts/check-links.py [EXCLUDE_DIR_OR_FILE ...]
#   e.g. python3 .claude/scripts/check-links.py templates examples
# Output: "file:line: BROKEN -> target" per real dead link; quiet on success.
# Exit:   non-zero iff any dead link found. Run from the repo root.
import os, re, sys

EXCLUDE = set(sys.argv[1:])  # dirs/files to skip (e.g. templates with {{PLACEHOLDER}} paths)
LINK = re.compile(r'!?\[[^\]]*\]\(\s*(<[^>]*>|[^)\s]+)')  # [text](target) and images

def excluded(path):
    p = os.path.normpath(path).replace('\\', '/')
    return any(p == os.path.normpath(e).replace('\\', '/') or
               p.startswith(os.path.normpath(e).replace('\\', '/') + '/')
               for e in EXCLUDE)

def strip_code(text):
    # drop fenced blocks (``` or ~~~) then inline `code` spans, so example links inside don't count
    out, fence = [], None
    for line in text.split('\n'):
        s = line.lstrip()
        if fence:
            if s.startswith(fence):
                fence = None
            out.append('')            # keep line numbers aligned
        elif s.startswith('```') or s.startswith('~~~'):
            fence = s[:3]
            out.append('')
        else:
            out.append(re.sub(r'`[^`]*`', '', line))
    return '\n'.join(out)

bad = 0
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if not excluded(os.path.join(root, d)) and d != '.git']
    for name in files:
        if not name.endswith('.md'):
            continue
        fpath = os.path.join(root, name)
        if excluded(fpath):
            continue
        with open(fpath, encoding='utf-8', errors='replace') as fh:
            raw = fh.read()
        clean = strip_code(raw)
        base = os.path.dirname(fpath)          # <-- resolve against the LINKING FILE's dir, not cwd
        for m in re.finditer(LINK, clean):
            target = m.group(1).strip('<>')
            if re.match(r'[a-z][a-z0-9+.-]*:', target, re.I) or target.startswith('//'):
                continue                       # http(s)://, mailto:, tel:, protocol-relative
            filepart = target.split('#', 1)[0].split('?', 1)[0]
            if not filepart:
                continue                       # pure #anchor self-link
            resolved = os.path.normpath(os.path.join(base, filepart))
            if not os.path.exists(resolved):
                line = clean.count('\n', 0, m.start()) + 1
                print(f'{fpath}:{line}: BROKEN -> {target}')
                bad += 1
sys.exit(1 if bad else 0)
```

Handled by design: `./`-relative, `../`-relative, and bare-sibling links (all dirname-resolved); anchors (`file.md#sec` checks the file part only, pure `#anchor` skipped); query suffixes (`?`); absolute URLs and `mailto:`/`tel:` skipped; images (`![alt](src)`) checked; fenced **and** inline code stripped so `{{PLACEHOLDER}}` example links don't fire. Pass every dir that holds intentional template/example paths as an exclude arg. **Do not** substitute a `grep | while read` shell version — it reintroduces the cwd-resolution bug this file exists to close.

## Command Semantics Remap

| Command | Meaning here |
|---|---|
| `review-pr` | Grounding review: claims sourced, freshness fields updated, governance respected |
| `tech-debt` | Rot report: stale `verified:` dates, index drift, link rot, orphaned docs |
| `update-context` | Unchanged — context files need the same freshness as any repo |
| `deploy` | Never — skip the command and the skill |

## Template Classes Skipped

- Frontend/api/database/testing rules → replaced by ONE corpus-conventions rule (naming, frontmatter, citation, freshness)
- `deployment` / `migration` / `debug` / `refactor` skills → out (no runtime)
- `seo-auditor` / `security-auditor` / `tester` agents → out unless the corpus has that dimension (`i18n-validator` MAY stay for multilingual corpora)
- MCP: GitHub yes; DB connectors no; Context7 optional (only if docs discuss library APIs)

## Docs-First Rule Set (for the base rule)

```markdown
## DOCS-FIRST PROTOCOL
- Single source of truth per fact — link to it, never restate it
- Ledgers are append-only — never edit an existing entry, add a new one
- Date-stamped claims carry `verified:` — a claim without a date is an opinion
- No orphan docs — every new doc gets an index row in the same commit
- Archive, don't delete — superseded docs move to the corpus's archive location
```

## Key Files to Check During Analysis

```
README.md / *INDEX*      # Navigation roots — the corpus map source
DECISIONS.md / ledgers   # Governance artifacts — append-only discipline
docs/ (or dominant dir)  # Bulk of the corpus — sample for conventions
.github/                 # Any existing CI on markdown (link checkers, linters)
```
