#!/usr/bin/env bash
# build-snapshot.sh — assemble the leak-clean PUBLIC snapshot of the kit (v0.20.0 W2).
#
# Pipeline: git archive HEAD -> prune (launch/snapshot-exclude.txt) -> sed-sanitize
# ONLY files listed in launch/snapshot-sanitize.txt -> emit SCRUB-TRANSFORM.md (hash
# bridge, one-command reproducible) + PROVENANCE.md -> scrub gate (0 hits required)
# -> dangling-reference check -> git init + single commit + tag.
#
# The operator pattern list (launch/private/scrub-patterns.txt) and the sed map
# (launch/private/sanitize-map.sed) are OPERATOR-HELD and never ship: launch/ is
# excluded from the snapshot wholesale.
#
# Usage: scripts/build-snapshot.sh [STAGE_DIR]
#   STAGE_DIR default: ./launch/stage/directiveforge-public (recreated fresh each run)
# Exit: 0 = snapshot built and gated; non-zero = any step failed (script is set -e).

set -euo pipefail

KIT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$KIT"

EXCLUDE_LIST="launch/snapshot-exclude.txt"
SANITIZE_LIST="launch/snapshot-sanitize.txt"
SED_MAP="launch/private/sanitize-map.sed"
PATTERNS="launch/private/scrub-patterns.txt"
STAGE="${1:-$KIT/launch/stage/directiveforge-public}"
TAG="v0.20.0-public"

for f in "$EXCLUDE_LIST" "$SANITIZE_LIST" "$SED_MAP" "$PATTERNS" scripts/scrub-check.py scripts/scrub-allowlist.txt; do
  [[ -f "$f" ]] || { echo "FATAL: missing $f" >&2; exit 2; }
done

# 1. Clean-tree precondition (tracked files only enter the archive; dirty tree means
#    the snapshot would not correspond to a commit).
if [[ -n "$(git status --porcelain)" ]]; then
  echo "FATAL: working tree not clean — commit first (snapshot must equal a commit)." >&2
  exit 2
fi
HEAD_SHA="$(git rev-parse HEAD)"

# 2. Stage from git archive (tracked files only; .claude/, junk never tracked).
rm -rf "$STAGE"; mkdir -p "$STAGE"
git archive HEAD | tar -x -C "$STAGE"
echo "staged $(find "$STAGE" -type f | wc -l | tr -d ' ') files from $HEAD_SHA"

# 3. Prune per exclude list (paths or globs relative to repo root).
while IFS= read -r line; do
  line="${line%%#*}"; line="$(echo "$line" | xargs)"; [[ -z "$line" ]] && continue
  # shellcheck disable=SC2086
  (cd "$STAGE" && rm -rf $line)
done < "$EXCLUDE_LIST"
echo "pruned per $EXCLUDE_LIST -> $(find "$STAGE" -type f | wc -l | tr -d ' ') files remain"

# 4. Sanitize ONLY the enumerated files; collect hash bridge for BRIDGE-marked rows.
BRIDGE_TSV="$(mktemp)"
SANITIZED=0
while IFS= read -r raw; do
  raw="${raw%%#*}"; [[ -z "$(echo "$raw" | xargs)" ]] && continue
  path="$(echo "$raw" | awk -F'\t' '{print $1}' | xargs)"
  marker="$(echo "$raw" | awk -F'\t' '{print $2}' | xargs)"
  src="$STAGE/$path"
  if [[ ! -f "$src" ]]; then echo "FATAL: sanitize-list path missing in stage: $path" >&2; exit 2; fi
  pre_sha="$(shasum -a 256 "$src" | awk '{print $1}')"
  sed -E -i '' -f "$SED_MAP" "$src"
  post_sha="$(shasum -a 256 "$src" | awk '{print $1}')"
  if [[ "$pre_sha" == "$post_sha" ]]; then
    echo "WARN: sanitize produced no change: $path (rule drift? verify manually)" >&2
  fi
  if [[ "$marker" == "BRIDGE" ]]; then
    printf '%s\t%s\t%s\tfull\n' "$path" "$pre_sha" "$post_sha" >> "$BRIDGE_TSV"
  elif [[ "$marker" == "BRIDGE-WITHHELD" ]]; then
    # Privacy-withheld bridge row: the file contained a private client reference
    # that the privacy absolute forbids disclosing even as a transform constant.
    # Forward hash + post-manifest anchor stay verifiable; inverse is withheld.
    printf '%s\t%s\t%s\twithheld\n' "$path" "$pre_sha" "$post_sha" >> "$BRIDGE_TSV"
  fi
  SANITIZED=$((SANITIZED+1))
done < "$SANITIZE_LIST"
echo "sanitized $SANITIZED files ($(wc -l < "$BRIDGE_TSV" | tr -d ' ') hash-bridged)"

# 5. Public .gitignore replaces the lab one (which references private-only paths).
cat > "$STAGE/.gitignore" <<'EOF'
.DS_Store
__pycache__/
node_modules/
EOF

# 5b. case-studies/ ships as an EMPTY directory with a stub README: the kit's
#     architecture legitimately references it (multidomain principle — project-
#     specific content lives there, never in the main kit); the lab's own worked
#     instances are private and stay in the lab.
mkdir -p "$STAGE/case-studies"
cat > "$STAGE/case-studies/README.md" <<'EOF'
# case-studies/

Project-specific worked instances live here — the kit's **multidomain principle**
keeps the main kit project-agnostic, and everything tied to one real project goes
in this directory instead of into knowledge-base/, templates/, or generator/.

In this public snapshot the directory is empty: the lab's own worked instances
document private client work and are not published. When you adopt the kit, your
own project's worked instances (post-install notes, migration records, project
research dossiers) belong here, one subdirectory per project.

Nothing in the kit reads this directory at generation time — the generator and
templates never depend on its contents.
EOF

# 6. SCRUB-TRANSFORM.md — self-contained, one-command reproducible hash bridge
#    (operator decision #1, 2026-07-03: the original path constants are disclosed
#    HERE so any external person can invert the transform and recompute hashes).
#    Constants are extracted from the sed map's TRANSFORM-CONSTANT markers.
python3 - "$KIT" "$STAGE" "$BRIDGE_TSV" "$SED_MAP" "$HEAD_SHA" <<'PYEOF'
import sys, os, re, datetime
kit, stage, bridge_tsv, sed_map, head = sys.argv[1:6]
# Constants: lines in the sed map annotated `# TRANSFORM-CONSTANT: <TOKEN> = <original>`
constants = []
for line in open(os.path.join(kit, sed_map)):
    m = re.match(r'#\s*TRANSFORM-CONSTANT:\s*(\S+)\s*=\s*(.+)$', line.strip())
    if m:
        constants.append((m.group(1), m.group(2)))
rows = [l.rstrip('\n').split('\t') for l in open(bridge_tsv)] if os.path.getsize(bridge_tsv) else []
out = os.path.join(stage, 'SCRUB-TRANSFORM.md')
with open(out, 'w') as f:
    f.write("# SCRUB-TRANSFORM — reproducible hash bridge\n\n")
    f.write("Files under `harness/results/**/generated/` are hash-anchored by their run's\n")
    f.write("`post-manifest.txt`. Publishing required replacing machine-local path constants;\n")
    f.write("this file makes that transform **externally reproducible with one command**: the\n")
    f.write("exact original constants are disclosed below (operator-approved, 2026-07-03 —\n")
    f.write("they contain no client data), so anyone can invert the transform and recompute\n")
    f.write("both hashes. Verify everything: `scripts/verify-transform.sh`.\n\n")
    f.write("## Transform constants (token -> original string)\n\n```tsv-constants\n")
    for tok, orig in constants:
        f.write(f"{tok}\t{orig}\n")
    f.write("```\n\n")
    f.write("Reproduce an original file from its public copy (single command):\n\n")
    f.write("```sh\n# for each bridge_class=full row below:\nsed " + " ".join(
        f"-e 's|{tok}|{orig}|g'" for tok, orig in constants) + " <public-file> | shasum -a 256\n")
    f.write("# -> must equal original_sha256 (the value anchored in the run's post-manifest.txt)\n```\n\n")
    f.write("**Privacy-withheld rows** (`bridge_class=withheld`): these files contained a\n")
    f.write("reference to private client material; the replaced string is NOT disclosed (the\n")
    f.write("privacy rule protecting clients overrides reproducibility for exactly these rows).\n")
    f.write("Their forward hash (public_sha256) and their original_sha256 anchor in the run's\n")
    f.write("post-manifest.txt remain verifiable; the inverse recomputation is operator-attested.\n\n")
    f.write(f"Private-repo release commit: `{head}`\n")
    f.write(f"Generated: {datetime.date.today().isoformat()}\n\n")
    f.write("## Bridged files\n\n```tsv-bridge\n")
    f.write("path\toriginal_sha256\tpublic_sha256\tbridge_class\n")
    for r in rows:
        f.write("\t".join(r) + "\n")
    f.write("```\n")
    withheld = sum(1 for r in rows if len(r) > 3 and r[3] == 'withheld')
    print(f"bridge rows: {len(rows)} ({withheld} privacy-withheld)")
print(f"SCRUB-TRANSFORM.md: {len(constants)} constants, {len(rows)} bridged files")
PYEOF
rm -f "$BRIDGE_TSV"

# 7. PROVENANCE.md
FIXTURE_SHA_NOTE="853c653"
cat > "$STAGE/PROVENANCE.md" <<EOF
# PROVENANCE

This public repository is a **fresh-init snapshot** of a private research lab repo.
The lab's full git history is private (it contains client work the privacy rules
protect); everything measurable ships here.

- Private-repo release commit for this snapshot: \`$HEAD_SHA\`
- Snapshot built: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- \`fixture_sha\` values inside \`harness/results/**/run-metadata.json\` (e.g.
  \`$FIXTURE_SHA_NOTE\`) are PRIVATE-repo commit SHAs — they order pre-registration
  vs. measurement inside the lab history and are attested by the operator, not
  publicly resolvable. From v0.20.0 onward, all new pre-registration runs happen in
  THIS repository, so future proofs are publicly git-provable end to end.
- A small set of machine-local path constants was replaced before publication; the
  transform is **fully disclosed and one-command reproducible** — see
  \`SCRUB-TRANSFORM.md\` + \`scripts/verify-transform.sh\`. All other harness
  artifacts are byte-identical to the lab tree at the commit above.
- Frozen measured artifacts (\`harness/results/**\`, baseline runner records)
  predate the public name and carry the kit's pre-launch working title and the
  \`.ai-kit-manifest.json\` filename — historical fidelity, not a second brand
  (see \`NAMING-DECISION.md\` §5).
- Attestation: the operator attests this snapshot content equals the lab tree at
  \`$HEAD_SHA\` modulo exactly (a) the exclusions listed in the lab's snapshot
  manifest (private client material and launch-ops files) and (b) the disclosed
  transforms. Bound to the annotated tag \`$TAG\`.
EOF

# 8. Scrub gate — external operator patterns REQUIRED; 0 hits or the build fails.
echo "--- scrub gate ---"
python3 scripts/scrub-check.py "$STAGE" \
  --patterns "$PATTERNS" --require-external \
  --allow scripts/scrub-allowlist.txt
echo "scrub gate: PASS (0 hits)"

# 9. Dangling-reference check: no shipped file references excluded paths.
#    Token list is OPERATOR-HELD (it names private files) — this shipped script
#    stays token-free.
echo "--- dangling-reference check ---"
DANGLE_TOKENS="launch/private/dangling-tokens.txt"
[[ -f "$DANGLE_TOKENS" ]] || { echo "FATAL: missing $DANGLE_TOKENS" >&2; exit 2; }
DANGLE_RC=0
while IFS= read -r token; do
  token="${token%%#*}"; token="$(echo "$token" | xargs)"; [[ -z "$token" ]] && continue
  hits="$(grep -rn --exclude-dir=.git -F "$token" "$STAGE" || true)"
  if [[ -n "$hits" ]]; then
    echo "DANGLING REFERENCE to excluded '$token':" >&2; echo "$hits" >&2; DANGLE_RC=1
  fi
done < "$DANGLE_TOKENS"
[[ $DANGLE_RC -eq 0 ]] || { echo "FATAL: dangling references to excluded paths." >&2; exit 1; }
# The operator-held directory must be structurally absent from the snapshot.
[[ ! -e "$STAGE/launch" ]] || { echo "FATAL: launch/ leaked into the stage." >&2; exit 1; }
echo "dangling-reference check: PASS"

# 10. Fresh repo: single commit + annotated tag. Author uses noreply email
#     (operator decision #3); name stays visible.
cd "$STAGE"
git init -q
git add -A
# The noreply identity must cover the COMMIT and the TAG OBJECT alike (annotated
# tags carry the tagger identity — W5 V-A caught the personal email leaking there).
PUB_EMAIL="${PUBLIC_GIT_EMAIL:-$(git config user.name | tr ' ' '.')@users.noreply.github.com}"
export GIT_AUTHOR_EMAIL="$PUB_EMAIL" GIT_COMMITTER_EMAIL="$PUB_EMAIL"
git commit -q -m "DirectiveForge v0.20.0 — first public release

Fresh-init snapshot of the private lab at $HEAD_SHA (see PROVENANCE.md).
Measured, not claimed: harness/results/ carries the baseline F grades and
the re-measured deltas on frozen instruments."
git tag -a "$TAG" -m "DirectiveForge v0.20.0 public snapshot (lab commit $HEAD_SHA)"
unset GIT_AUTHOR_EMAIL GIT_COMMITTER_EMAIL
TREE_HASH="$(git rev-parse 'HEAD^{tree}')"
echo "snapshot committed: $(git rev-parse HEAD) tree=$TREE_HASH tag=$TAG"

# 11. Release ledger row (private).
cd "$KIT"
mkdir -p launch
touch launch/RELEASES.md
if ! grep -q "^# RELEASES" launch/RELEASES.md 2>/dev/null; then
  printf '# RELEASES — public snapshot ledger (private)\n\n| date | tag | private SHA | public tree hash | stage |\n|---|---|---|---|---|\n' > launch/RELEASES.md
fi
printf '| %s | %s | %s | %s | %s |\n' "$(date -u +%Y-%m-%d)" "$TAG" "$HEAD_SHA" "$TREE_HASH" "$STAGE" >> launch/RELEASES.md
echo "DONE. Stage: $STAGE"
