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
