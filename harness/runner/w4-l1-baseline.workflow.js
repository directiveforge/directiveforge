export const meta = {
  name: 'w4-l1-baseline',
  description: 'Layer 1 baseline: static gates + trigger F1 + repeatability + rubric judging over 3 template packs',
  phases: [
    { title: 'Prep', detail: 'static checks (Sonnet) + catalog extraction (Haiku)' },
    { title: 'Prompts', detail: 'prompt-author per skill (Opus)' },
    { title: 'Router', detail: 'router-sim per prompt (Haiku, fresh context each)' },
    { title: 'Judge', detail: 'anchored rubric per artifact (Opus)' },
    { title: 'Repeatability', detail: 'paraphrase trials + Wilson breaker (decision pack only)' },
    { title: 'Record', detail: 'raw JSON artifacts + pack scorecards' },
  ],
}

const KIT = '<KIT_ROOT>'
const RB = KIT + '/harness/results/2026-07-03-baseline/l1'

const packs = [
  { name: 'decision', skills: ['10-10-10','anti-sycophancy-meta','bayesian-update','confidence-calibration','cost-of-inaction','council-3-voice','disconfirming-evidence-first','inversion','pre-mortem','reversibility-check','second-order-thinking','steelman'], l13: true },
  { name: 'naming', skills: ['naming-brief','name-generation','linguistic-screen','trademark-clearance','availability-gate','name-scorecard'], l13: false },
  { name: 'design', skills: ['design-architect','design-engineer','design-reviewer','elevation-workflow'], l13: false },
]

const CATSCHEMA = { type: 'object', properties: { catalog: { type: 'string' }, count: { type: 'number' } }, required: ['catalog', 'count'] }
const PROMPTSCHEMA = { type: 'object', properties: { prompts: { type: 'array', minItems: 10, maxItems: 10, items: { type: 'object', properties: { id: { type: 'string' }, text: { type: 'string' }, expected: { type: 'string', enum: ['target', 'none', 'other'] }, rationale: { type: 'string' } }, required: ['id', 'text', 'expected'] } } }, required: ['prompts'] }
const ROUTESCHEMA = { type: 'object', properties: { skill: { type: 'string' } }, required: ['skill'] }
const PARASCHEMA = { type: 'object', properties: { variants: { type: 'array', minItems: 10, items: { type: 'object', properties: { id: { type: 'string' }, base: { type: 'string' }, text: { type: 'string' } }, required: ['id', 'text'] } } }, required: ['variants'] }
const DIM = { type: 'object', properties: { score: { type: 'number' }, evidence: { type: 'string' } }, required: ['score', 'evidence'] }
const JUDGESCHEMA = { type: 'object', properties: { artifact: { type: 'string' }, class: { type: 'string' }, scores: { type: 'object', properties: { actionability: DIM, scope_calibration: DIM, failure_content_quality: DIM, constraint_explicitness: DIM }, required: ['actionability', 'scope_calibration', 'failure_content_quality', 'constraint_explicitness'] }, notes: { type: 'string' } }, required: ['scores'] }

function wilson(x, n) {
  const z = 1.96, z2 = z * z
  const p = x / n
  const d = 1 + z2 / n
  const c = (p + z2 / (2 * n)) / d
  const m = (z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / d
  return { lo: c - m, hi: c + m, half: m }
}

function staticBrief(p) {
  return 'You are a Sonnet subagent — the L1.1 STATIC SCORER for pack "' + p.name + '" (mechanical; token estimate ~40k). Execute ' + KIT + '/harness/layer1/static-checks.md IN FULL against TARGET=' + KIT + '/templates/skills/' + p.name + ' — run every applicable command exactly as written, record PASS/FAIL/N-A per check per artifact, INDETERMINATE counts as FAIL. Then write the result JSON (per the doc Scoring section: per-artifact rows + pack micro-average, na_families, empty_dirs) to ' + RB + '/' + p.name + '/l1.1-static.json (mkdir -p first; verify with python3 -m json.tool). RETURN (raw): pack passed/failed totals + pass_rate + every FAIL with check id and artifact path.'
}

function catalogBrief(p) {
  return 'You are a Haiku subagent (mechanical). For EVERY skill directory in ' + KIT + '/templates/skills/' + p.name + '/ read the SKILL.md YAML frontmatter and produce the catalog: for each skill exactly two lines — "name: <value>" and "description: <value>" — separated by a blank line between skills, VERBATIM from the files. Return {catalog: "<the text>", count: <number of skills>}. Expected count: ' + p.skills.length + '.'
}

function authorBrief(p, s, catalog) {
  return 'You are an Opus 4.8 subagent — the L1.2 PROMPT-AUTHOR for skill "' + s + '" of pack "' + p.name + '" (token estimate ~10k). First read ' + KIT + '/harness/layer1/judge-rubrics.md Protocol 1a (your dispatch contract) and ' + KIT + '/templates/skills/' + p.name + '/' + s + '/SKILL.md (the target — especially its "When NOT to use" section). The installed catalog (what the router will see):\n\n' + catalog + '\n\nWrite EXACTLY 10 synthetic user prompts per Protocol 1a: ids "' + s + '-p1".."' + s + '-p5" positive (expected "target"), "' + s + '-n1","' + s + '-n2" near-miss adjacent-skill from THIS catalog (expected "other"), "' + s + '-n3","' + s + '-n4" unrelated-domain (expected "none"), "' + s + '-n5" drawn from the target’s own When-NOT list (expected "none" or "other" per the case). PARAPHRASE RULE: never quote the description’s trigger phrases verbatim; no >=4-word span shared with any catalog description. Realistic first-person user messages.'
}

function routerBrief(catalog, text) {
  return 'You are a skill ROUTER (Haiku). You see the installed skill catalog and ONE user message. Decide which single skill (if any) should activate.\nCATALOG:\n' + catalog + '\nUSER MESSAGE:\n' + text + '\nReturn {"skill":"<one skill name from the catalog>"} or {"skill":"none"}. No reasoning.'
}

function judgeBrief(p, s) {
  return 'You are an Opus 4.8 subagent — the L1.4 RUBRIC JUDGE (token estimate ~8k). Read ' + KIT + '/harness/layer1/judge-rubrics.md Protocol 2 (rubric 2a SKILL class + dispatch 2e) and judge ONE artifact: ' + KIT + '/templates/skills/' + p.name + '/' + s + '/SKILL.md. Score the 4 dimensions 1-5 by the anchors; if the artifact matches an anchor’s defect class, that IS the score; a well-formed but generic artifact scores 3, not 5. EVERY score requires a verbatim evidence quote (exact line from the artifact). Set artifact="' + p.name + '/' + s + '" and class="skill".'
}

function paraBrief(s, positives) {
  return 'You are an Opus 4.8 subagent — the L1.3 PARAPHRASE AUTHOR for skill "' + s + '" (token estimate ~8k; contract: ' + KIT + '/harness/layer1/repeatability.md step 1). Given these 5 positive prompts:\n' + positives.map(function (pr) { return pr.id + ': ' + pr.text }).join('\n') + '\nProduce 30 paraphrase variants (6 per base prompt): each preserves the user’s intent but changes surface wording (verbs, sentence shape, register). Do NOT quote the skill description’s trigger phrases. ids "' + s + '-v1".."' + s + '-v30", each with base=<source prompt id>.'
}

function recorderBrief(path, content) {
  return 'You are a Haiku RECORDER (mechanical). Using the Write tool, write EXACTLY the following JSON content to ' + path + ' (mkdir -p the parent dir first via Bash), byte-for-byte, nothing added or removed. Then run: python3 -m json.tool < ' + path + ' — if it fails, fix the file until it parses while preserving the content exactly. RETURN: "OK <byte count>" or the error.\n\nCONTENT:\n' + content
}

function assemblerBrief(p) {
  const dir = RB + '/' + p.name
  const l13note = p.l13 ? 'include the L1.3 stats from l1.3-repeatability.json' : 'set "L1.3": {"status":"deferred","caveat":"L1.3 measured on the decision pack only in this baseline; deferred for this pack per spend circuit-breaker adjudication (HARNESS-SPEC §7.5) — see DISPOSITIONS-v0.18.0"}'
  return 'You are a Sonnet subagent — the PACK SCORECARD ASSEMBLER for pack "' + p.name + '" (mechanical; ~20k). Read every JSON in ' + dir + '/ (l1.1-static.json, l1.2-trigger.json, ' + (p.l13 ? 'l1.3-repeatability.json, ' : '') + 'l1.4-rubric.json). Write ' + dir + '/scorecard.json (strict JSON, python3 -m json.tool must pass): {"spec_version":"1.0","layer":1,"pack":"' + p.name + '","date":"2026-07-03","label":"baseline","models":{"static":"claude-sonnet-5","author":"claude-opus-4-8","router":"claude-haiku-4-5","judge":"claude-opus-4-8","calibration":"claude-fable-5"},"metrics":{"L1.1":<pack rollup + per-artifact pass_rates>,"L1.2":<pack_micro + per_skill precision/recall/f1>,"L1.3":<' + l13note + '>,"L1.4":<per_dimension_mean + overall_mean + n>},"calibration":{"judge_agreement":"pending Fable §6 re-judge — injected post-run"}}. Every number copied VERBATIM from the artifact JSONs — compute nothing new. Then write ' + dir + '/scorecard.md — human twin: same numbers, tables, all caveats (single-run where applicable, n everywhere, no letter grades — deferred to SCORECARD-FORMAT.md). RETURN: the scorecard.json content.'
}

async function repeatSkill(p, catalog, s, positives) {
  const para = await agent(paraBrief(s, positives), { label: 'para:' + s, phase: 'Repeatability', model: 'opus', schema: PARASCHEMA })
  if (!para || !para.variants || !para.variants.length) return { skill: s, error: 'paraphrase-failed' }
  const variants = para.variants
  let x = 0, n = 0
  const trials = []
  while (n < 30) {
    const batch = []
    for (let i = 0; i < 5; i++) batch.push({ v: variants[(n + i) % variants.length], idx: n + i })
    const outs = await parallel(batch.map(function (b) {
      return function () {
        return agent(routerBrief(catalog, b.v.text), { label: 'trial:' + s + '-' + (b.idx + 1), phase: 'Repeatability', model: 'haiku', effort: 'low', schema: ROUTESCHEMA })
          .then(function (r) { return { variant: b.v.id, base: b.v.base || null, text: b.v.text, fired: r ? String(r.skill).trim() : 'ERROR' } })
      }
    }))
    for (const o of outs) { trials.push(o); if (o.fired === s) x++ }
    n += 5
    const w = wilson(x, n)
    if (n >= 10 && w.half <= 0.08) break
  }
  const w = wilson(x, n)
  return { skill: s, n: n, activations: x, proportion: Math.round(x / n * 10000) / 10000, wilson_ci: [Math.round(w.lo * 10000) / 10000, Math.round(w.hi * 10000) / 10000], stopped_early: n < 30 && w.half <= 0.08, trials: trials }
}

async function runPack(p) {
  const statP = agent(staticBrief(p), { label: 'l1.1:' + p.name, phase: 'Prep', model: 'sonnet', effort: 'low' })
  const cat = await agent(catalogBrief(p), { label: 'catalog:' + p.name, phase: 'Prep', model: 'haiku', effort: 'low', schema: CATSCHEMA })
  if (!cat || !cat.catalog) { log('catalog failed for ' + p.name); return { pack: p.name, error: 'catalog-failed' } }
  const catalog = cat.catalog

  const promptSets = await parallel(p.skills.map(function (s) {
    return function () {
      return agent(authorBrief(p, s, catalog), { label: 'prompts:' + s, phase: 'Prompts', model: 'opus', schema: PROMPTSCHEMA })
        .then(function (r) { return { skill: s, prompts: r ? r.prompts : null } })
    }
  }))

  const tasks = []
  for (const ps of promptSets) { if (ps && ps.prompts) for (const pr of ps.prompts) tasks.push({ skill: ps.skill, prompt: pr }) }
  const routerOuts = await parallel(tasks.map(function (t) {
    return function () {
      return agent(routerBrief(catalog, t.prompt.text), { label: 'route:' + t.prompt.id, phase: 'Router', model: 'haiku', effort: 'low', schema: ROUTESCHEMA })
        .then(function (r) { return { skill: t.skill, id: t.prompt.id, text: t.prompt.text, expected: t.prompt.expected, fired: r ? String(r.skill).trim() : 'ERROR' } })
    }
  }))

  const perSkill = []
  let mTP = 0, mFP = 0, mFN = 0
  for (const s of p.skills) {
    const rows = routerOuts.filter(function (r) { return r && r.skill === s })
    if (!rows.length) { perSkill.push({ skill: s, error: 'no-prompts' }); continue }
    let TP = 0, FP = 0, FN = 0
    const confusion = []
    const positives = rows.filter(function (r) { return r.expected === 'target' }).length
    for (const r of rows) {
      const firedTarget = r.fired === s
      if (r.expected === 'target') { if (firedTarget) TP++; else { FN++; confusion.push({ prompt: r.id, expected: 'target', fired: r.fired }) } }
      else { if (firedTarget) { FP++; confusion.push({ prompt: r.id, expected: r.expected, fired: r.fired }) } }
    }
    mTP += TP; mFP += FP; mFN += FN
    const precision = (TP + FP) === 0 ? null : Math.round(TP / (TP + FP) * 10000) / 10000
    const recall = positives === 0 ? null : Math.round(TP / positives * 10000) / 10000
    const f1 = (precision === null || recall === null || (precision + recall) === 0) ? null : Math.round(2 * precision * recall / (precision + recall) * 10000) / 10000
    perSkill.push({ skill: s, TP: TP, FP: FP, FN: FN, positives: positives, precision: precision, recall: recall, f1: f1, confusion: confusion })
  }
  const mp = (mTP + mFP) === 0 ? null : mTP / (mTP + mFP)
  const mr = (mTP + mFN) === 0 ? null : mTP / (mTP + mFN)
  const mf = (mp === null || mr === null || (mp + mr) === 0) ? null : 2 * mp * mr / (mp + mr)
  const l12 = { metric: 'L1.2', pack: p.name, spec_version: '1.0', models: { author: 'claude-opus-4-8', router: 'claude-haiku-4-5' }, prompts_per_skill: 10, per_skill: perSkill, pack_micro: { TP: mTP, FP: mFP, FN: mFN, precision: mp === null ? null : Math.round(mp * 10000) / 10000, recall: mr === null ? null : Math.round(mr * 10000) / 10000, f1: mf === null ? null : Math.round(mf * 10000) / 10000 }, raw_router_outputs: routerOuts }

  const judged = await parallel(p.skills.map(function (s) {
    return function () {
      return agent(judgeBrief(p, s), { label: 'judge:' + s, phase: 'Judge', model: 'opus', schema: JUDGESCHEMA })
        .then(function (r) { return r ? Object.assign({ artifact: p.name + '/' + s, class: 'skill' }, r) : { artifact: p.name + '/' + s, error: 'judge-failed' } })
    }
  }))
  const dims = ['actionability', 'scope_calibration', 'failure_content_quality', 'constraint_explicitness']
  const means = {}
  let overall = 0, dimCount = 0
  const ok = judged.filter(function (j) { return j && j.scores })
  for (const d of dims) {
    const vals = ok.map(function (j) { return j.scores[d].score })
    const m = vals.length ? vals.reduce(function (a, b) { return a + b }, 0) / vals.length : null
    means[d] = m === null ? null : Math.round(m * 1000) / 1000
    if (m !== null) { overall += m; dimCount++ }
  }
  const l14 = { metric: 'L1.4', pack: p.name, spec_version: '1.0', judge: 'claude-opus-4-8', n: ok.length, per_dimension_mean: means, overall_mean: dimCount ? Math.round(overall / dimCount * 1000) / 1000 : null, artifacts: judged }

  let l13 = null
  if (p.l13) {
    const rows = await parallel(p.skills.map(function (s) {
      return function () {
        const ps = promptSets.find(function (x) { return x && x.skill === s })
        const positives = ps && ps.prompts ? ps.prompts.filter(function (pr) { return pr.expected === 'target' }) : []
        if (!positives.length) return Promise.resolve({ skill: s, error: 'no-positives' })
        return repeatSkill(p, catalog, s, positives)
      }
    }))
    l13 = { metric: 'L1.3', pack: p.name, spec_version: '1.0', models: { paraphrase_author: 'claude-opus-4-8', router: 'claude-haiku-4-5' }, schedule: 'batch5-min10-target20-max30-halfwidth0.08', per_skill: rows.map(function (r) { const c = Object.assign({}, r); delete c.trials; return c }), trials_by_skill: rows.map(function (r) { return { skill: r.skill, trials: r.trials || [] } }) }
  }

  const dir = RB + '/' + p.name
  const recs = [
    function () { return agent(recorderBrief(dir + '/l1.2-trigger.json', JSON.stringify(l12, null, 2)), { label: 'rec-l1.2:' + p.name, phase: 'Record', model: 'haiku', effort: 'low' }) },
    function () { return agent(recorderBrief(dir + '/l1.4-rubric.json', JSON.stringify(l14, null, 2)), { label: 'rec-l1.4:' + p.name, phase: 'Record', model: 'haiku', effort: 'low' }) },
  ]
  if (l13) recs.push(function () { return agent(recorderBrief(dir + '/l1.3-repeatability.json', JSON.stringify(l13, null, 2)), { label: 'rec-l1.3:' + p.name, phase: 'Record', model: 'haiku', effort: 'low' }) })
  await parallel(recs)
  const statRes = await statP
  const card = await agent(assemblerBrief(p), { label: 'scorecard:' + p.name, phase: 'Record', model: 'sonnet', effort: 'low' })

  return {
    pack: p.name,
    static_summary: statRes,
    l12_micro: l12.pack_micro,
    l14_means: { per_dimension_mean: means, overall_mean: l14.overall_mean, n: l14.n },
    l13_summary: l13 ? l13.per_skill : 'deferred',
    scorecard: card,
  }
}

const out = await parallel(packs.map(function (p) { return function () { return runPack(p) } }))
return out.filter(Boolean)
