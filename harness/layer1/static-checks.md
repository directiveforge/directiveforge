# Layer 1 — Static Checks (implements L1.1)

> Metric: **L1.1 Static-gate PASS rate** per HARNESS-SPEC §4. Serialize per §10.
> Executed by a scorer subagent against ONE target directory. Every check is PASS/FAIL,
> mechanical, copy-pasteable. No judgment calls. If a command needs a judgment call to
> interpret, it is a bug in this doc — do not improvise; record the check as INDETERMINATE
> and note it (INDETERMINATE counts as FAIL for the pack rate).
>
> Threats to validity: see HARNESS-SPEC §4 L1.1. Do not restate here.

## Scope preamble — which families apply to which targets

Run `TARGET=<abs path to the directory under test>` first. Determine the target type, then
run only the applicable check families. A family that does not apply is **excluded from the
denominator** and recorded in the run's `na_families` list (it is not a FAIL).

| Target type | How to detect | Applicable families |
|---|---|---|
| Skill pack (`templates/skills/*/`) | `find "$TARGET" -name SKILL.md \| grep -q .` | S (skills), J (JSON if any `.json` present) |
| Rule set (`.claude/rules/` or `templates/claude-code/rules/`) | dir holds `*.md`/`*.mdc`/`*.template` rule files | R (rules), J |
| Agent set (`.claude/agents/` or `templates/claude-code/agents/`) | dir holds agent `*.md`/`*.template` with `tools:` frontmatter | A (agents), J |
| Command set (`.claude/commands/`) | dir holds command `*.md` | C (commands), J |
| Generated install tree (`.claude/`) | contains ≥2 of the above subdirs | all present families, per-subdir, + T (tree-level, run from the project root holding `.ai-kit-manifest.json`) |

**Template vs install rule (governs the placeholder checks S6/R-null/A-null):** if the target
path contains `templates/`, `{{PLACEHOLDER}}` tokens are EXPECTED (this is source) — the
placeholder-leak check is **N/A** (record in `na_families`). If the target is an install tree
(no `templates/` segment), placeholder leaks are a FAIL. Decide once per run; do not mix.

**Empty-wrapper dirs** (a skill dir with no `SKILL.md`, e.g. an unpopulated pack slot): record
the dir in `empty_dirs`, score 0 checks against it, exclude from every denominator. It is neither
PASS nor FAIL — it is a structural note surfaced in the scorecard.

Enumerate artifacts once:

```bash
SKILLS=$(find "$TARGET" -name SKILL.md 2>/dev/null)
RULES=$(find "$TARGET" -maxdepth 1 \( -name '*.md' -o -name '*.mdc' -o -name '*.md.template' -o -name '*.mdc.template' \) 2>/dev/null)
AGENTS=$(grep -rlE '^tools:' "$TARGET" --include='*.md' --include='*.template' 2>/dev/null)
JSONS=$(find "$TARGET" -name '*.json' 2>/dev/null)
```

---

## Family S — Skills (one score row per `SKILL.md`)

For each `S=<path to SKILL.md>`, `DIR=$(basename "$(dirname "$S")")`, `FM` = frontmatter block
(lines between the first two `---`). Extract once:

```bash
FM() { awk 'f==1&&/^---[[:space:]]*$/{exit} /^---[[:space:]]*$/{f=1;next} f==1' "$1"; }
BODY() { awk 'c<2{if(/^---[[:space:]]*$/)c++;next} 1' "$1"; }
```

- **S1 — frontmatter fields present.** PASS iff all five keys appear in `FM "$S"`.
  ```bash
  for k in name description severity confidence surface; do FM "$S" | grep -qE "^$k:" || echo "FAIL S1 missing:$k"; done
  ```
  PASS = no output.
- **S2 — name matches dir slug.** PASS iff frontmatter `name:` value equals `$DIR`.
  ```bash
  N=$(FM "$S" | awk -F': *' '/^name:/{print $2;exit}'); [ "$N" = "$(basename "$(dirname "$S")")" ] || echo "FAIL S2 $N"
  ```
- **S3 — numbered Procedure steps.** PASS iff a `## Procedure` (or `## Steps`) section exists and
  contains ≥3 lines matching `^[0-9]+\.` in the body.
  ```bash
  BODY "$S" | grep -qiE '^##+ +(Procedure|Steps)' && [ "$(BODY "$S" | grep -cE '^[0-9]+\. ')" -ge 3 ] || echo "FAIL S3"
  ```
- **S4 — Gotchas ≥2 items.** PASS iff a `## Gotchas` section exists and has ≥2 bullet items.
  ```bash
  awk '/^##+ +Gotchas/{f=1;next} f&&/^##+ /{f=0} f&&/^[-*] /{n++} END{exit !(n>=2)}' "$S" || echo "FAIL S4"
  ```
- **S5 — When-NOT section present.** PASS iff a heading matching `When NOT` exists.
  ```bash
  grep -qiE '^##+ +When NOT' "$S" || echo "FAIL S5"
  ```
- **S6 — placeholder hygiene** (N/A when target under `templates/`). PASS iff no `{{...}}` token
  in the file.
  ```bash
  grep -qE '\{\{[^}]+\}\}' "$S" && echo "FAIL S6" || true
  ```

## Family R — Rules (one row per rule file)

Content lines = lines after the closing frontmatter `---` (or all lines if no frontmatter).
Classify each rule: **router/dispatch class** iff basename matches
`decision-skills|naming-skills|design-skills|ai-workflow|orchestrator-dispatch` (per generator
§3.3) — else **base** iff basename starts `base`, else **domain**.

```bash
CONTENT() { awk 'BEGIN{c=0} c>=2{print;next} /^---[[:space:]]*$/{c++}' "$1" | grep -cvE '^[[:space:]]*$'; }
# CONTENT counts non-blank content lines. If file has no frontmatter, c never reaches 2 → falls through: use fallback below.
CLINES() { if head -1 "$1" | grep -qE '^---'; then CONTENT "$1"; else grep -cvE '^[[:space:]]*$' "$1"; fi; }
```

- **R1 — line ceiling.** base ≤30, domain ≤40, router/dispatch ≤100 content lines.
  ```bash
  L=$(CLINES "$R"); case "$CLASS" in base) M=30;; domain) M=40;; router) M=100;; esac; [ "$L" -le "$M" ] || echo "FAIL R1 $L>$M"
  ```
- **R2 — router/dispatch never alwaysApply.** Applies to router class only. PASS iff no
  `alwaysApply: true` in frontmatter. (For base/domain this check is N/A — record, do not score.)
  ```bash
  [ "$CLASS" = router ] && { grep -qE '^alwaysApply:[[:space:]]*true' "$R" && echo "FAIL R2"; } || true
  ```
- **R3 — placeholder hygiene** (N/A under `templates/`, same rule as S6).
  ```bash
  grep -qE '\{\{[^}]+\}\}' "$R" && echo "FAIL R3" || true
  ```

## Family A — Agents (one row per agent file)

- **A1 — one-sentence role.** PASS iff the `**Role**:` line (or the `description:` frontmatter
  value) contains ≤1 sentence-terminating `. `/`.\n`. Mechanical proxy: ≤1 period followed by a
  space or EOL in the role line.
  ```bash
  ROLE=$(grep -m1 -E '^\*\*Role\*\*:' "$AG" || FM "$AG" | grep -m1 -E '^description:'); \
  [ "$(printf '%s' "$ROLE" | grep -oE '\. ' | wc -l)" -le 1 ] || echo "FAIL A1"
  ```
- **A2 — Constraints with NEVER/ALWAYS.** PASS iff `## Constraints` exists AND at least one
  `NEVER` and one `ALWAYS` appear under it.
  ```bash
  grep -qE '^##+ +Constraints' "$AG" && grep -qE '\bNEVER\b' "$AG" && grep -qE '\bALWAYS\b' "$AG" || echo "FAIL A2"
  ```
- **A3 — tool access declared.** PASS iff frontmatter `tools:` present OR a `## Tools` section
  lists tools.
  ```bash
  FM "$AG" | grep -qE '^tools:' || grep -qE '^##+ +Tools' "$AG" || echo "FAIL A3"
  ```
- **A4 — no unqualified Bash grant.** If `Bash` appears as a granted tool (frontmatter `tools:`
  line or a `## Tools` bullet), it MUST name command families in parentheses/backticks on that
  same grant OR the file body must scope Bash to named commands. An unqualified bare `Bash` = FAIL.
  ```bash
  GRANT=$(FM "$AG" | grep -E '^tools:'; grep -A20 -E '^##+ +Tools' "$AG"); \
  if printf '%s' "$GRANT" | grep -qE '\bBash\b'; then \
    printf '%s' "$GRANT" | grep -E '\bBash\b' | grep -qE 'Bash *[(:`]' || echo "FAIL A4 unqualified-bash"; fi
  ```
  PASS if Bash is not granted at all, or every Bash grant is followed by `(`, `:`, or `` ` ``
  introducing a command list. Manual confirm the named families are read-only-appropriate is a
  L1.4 concern, not L1.1.
- **A5 — placeholder hygiene** (N/A under `templates/`).

## Family C — Commands (one row per command file)

- **C1 — numbered sequential steps, no duplicates.** PASS iff the file has ≥1 line matching
  `^[0-9]+\.` AND the sequence of those numbers is strictly increasing with no repeats.
  ```bash
  NUMS=$(grep -oE '^[0-9]+\.' "$CMD" | tr -d '.'); \
  [ -n "$NUMS" ] && [ "$(printf '%s\n' $NUMS | sort -n | uniq | wc -l)" -eq "$(printf '%s\n' $NUMS | wc -l)" ] \
    && [ "$(printf '%s\n' $NUMS)" = "$(printf '%s\n' $NUMS | sort -n)" ] || echo "FAIL C1"
  ```
  Fails on a duplicated step number or out-of-order numbering. Commands with prose-only steps
  (no numbered list) are N/A for C1 — record in `na_families`.

## Family T — Install-tree lifecycle checks (one row per install tree)

Applies ONLY to the "Generated install tree" target type. `ROOT` = the project root containing
`.ai-kit-manifest.json` (checks are N/A — recorded, not scored — when no manifest exists).
Added forward-only on 2026-07-12 (ux-lifecycle; see the dated HARNESS-SPEC addendum) — check-pack
growth per the §18–§23 precedent, no re-grading of runs scored before that date.

- **T1 — IDE-scope purity.** PASS iff every surface directory present in the tree is licensed by
  the manifest's `ide_scope` (Phase 3.4 single-scope default: the second surface is never
  installed silently).
  ```bash
  python3 - "$ROOT" <<'EOF'
  import json, os, sys
  root = sys.argv[1]
  scope = json.load(open(os.path.join(root, '.ai-kit-manifest.json'))).get('ide_scope', [])
  for ide, d in (('cursor', '.cursor'), ('claude-code', '.claude')):
      p = os.path.join(root, d)
      if ide not in scope and os.path.isdir(p) and any(fs for _, _, fs in os.walk(p)):
          print(f'FAIL T1 {d} present but "{ide}" not in ide_scope')
  EOF
  ```
  PASS = no output.

- **T2 — first artifact present.** PASS iff the Phase 1.7 codebase brief exists non-empty.
  ```bash
  [ -s "$ROOT/docs/AI-WORKFLOW-BRIEF.md" ] || echo "FAIL T2 missing-or-empty brief"
  ```
- **T3 — checkpoint cleaned up.** PASS iff the Run Protocol scratch file is absent after a
  completed run (it is JSON Lines while it lives — never gate it on `json.tool`).
  ```bash
  [ ! -f "$ROOT/.df-setup-state.json" ] || echo "FAIL T3 stale checkpoint"
  ```

## Family J — JSON artifacts (one row per `.json`)

- **J1 — strict parse.** PASS iff the file parses.
  ```bash
  python3 -m json.tool < "$JF" > /dev/null 2>&1 && echo PASS || echo "FAIL J1"
  ```

---

## Scoring — emit metric L1.1

Static-gate PASS rate is computed at two grains and serialized per HARNESS-SPEC §10.

- **Per artifact:** `pass_rate = passed / (passed + failed)`. N/A checks excluded. An artifact
  with all-N/A checks (e.g. empty wrapper dir) is not scored — it goes to `empty_dirs`.
- **Per pack:** micro-average — `sum(passed across all artifacts) / sum(passed+failed)`. This
  weights by check count, not by artifact, so a skill contributes its ~6 checks and a JSON its 1.

Serialize one object per artifact plus a pack roll-up:

```json
{
  "metric": "L1.1",
  "target": "templates/skills/decision/",
  "spec_version": "1.0",
  "na_families": ["S6 (template source)"],
  "empty_dirs": ["brand-naming"],
  "artifacts": [
    {"path": "pre-mortem/SKILL.md", "class": "skill",
     "checks": {"S1":"PASS","S2":"PASS","S3":"PASS","S4":"PASS","S5":"PASS"},
     "na": ["S6"], "passed": 5, "failed": 0, "pass_rate": 1.0}
  ],
  "pack": {"passed": 57, "failed": 3, "pass_rate": 0.95}
}
```

`pass_rate` is a raw proportion (honest-numbers doctrine §2.1) — no rounding to a marketing
figure. Letter grades are NOT computed here (deferred to `harness/SCORECARD-FORMAT.md`).
Any FAIL is filed as an L1.1 defect with the failing check id, the artifact path, and the
command's output line — never silently tuned away (HARNESS-SPEC §2.3).
