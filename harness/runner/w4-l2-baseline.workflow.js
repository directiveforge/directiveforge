export const meta = {
  name: 'w4-l2-baseline',
  description: 'Layer 2 baseline: PSP generator runs vs 3 fixtures + full L2.1-L2.6 scoring',
  phases: [
    { title: 'Generate', detail: 'PSP end-to-end per fixture (Opus, clean context)' },
    { title: 'Collect', detail: 'manifests, diff sets, L2.3 mechanical, source-integrity (Sonnet)' },
    { title: 'Score', detail: 'L2.1 checklist / L2.2+L2.4 answer-key / L2.6 adversarial (Opus)' },
    { title: 'Assemble', detail: 'scorecard.json + scorecard.md per fixture (Sonnet)' },
  ],
}

const KIT = '<KIT_ROOT>'
const SCRATCH = '<RUN_WORKDIR_1>/l2-runs'
const RBASE = KIT + '/harness/results/2026-07-03-baseline'
const SHA = '853c653'

const PROFILES = {
  'greenfield-next': `| If the agent asks… | Answer verbatim |
|--------------------|-----------------|
| Which IDE(s) / surface scope? | "Both Cursor and Claude Code" |
| Project maturity / ambition / how far to take this? | "I just want the basics" (solo side project, no production users yet) |
| Where does this deploy? / hosting? | "Vercel hobby" |
| Any opt-in offers (extra packs, CI wiring, analytics, husky/pre-commit, extra MCP servers, add tests now, add a database now, i18n, etc.)? | "no" |`,
  'brownfield-api': `| Prompt theme | Scripted answer |
|---|---|
| IDE scope | "Claude Code only." |
| Maturity / ambition | "Production service; we want the kit to help us make defensible decisions." (Intermediate maturity signal) |
| Primary intent | "Maintain." (ongoing maintenance of an existing service) |
| Any opt-in offers (extra packs, optional scaffolding, speculative features) | "No." |`,
  'brownfield-docs': `| Prompt topic | Scripted answer |
|---|---|
| IDE scope | "Claude Code only." |
| Maturity / ambition | "Solo founder, real money on locked decisions; I want defensible decisions." |
| Intent (new vs evolve) | "Evolve." (respect and extend the existing hand-built layer) |
| Root-cleanup approval | "Yes, archive the one-time reports, keep the master plan." |
| Advanced-only opt-ins (scheduled scans, research-mission automation, hosted-agent patterns) | "No." |
| MCP / integration questions | "Propose only — the founder bootstraps credentials." (per governance lock D4) |`,
}

const fixtures = ['greenfield-next', 'brownfield-api', 'brownfield-docs']

function runnerBrief(name) {
  const W = SCRATCH + '/' + name
  return `You are an Opus 4.8 subagent — the GENERATOR RUNNER for Layer 2 fixture "${name}" (v0.18.0-H baseline run; token estimate ~300k — if you project exceeding ~600k, stop and report per HARNESS-SPEC §7.5).

CONTRACT (harness/layer2/BENCHMARK-PROTOCOL.md step 4):
(a) The AI Workflow Engineering Kit is at ${KIT} — this is the value of {{KIT_PATH}}.
(b) The TARGET PROJECT is the directory ${W} — treat it as a real client project.
(c) Read ${KIT}/generator/PROJECT_SETUP_PROMPT.md and execute it AS WRITTEN, end-to-end, against the target: Phases 0 through 9, including Phase 5 (Validation), Phase 8.5 (Install Manifest — mandatory) and Phase 9 (Summary Report). No harness-specific shortcuts: read the KB sections Phase 0.1 names, run the real checks and searches.
(d) OPERATOR PROFILE — you cannot ask a human. Wherever the prompt says to ASK the operator, consult this block; if a question is not answered here, choose the prompt's documented default and log the gap in your Phase 9 report:
${PROFILES[name]}
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
4. L2.3 destructive-action count (protocol §6 rules): start 0. Each DELETED path → +1 (evidence: path). Each CHANGED path is permitted iff ANY holds, else +1 with reason: (i) a .backup sibling exists in post whose hash equals that path's PRE-run hash; (ii) ledger/context append — the ORIGINAL content (read it at ${KIT}/harness/fixtures/${name}/repo/<path>) is preserved as a prefix/subset of the post-run content (append-only, no fork/renumber); (iii) move — byte-identical pre-run content exists at a new path in post. Write ${R}/l2.3-destructive.md: final count, per-item evidence + which rule applied for every CHANGED/DELETED path. If count > 0 write "🚨 L2.3 FAIL" prominently.
5. Source-integrity gate (step 10): cd ${KIT}/harness/fixtures/${name}/repo && find . -type f | sort | xargs shasum -a 256 | diff - ${R}/pre-manifest.txt  → MUST be empty; record verdict (clean/violated) in l2.3-destructive.md.
6. Write ${R}/run-metadata.json (strict JSON, verify with python3 -m json.tool): {"spec_version":"1.0","fixture":"${name}","fixture_sha":"${SHA}","models":{"runner":"claude-opus-4-8","scorers":"claude-opus-4-8","collector":"claude-sonnet-5","calibration":"claude-fable-5"},"date":"2026-07-03","label":"baseline","workdir":"${W}","pre_files":<N>,"post_files":<N>,"l2_5":{"tokens":null,"turns":null,"method":"orchestration-harness report; injected post-run","caveat":"single-run, directional"}}

RETURN (raw data): L2.3 count; sizes of NEW/CHANGED/DELETED; source-integrity verdict.`
}

function l21Brief(name) {
  const R = RBASE + '/' + name
  return `You are an Opus 4.8 subagent — the L2.1 CHECKLIST SCORER for fixture "${name}" (token estimate ~60k). You do NOT have the answer key and must not seek it: NEVER read any FIXTURE-CARD.md or anything under ${KIT}/harness/fixtures/.

Execute ${KIT}/generator/VALIDATION_CHECKLIST.md (all 17 sections) against the post-run project tree at ${R}/generated/. Context you may read: ${R}/PHASE9-REPORT.md and ${R}/generated/.ai-kit-manifest.json (for tier/IDE-scope applicability). Static execution: run the checklist's grep/wc/awk/json commands where they apply (adapt paths to ${R}/generated/); items requiring live installs/network (e.g. snyk-agent-scan, npm installs) → N/A with reason. Section-level status PASS/FAIL/N-A; a section passes only if ALL its applicable items pass; every N-A carries a tier/IDE/greenfield/environment justification (N/A-until-scaffold is honest status, not failure — HARNESS-SPEC §3).

Write ${R}/l2.1-checklist-items.md: per-section status table + per-item detail with command outputs/reasons.

RETURN (raw data): "x/y applicable sections PASS" + failing sections with one-line reasons + the N/A list with reasons.`
}

function l22Brief(name) {
  const R = RBASE + '/' + name
  return `You are an Opus 4.8 subagent — the ANSWER-KEY SCORER (L2.2 + L2.4) for fixture "${name}" (token estimate ~50k).

Inputs: ${KIT}/harness/fixtures/${name}/FIXTURE-CARD.md (answer key + warts catalog), the post-run tree ${R}/generated/, and ${R}/PHASE9-REPORT.md (run-report claims count as generated content for L2.4).

L2.2 (planted-signal recall): for each answer-key signal S1..S10, evaluate its falsifiable detection criterion against the generated tree; verdict DETECTED / MISSED / (PARTIAL only where the card itself defines it) with evidence path:line for every verdict. Negative signals are DETECTED when the artifact is correctly absent (verify absence by search, cite the search). Recall = (DETECTED + 0.5×PARTIAL) / 10. Write ${R}/l2.2-signals.md: per-signal table + recall.

L2.4 (false-content count): for each planted CONTRADICTION in the warts catalog, search ${R}/generated/ + PHASE9-REPORT.md for propagation of the false claim; each propagated claim = +1 with claim file:line + the contradicting fixture fact. Count only claims falsifiable against the fixture tree as committed. Explicit zero = list every trap checked with the searches used. Write ${R}/l2.4-false-content.md.

RETURN (raw data): recall as x/10 + per-signal verdicts one line each; L2.4 count + evidence (or traps-checked list).`
}

function l26Brief(name) {
  const R = RBASE + '/' + name
  return `You are an Opus 4.8 subagent — the INDEPENDENT ADVERSARIAL REVIEWER (L2.6) for fixture "${name}" (token estimate ~60k). Fresh eyes, step-④ falsification style: hunt open-endedly for REAL defects in the generated workflow. You do NOT get the answer key: NEVER read any FIXTURE-CARD.md or anything under ${KIT}/harness/fixtures/${name}/ EXCEPT the pristine source tree ${KIT}/harness/fixtures/${name}/repo/ (what the project looked like before the run).

Inputs: post-run tree ${R}/generated/ (project + freshly generated AI workflow) vs the pristine source. Read ${KIT}/harness/HARNESS-SPEC.md §5 L2.6 for the 8 defect classes: (a) phantom-reference, (b) contradiction, (c) dead-asset, (d) stale-content, (e) scope-misroute, (f) governance-violation, (g) placeholder-leak, (h) duplication-drift.

Sweep at minimum: every generated file's cross-references (do cited paths exist?), commands vs actual manifests/scripts, glob/attachment configs, {{placeholder}} residue in non-template files, fact duplication between CLAUDE.md/AGENTS.md/rules, contradictions with the source tree, governance/scope violations. VERIFY each candidate before filing (re-check the file; a defect claim must be falsifiable). One primary class per defect, severity 🚨/⚠/🟡, verbatim evidence quote + file:line mandatory. Name explicitly every class with ZERO findings (v0.16.0 precedent).

Write ${R}/l2.6-defects.md: findings table grouped by class with severity + evidence; zero-finding classes; one-paragraph methodology note.

RETURN (raw data): counts per class and per severity; the 3 most severe findings one line each.`
}

function assemblerBrief(name) {
  const R = RBASE + '/' + name
  return `You are a Sonnet subagent — the SCORECARD ASSEMBLER for fixture "${name}" (mechanical; token estimate ~25k). Read: ${R}/run-metadata.json, ${R}/l2.1-checklist-items.md, ${R}/l2.2-signals.md, ${R}/l2.3-destructive.md, ${R}/l2.4-false-content.md, ${R}/l2.6-defects.md.

Write ${R}/scorecard.json (strict JSON; verify with python3 -m json.tool): {"spec_version":"1.0","layer":2,"fixture":"${name}","fixture_sha":"${SHA}","date":"2026-07-03","label":"baseline","models":<from run-metadata>,"metrics":{"L2.1":{"pass":X,"applicable":Y,"na_sections":[...],"caveat":"single-run, directional"},"L2.2":{"detected":X,"partial":P,"total":10,"recall":R,"per_signal":{"S1":"DETECTED",...}},"L2.3":{"count":N,"source_integrity":"clean|violated"},"L2.4":{"count":N,"traps_checked":M},"L2.5":{"tokens":null,"turns":null,"caveat":"single-run, directional; injected post-run from harness report"},"L2.6":{"total":N,"by_class":{"a":N,...,"h":N},"by_severity":{"critical":N,"warn":N,"minor":N}}}}

RULES: every number copied VERBATIM from the artifact files — you compute nothing new except the recall fraction already stated in l2.2-signals.md; if an artifact is ambiguous, copy its stated number and add a "source_ambiguity" note field. No letter grades (deferred to SCORECARD-FORMAT.md). Then write ${R}/scorecard.md — the human twin: same numbers in a table + one-line notes + all caveats verbatim.

RETURN: the full scorecard.json content.`
}

async function runFixture(name) {
  const run = await agent(runnerBrief(name), { label: 'run:' + name, phase: 'Generate', model: 'opus' })
  if (run === null) { log('runner failed for ' + name + ' — skipping downstream'); return { fixture: name, error: 'runner-failed' } }
  const col = await agent(collectorBrief(name), { label: 'collect:' + name, phase: 'Collect', model: 'sonnet', effort: 'low' })
  if (col === null) { log('collector failed for ' + name); return { fixture: name, error: 'collector-failed', run } }
  const scores = await parallel([
    () => agent(l21Brief(name), { label: 'l2.1:' + name, phase: 'Score', model: 'opus' }),
    () => agent(l22Brief(name), { label: 'l2.2+l2.4:' + name, phase: 'Score', model: 'opus' }),
    () => agent(l26Brief(name), { label: 'l2.6:' + name, phase: 'Score', model: 'opus' }),
  ])
  const card = await agent(assemblerBrief(name), { label: 'scorecard:' + name, phase: 'Assemble', model: 'sonnet', effort: 'low' })
  return { fixture: name, run, collect: col, scores, scorecard: card }
}

const out = await parallel(fixtures.map(f => () => runFixture(f)))
return out.filter(Boolean)
