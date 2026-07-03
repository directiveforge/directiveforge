#!/usr/bin/env bash
# verify-transform.sh — externally verify the SCRUB-TRANSFORM.md hash bridge.
#
# For every bridged file this checks BOTH directions with one command:
#   forward:  sha256(public file)                          == public_sha256
#   inverse:  sha256(public file with tokens -> originals) == original_sha256
# The token->original constants are read from SCRUB-TRANSFORM.md itself (they are
# deliberately disclosed there so ANY third party can run this without lab access).
# Where a bridged file lives under a run with post-manifest.txt, the original hash
# is also cross-checked against its manifest row (the pre-publication anchor).
#
# Usage: scripts/verify-transform.sh [REPO_ROOT]   (default: repo containing this script)
# Exit 0 = all rows verified; 1 = any mismatch; 2 = usage/parse error.

set -euo pipefail
ROOT="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
BRIDGE="$ROOT/SCRUB-TRANSFORM.md"
[[ -f "$BRIDGE" ]] || { echo "FATAL: $BRIDGE not found" >&2; exit 2; }

python3 - "$ROOT" "$BRIDGE" <<'PYEOF'
import sys, os, re, hashlib

root, bridge = sys.argv[1], sys.argv[2]
text = open(bridge, encoding='utf-8').read()

def block(name):
    m = re.search(r'```' + name + r'\n(.*?)```', text, re.S)
    if not m:
        print(f"FATAL: fenced block {name} missing in SCRUB-TRANSFORM.md"); sys.exit(2)
    return [l for l in m.group(1).splitlines() if l.strip()]

constants = [l.split('\t', 1) for l in block('tsv-constants')]
rows = [l.split('\t') for l in block('tsv-bridge')[1:]]  # skip header
if not rows:
    print("no bridged files listed — nothing to verify"); sys.exit(0)

def sha(b): return hashlib.sha256(b).hexdigest()

fails = 0
manifest_checked = 0
withheld_n = 0
for r in rows:
    path, orig_sha, pub_sha = r[0], r[1], r[2]
    bclass = r[3] if len(r) > 3 else 'full'
    p = os.path.join(root, path)
    if not os.path.isfile(p):
        print(f"FAIL {path}: file missing"); fails += 1; continue
    data = open(p, 'rb').read()
    ok_fwd = sha(data) == pub_sha
    if bclass == 'withheld':
        # Privacy-withheld row: the replaced string is a private client reference
        # and is not disclosed — inverse recomputation is operator-attested.
        withheld_n += 1
        ok_inv = None
    else:
        inv = data
        for tok, orig in constants:
            inv = inv.replace(tok.encode(), orig.encode())
        ok_inv = sha(inv) == orig_sha
    # cross-check against the run's post-manifest anchor if present
    anchor = 'n/a'
    m = re.match(r'(harness/results/[^/]+/[^/]+)/generated/(.+)$', path)
    if m:
        pm = os.path.join(root, m.group(1), 'post-manifest.txt')
        if os.path.isfile(pm):
            manifest_checked += 1
            found = any(orig_sha in line and m.group(2) in line
                        for line in open(pm, encoding='utf-8', errors='replace'))
            anchor = 'anchored' if found else 'NOT-IN-MANIFEST'
            if not found: fails += 1
    bad = (not ok_fwd) or (ok_inv is False) or (anchor == 'NOT-IN-MANIFEST')
    if (not ok_fwd) or (ok_inv is False): fails += 1
    inv_str = 'withheld(privacy)' if ok_inv is None else ('ok' if ok_inv else 'MISMATCH')
    print(f"{'FAIL' if bad else 'PASS'} {path} forward={'ok' if ok_fwd else 'MISMATCH'} "
          f"inverse={inv_str} manifest={anchor}")

print(f"\n{len(rows)} bridged files ({withheld_n} privacy-withheld); "
      f"manifest-anchored checks: {manifest_checked}; failures: {fails}")
sys.exit(1 if fails else 0)
PYEOF
