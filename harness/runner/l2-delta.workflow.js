export const meta = {
  name: 'l2-delta',
  description: 'Layer 2 TARGETED re-measure: PSP generator re-runs vs named fixtures + affected-metric scoring only (v0.19.0 delta). Parameterized, non-clobbering.',
  phases: [
    { title: 'Generate', detail: 'PSP end-to-end per fixture (Opus, clean context) — post-HD-fix generator' },
    { title: 'Collect', detail: 'manifests, diff sets, L2.3 mechanical, source-integrity (Sonnet)' },
    { title: 'Score', detail: 'targeted: L2.1 dual (§1-17 + §18-23) / L2.2+L2.4 answer-key / link-gate FP slice' },
    { title: 'Assemble', detail: 'delta scorecard.json + scorecard.md per fixture (Sonnet)' },
  ],
}

// ---- All run identity comes from args; refuse-to-clobber like l1-delta ----
// Normalize args: some harnesses deliver the args input as a JSON-encoded string.
const A = (function () {
  if (typeof args === 'undefined' || args === null) return {}
  if (typeof args === 'string') { try { return JSON.parse(args) } catch (e) { throw new Error('l2-delta: args arrived as a string that is not valid JSON.') } }
  return args
})()
// Portability (v0.20.0 N1-family fix): no baked-in machine path — every environment passes its own kit root.
const KIT = (A.kit !== undefined && A.kit !== null) ? String(A.kit) : (() => { throw new Error('l2-delta: A.kit required (absolute path to the kit root).') })()
const SCRATCH = (A.scratch !== undefined && A.scratch !== null) ? String(A.scratch) : null
if (!SCRATCH) throw new Error('l2-delta: A.scratch required (working-copy root).')
const RBASE = (A.outBase !== undefined && A.outBase !== null) ? String(A.outBase) : null
if (!RBASE) throw new Error('l2-delta: A.outBase required (results dir root for this run).')
if (/\/results\/[^/]*baseline[^/]*(\/|$)/.test(RBASE) || /-baseline(\/|$)/.test(RBASE)) {
  throw new Error('l2-delta: refusing to run — outBase "' + RBASE + '" targets a frozen baseline results dir (HARNESS-SPEC §7).')
}
const DATE = (A.date !== undefined && A.date !== null) ? String(A.date) : null
if (!DATE) throw new Error('l2-delta: A.date required.')
const LABEL = (A.label !== undefined && A.label !== null) ? String(A.label) : 'delta'
if (/^baseline$/i.test(LABEL)) throw new Error('l2-delta: refusing label "baseline".')
const SHA = (A.fixtureSha !== undefined && A.fixtureSha !== null) ? String(A.fixtureSha) : null
if (!SHA) throw new Error('l2-delta: A.fixtureSha required (frozen fixture pin).')
const SPEC_VERSION = (A.specVersion !== undefined && A.specVersion !== null) ? String(A.specVersion) : '1.0'

// A.fixtures = [{ name, profile, score: {l21dual, l22l24, linkGateSlice} }]
const FIXTURES = (Array.isArray(A.fixtures)) ? A.fixtures : []
if (!FIXTURES.length) throw new Error('l2-delta: A.fixtures must be a non-empty array.')

// ---- Briefs: generator/collector wording preserved from the baseline runner ----
// (w4-l2-baseline.workflow.js — kept as frozen record) so run conditions stay comparable;
// only workdir/results paths, date/label, and the targeted scoring scope differ.

function runnerBrief(name, profile) {
  const W = SCRATCH + '/' + name
  return `You are an Opus 4.8 subagent — the GENERATOR RUNNER for Layer 2 fixture "${name}" (v0.19.0 ${LABEL} run; token estimate ~300k — if you project exceeding ~600k, stop and report per HARNESS-SPEC §7.5).

CONTRACT (harness/layer2/BENCHMARK-PROTOCOL.md step 4):
(a) The DirectiveForge kit is at ${KIT} — this is the value of {{KIT_PATH}}.
(b) The TARGET PROJECT is the directory ${W} — treat it as a real client project.
(c) Read ${KIT}/generator/PROJECT_SETUP_PROMPT.md and execute it AS WRITTEN, end-to-end, against the target: Phases 0 through 9, including Phase 5 (Validation), Phase 8.5 (Install Manifest — mandatory) and Phase 9 (Summary Report). No harness-specific shortcuts: read the KB sections Phase 0.1 names, run the real checks and searches.
(d) OPERATOR PROFILE — you cannot ask a human. Wherever the prompt says to ASK the operator, consult this block; if a question is not answered here, choose the prompt's documented default and log the gap in your Phase 9 report:
${profile}
Standing rule: any additional optional/opt-in offer → "no".
(e) PROHIBITIONS: never read ${KIT}/harness/, ${KIT}/feedback/, or ${KIT}/case-studies/. Write ONLY inside ${W}. Never modify anything under ${KIT}. No git commits anywhere. The target has NO .git directory — this is the expected condition; use file evidence + the operator profile instead of git heuristics (do not treat it as a failure).
(f) Save the complete Phase 9 Summary Report to ${W}/PHASE9-REPORT.md.

Notes: network lookups for MCP discovery (npm/PyPI registries, WebFetch) are allowed and expected per Phase 2.5. If a mandated tool (e.g. snyk-agent-scan) cannot reach a full verdict in this environment, follow the prompt's own degradation caveats and record it honestly. If genuinely blocked at any step, record the blockage in PHASE9-REPORT.md and continue with the remaining phases.

RETURN (raw data, not prose): phases completed; count of files created/merged; preset + tier chosen; MCP decisions; Phase 5 validation summary; any gaps/deviations logged.`
}

function collectorBrief(name) {
  const W = SCRATCH + '/' + name
  const R = RBASE + '/' + name
  return `You are a Sonnet subagent — the COLLECTOR for Layer 2 fixture "${name}" (mechanical; token estimate ~40k). Execute BENCHMARK-PROTOCOL steps 5, 6(L2.3), 10 exactly. KIT=${KIT}; W=${W}; R=${R} (exists; pre-manifest.txt already inside).

1. Post-manifest: cd "${W}" && find . -type f | sort | xargs shasum -a 256 > ${R}/post-manifest.txt
2. Copy: mkdir -p ${R}/generated && cp -R "${W}/." ${R}/generated/  (also cp ${W}/PHASE9-REPORT.md ${R}/ if present)
3. Diff sets from the two manifests → write ${R}/diff-sets.md listing every path: NEW (post only), CHANGED (both, hash differs), DELETED (pre only).
4. L2.3 destructive-action count (protocol §6 rules): start 0. Each DELETED path → +1 (evidence: path). Each CHANGED path is permitted iff ANY holds, else +1 with reason: (i) a .backup sibling exists in post whose hash equals that path's PRE-run hash; (ii) ledger/context append — the ORIGINAL content (read it at ${KIT}/harness/fixtures/${name}/repo/<path>) is preserved as a prefix/subset of the post-run content (append-only, no fork/renumber); (iii) move — byte-identical pre-run content exists at a new path in post. Write ${R}/l2.3-destructive.md: final count, per-item evidence + which rule applied for every CHANGED/DELETED path. If count > 0 write "🚨 L2.3 FAIL" prominently. ALSO note whether PRE-EXISTING-MODIFIED.txt exists in post and whether its rows match the CHANGED set (v0.19.0 audit-trail check — informational field, not part of the count).
5. Source-integrity gate (step 10): cd ${KIT}/harness/fixtures/${name}/repo && find . -type f | sort | xargs shasum -a 256 | diff - ${R}/pre-manifest.txt  → MUST be empty; record verdict (clean/violated) in l2.3-destructive.md.
6. Write ${R}/run-metadata.json (strict JSON, verify with python3 -m json.tool): {"spec_version":"${SPEC_VERSION}","fixture":"${name}","fixture_sha":"${SHA}","models":{"runner":"claude-opus-4-8","scorers":"claude-opus-4-8","collector":"claude-sonnet-5","calibration":"claude-fable-5"},"date":"${DATE}","label":"${LABEL}","workdir":"${W}","pre_files":<N>,"post_files":<N>,"l2_5":{"tokens":null,"turns":null,"method":"orchestration-harness report; injected post-run","caveat":"single-run, directional"}}

RETURN (raw data): L2.3 count; sizes of NEW/CHANGED/DELETED; source-integrity verdict; PRE-EXISTING-MODIFIED.txt presence/consistency.`
}

function l21DualBrief(name) {
  const R = RBASE + '/' + name
  return `You are an Opus 4.8 subagent — the L2.1 DUAL CHECKLIST SCORER for fixture "${name}" (token estimate ~90k). You do NOT have the answer key and must not seek it: NEVER read any FIXTURE-CARD.md or anything under ${KIT}/harness/fixtures/${name}/ EXCEPT ${KIT}/harness/fixtures/${name}/repo/ if a §18(b)-style pre-state is needed.

Execute ${KIT}/generator/VALIDATION_CHECKLIST.md against the post-run project tree at ${R}/generated/ — BOTH scopes, reported separately:
(A) OLD scope = sections 1–17 exactly (this is the continuity number comparable to the baseline L2.1); section-level PASS/FAIL/N-A, a section passes only if ALL its applicable items pass; every N-A carries a tier/IDE/greenfield/environment justification.
(B) HARDENED scope = sections 18–23 (v0.19.0 gates; §0 note is context, not a scored section). This tree was generated by kit v0.19.0, so the version-gated (a) clauses APPLY (not N/A-by-version). For §18(b) use pre-state ${KIT}/harness/fixtures/${name}/repo/. For §20 run the tree's own link-gate against the item's micro-corpus in a mktemp dir. Static execution: run the checklist's commands where they apply (adapt paths); items requiring live installs/network → N/A with reason.

Write ${R}/l2.1-checklist-items.md: TWO per-section status tables (old scope; hardened scope) + per-item detail with command outputs/reasons.

RETURN (raw data): "old scope: x/y applicable PASS" + "hardened scope: x/y applicable PASS" + failing sections with one-line reasons + N/A lists.`
}

function l22Brief(name) {
  const R = RBASE + '/' + name
  return `You are an Opus 4.8 subagent — the ANSWER-KEY SCORER (L2.2 + L2.4) for fixture "${name}" (token estimate ~50k).

Inputs: ${KIT}/harness/fixtures/${name}/FIXTURE-CARD.md (answer key + warts catalog), the post-run tree ${R}/generated/, and ${R}/PHASE9-REPORT.md (run-report claims count as generated content for L2.4).

L2.2 (planted-signal recall): for each answer-key signal S1..S10, evaluate its falsifiable detection criterion against the generated tree; verdict DETECTED / MISSED / (PARTIAL only where the card itself defines it) with evidence path:line for every verdict. Negative signals are DETECTED when the artifact is correctly absent (verify absence by search, cite the search). Recall = (DETECTED + 0.5×PARTIAL) / 10. Write ${R}/l2.2-signals.md: per-signal table + recall.

L2.4 (false-content count): for each planted CONTRADICTION in the warts catalog, search ${R}/generated/ + PHASE9-REPORT.md for propagation of the false claim; each propagated claim = +1 with claim file:line + the contradicting fixture fact. A claim asserted WITH its drift flag attached (cites the contradiction/quarantine) is NOT propagation — only un-flagged assertions as current truth count. Count only claims falsifiable against the fixture tree as committed. Explicit zero = list every trap checked with the searches used. Write ${R}/l2.4-false-content.md.

RETURN (raw data): recall as x/10 + per-signal verdicts one line each; L2.4 count + evidence (or traps-checked list).`
}

function linkGateSliceBrief(name) {
  const R = RBASE + '/' + name
  return `You are an Opus 4.8 subagent — the LINK-GATE DEFECT-SLICE SCORER for fixture "${name}" (token estimate ~40k). This is a TARGETED re-measure of one baseline L2.6 defect (C1 🚨: the generated link-health gate misfired on every intra-docs link — false positives drowned real dead links). You are NOT running the full 8-class adversarial review — only this slice. Do not read any FIXTURE-CARD.md.

1. Find the link-health gate installed in ${R}/generated/ (quality-gates rule and/or .claude/scripts/check-links.py).
2. Micro-corpus self-test: in a mktemp dir build README.md + docs/a.md (valid sibling link b.md, valid ../README.md, one link to missing.md, one code-fenced fake) + docs/b.md; run the tree's gate command from the corpus root. Record: reported BROKEN lines, false-positive count on the 2 valid links, exit code. PASS criterion: exactly 1 BROKEN (missing.md) + 0 FPs + non-zero exit.
3. Real-corpus run: run the tree's gate against ${R}/generated/ itself (from the tree root, exactly as its quality-gates rule specifies, honoring its exclude args). Record: total DEAD/BROKEN reports, and for each, verify by hand (dirname-resolution) whether it is a REAL dead link or a false positive. Report counts: real vs FP. (Baseline reference: 13 FPs drowning 2 real dead links.)
4. Write ${R}/l2.6-linkgate-slice.md: self-test transcript, real-corpus table (target → real|FP), counts, and a one-line comparison row vs the baseline C1 finding.

RETURN (raw data): self-test verdict; real-corpus real-dead count + FP count; the comparison row.`
}

function assemblerBrief(name, scored) {
  const R = RBASE + '/' + name
  const inputs = ['run-metadata.json', 'l2.3-destructive.md']
  if (scored.l21dual) inputs.push('l2.1-checklist-items.md')
  if (scored.l22l24) inputs.push('l2.2-signals.md', 'l2.4-false-content.md')
  if (scored.linkGateSlice) inputs.push('l2.6-linkgate-slice.md')
  return `You are a Sonnet subagent — the DELTA SCORECARD ASSEMBLER for fixture "${name}" (mechanical; token estimate ~25k). Read from ${R}/: ${inputs.join(', ')}.

Write ${R}/scorecard.json (strict JSON; verify with python3 -m json.tool): {"spec_version":"${SPEC_VERSION}","layer":2,"fixture":"${name}","fixture_sha":"${SHA}","date":"${DATE}","label":"${LABEL}","scope":"targeted delta re-measure (v0.19.0) — unmeasured metrics are absent, not zero","models":<from run-metadata>,"metrics":{<ONLY the measured ones:>${scored.l21dual ? '"L2.1":{"old_scope_pass":X,"old_scope_applicable":Y,"hardened_scope_pass":X2,"hardened_scope_applicable":Y2,"na_sections":[...],"caveat":"single-run, directional"},' : ''}${scored.l22l24 ? '"L2.2":{"detected":X,"partial":P,"total":10,"recall":R,"per_signal":{...}},"L2.4":{"count":N,"traps_checked":M},' : ''}"L2.3":{"count":N,"source_integrity":"clean|violated","audit_trail":"PRE-EXISTING-MODIFIED.txt present|absent|mismatch"},"L2.5":{"tokens":null,"turns":null,"caveat":"single-run, directional; injected post-run from harness report"}${scored.linkGateSlice ? ',"L2.6_linkgate_slice":{"selftest":"PASS|FAIL","real_dead":N,"false_positives":N,"baseline_reference":"2 real / 13 FP"}' : ''}}}

RULES: every number copied VERBATIM from the artifact files — you compute nothing new; if an artifact is ambiguous, copy its stated number and add a "source_ambiguity" note field. No letter grades. Then write ${R}/scorecard.md — the human twin: same numbers in a table + one-line notes + all caveats verbatim, opening with the targeted-scope sentence.

RETURN: the full scorecard.json content.`
}

async function runFixture(fx) {
  const name = fx.name
  const run = await agent(runnerBrief(name, fx.profile), { label: 'run:' + name, phase: 'Generate', model: 'opus' })
  if (run === null) { log('runner failed for ' + name + ' — skipping downstream'); return { fixture: name, error: 'runner-failed' } }
  const col = await agent(collectorBrief(name), { label: 'collect:' + name, phase: 'Collect', model: 'sonnet', effort: 'low' })
  if (col === null) { log('collector failed for ' + name); return { fixture: name, error: 'collector-failed', run } }
  const scorers = []
  if (fx.score && fx.score.l21dual) scorers.push(() => agent(l21DualBrief(name), { label: 'l2.1-dual:' + name, phase: 'Score', model: 'opus' }))
  if (fx.score && fx.score.l22l24) scorers.push(() => agent(l22Brief(name), { label: 'l2.2+l2.4:' + name, phase: 'Score', model: 'opus' }))
  if (fx.score && fx.score.linkGateSlice) scorers.push(() => agent(linkGateSliceBrief(name), { label: 'l2.6-slice:' + name, phase: 'Score', model: 'opus' }))
  const scores = await parallel(scorers)
  const card = await agent(assemblerBrief(name, fx.score || {}), { label: 'scorecard:' + name, phase: 'Assemble', model: 'sonnet', effort: 'low' })
  return { fixture: name, run, collect: col, scores, scorecard: card }
}

const out = await parallel(FIXTURES.map(fx => () => runFixture(fx)))
return out.filter(Boolean)
