export const meta = {
  name: 'l1-delta',
  description: 'Layer 1 SCOPED re-measure (L1.2 trigger / L1.3 repeatability) — parameterized, batched router channel per HARNESS-SPEC v1.1, non-clobbering. Returns result JSON; the main session writes files.',
  phases: [
    { title: 'Guard', detail: 'resolve output dir from args; refuse to run against a frozen baseline dir' },
    { title: 'Router', detail: 'batched (K<=15) or v1.0-single router-sim over the reused prompt sets' },
    { title: 'Repeatability', detail: 'interleaved paraphrase batches + Wilson breaker (named skills only)' },
    { title: 'Return', detail: 'RETURN result JSON to caller (no recorder agents; main loop writes)' },
  ],
}

// ---------------------------------------------------------------------------
// SCHEMAS — carried over verbatim from w4-l1-baseline.workflow.js (self-contained; no imports).
// New: ARRSCHEMA for the batched router channel (JSON array of {id, skill}).
// ---------------------------------------------------------------------------
const ROUTESCHEMA = { type: 'object', properties: { skill: { type: 'string' } }, required: ['skill'] }
const ARRSCHEMA = { type: 'object', properties: { verdicts: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, skill: { type: 'string' } }, required: ['id', 'skill'] } } }, required: ['verdicts'] }

// ---------------------------------------------------------------------------
// WILSON — carried over verbatim from w4-l1-baseline.workflow.js (unchanged).
// ---------------------------------------------------------------------------
function wilson(x, n) {
  const z = 1.96, z2 = z * z
  const p = x / n
  const d = 1 + z2 / n
  const c = (p + z2 / (2 * n)) / d
  const m = (z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / d
  return { lo: c - m, hi: c + m, half: m }
}

// F1 helper — the pack-micro precision/recall/f1 arithmetic carried over from the baseline
// runPack() body, extracted into a pure helper (same formulas: precision=TP/(TP+FP),
// recall=TP/positives, f1 harmonic; nulls where undefined, per judge-rubrics.md §1c).
function f1cell(TP, FP, positives) {
  const precision = (TP + FP) === 0 ? null : Math.round(TP / (TP + FP) * 10000) / 10000
  const recall = positives === 0 ? null : Math.round(TP / positives * 10000) / 10000
  const f1 = (precision === null || recall === null || (precision + recall) === 0) ? null : Math.round(2 * precision * recall / (precision + recall) * 10000) / 10000
  return { precision: precision, recall: recall, f1: f1 }
}

// ---------------------------------------------------------------------------
// BRIEFS
// v1.0-single: verbatim shape of the baseline routerBrief() — one prompt, one call.
// v1.1-batched: K prompts per call, independent-judgment instruction, JSON-array return.
// ---------------------------------------------------------------------------
function routerBriefSingle(catalog, text) {
  return 'You are a skill ROUTER (Haiku). You see the installed skill catalog and ONE user message. Decide which single skill (if any) should activate.\nCATALOG:\n' + catalog + '\nUSER MESSAGE:\n' + text + '\nReturn {"skill":"<one skill name from the catalog>"} or {"skill":"none"}. No reasoning.'
}

function routerBriefBatched(catalog, items) {
  const block = items.map(function (it) { return '[' + it.id + '] ' + it.text }).join('\n\n')
  return 'You are a skill ROUTER (Haiku). You see the installed skill catalog ONCE, then ' + items.length + ' user messages, each tagged with its id in square brackets. Decide, for EACH message INDEPENDENTLY, which single skill (if any) should activate.\nRULES: judge every message on its own — do NOT cross-reference the other messages, do NOT balance the distribution of your answers, do NOT let one verdict influence another. Each message gets exactly one verdict.\nCATALOG:\n' + catalog + '\nMESSAGES (' + items.length + '):\n' + block + '\nReturn {"verdicts":[{"id":"<the tag>","skill":"<one skill name from the catalog, or none>"}, ...]} with exactly one object per message id above. No reasoning.'
}

// NOTE: no paraphrase-author brief in this script. L1.3 variant pools are PRE-AUTHORED
// (the baseline's committed variants, passed via A.scope[].l13Skills) and reused
// verbatim — re-authoring would confound the delta with paraphrase drift (reuse-verbatim
// rule, HARNESS-SPEC §L1.2/L1.3 Method + v1.1 addendum).

// ---------------------------------------------------------------------------
// ROUTER EXECUTION — channel-selectable.
// batchK<=0 or channel 'v1.0-single' => one call per prompt (the two code paths quoted
// in the acceptance report). Returns [{id, fired}] for a list of {id, text} items.
// ---------------------------------------------------------------------------
async function routeItems(catalog, items, channel, batchK) {
  // --- CODE PATH 1: v1.0 single-call channel (one prompt = one call = one router output) ---
  if (channel === 'v1.0-single') {
    const outs = await parallel(items.map(function (it) {
      return function () {
        return agent(routerBriefSingle(catalog, it.text), { label: 'route1:' + it.id, phase: 'Router', model: 'haiku', effort: 'low', schema: ROUTESCHEMA })
          .then(function (r) { return { id: it.id, fired: r ? String(r.skill).trim() : 'ERROR' } })
      }
    }))
    return outs
  }
  // --- CODE PATH 2: v1.1 batched channel (K prompts per call, independent-judgment array) ---
  const K = batchK && batchK > 0 && batchK <= 15 ? batchK : 15
  const groups = []
  for (let i = 0; i < items.length; i += K) groups.push(items.slice(i, i + K))
  const groupOuts = await parallel(groups.map(function (g, gi) {
    return function () {
      return agent(routerBriefBatched(catalog, g), { label: 'routeK:' + gi + '(' + g.length + ')', phase: 'Router', model: 'haiku', effort: 'low', schema: ARRSCHEMA })
        .then(function (r) {
          const map = {}
          if (r && r.verdicts) for (const v of r.verdicts) map[String(v.id).trim()] = String(v.skill).trim()
          return g.map(function (it) { return { id: it.id, fired: Object.prototype.hasOwnProperty.call(map, it.id) ? map[it.id] : 'ERROR' } })
        })
    }
  }))
  const flat = []
  for (const arr of groupOuts) for (const o of arr) flat.push(o)
  return flat
}

// ---------------------------------------------------------------------------
// L1.2 — trigger precision/recall/f1 over a reused prompt set (reuse-verbatim; never re-author).
// promptSets: [{skill, prompts:[{id,text,expected}]}] passed in via args.
// ---------------------------------------------------------------------------
async function measureL12(catalog, promptSets, channel, batchK) {
  const items = []
  const meta = {}
  for (const ps of promptSets) {
    if (!ps || !ps.prompts) continue
    for (const pr of ps.prompts) { items.push({ id: pr.id, text: pr.text }); meta[pr.id] = { skill: ps.skill, expected: pr.expected } }
  }
  const routed = await routeItems(catalog, items, channel, batchK)
  const byId = {}
  for (const r of routed) byId[r.id] = r.fired

  const perSkill = []
  let mTP = 0, mFP = 0, mFN = 0
  const rawRouterOutputs = []
  for (const ps of promptSets) {
    if (!ps || !ps.prompts) { perSkill.push({ skill: ps ? ps.skill : 'unknown', error: 'no-prompts' }); continue }
    const s = ps.skill
    let TP = 0, FP = 0, FN = 0
    const confusion = []
    let positives = 0
    for (const pr of ps.prompts) {
      const fired = Object.prototype.hasOwnProperty.call(byId, pr.id) ? byId[pr.id] : 'ERROR'
      rawRouterOutputs.push({ skill: s, id: pr.id, text: pr.text, expected: pr.expected, fired: fired })
      const firedTarget = fired === s
      if (pr.expected === 'target') {
        positives++
        if (firedTarget) TP++; else { FN++; confusion.push({ prompt: pr.id, expected: 'target', fired: fired }) }
      } else {
        if (firedTarget) { FP++; confusion.push({ prompt: pr.id, expected: pr.expected, fired: fired }) }
      }
    }
    mTP += TP; mFP += FP; mFN += FN
    const cell = f1cell(TP, FP, positives)
    perSkill.push({ skill: s, TP: TP, FP: FP, FN: FN, positives: positives, precision: cell.precision, recall: cell.recall, f1: cell.f1, confusion: confusion })
  }
  const mp = (mTP + mFP) === 0 ? null : mTP / (mTP + mFP)
  const mr = (mTP + mFN) === 0 ? null : mTP / (mTP + mFN)
  const mf = (mp === null || mr === null || (mp + mr) === 0) ? null : 2 * mp * mr / (mp + mr)
  return {
    metric: 'L1.2',
    channel: channel === 'v1.0-single' ? 'v1.0-single' : ('v1.1-batched-K' + (batchK && batchK > 0 && batchK <= 15 ? batchK : 15)),
    per_skill: perSkill,
    pack_micro: { TP: mTP, FP: mFP, FN: mFN, precision: mp === null ? null : Math.round(mp * 10000) / 10000, recall: mr === null ? null : Math.round(mr * 10000) / 10000, f1: mf === null ? null : Math.round(mf * 10000) / 10000 },
    raw_router_outputs: rawRouterOutputs,
  }
}

// ---------------------------------------------------------------------------
// L1.3 — activation repeatability, batched + INTERLEAVED across skills.
// Schedule unchanged: batch5-min10-target20-max30, half-width<=0.08.
// With batched calls, the breaker is evaluated after each batched call's worth of trials.
// For batched calls, each K-slot holds trials from DIFFERENT skills (no same-skill cluster).
// ---------------------------------------------------------------------------
async function measureL13(catalog, skillVariantPools, channel, batchK) {
  // 1. Load PRE-AUTHORED variant pools (reuse-verbatim rule: the baseline's committed paraphrase
  //    variants are passed in via args and reused in their original trial order — this script
  //    NEVER authors prompts; re-authoring would confound the delta with paraphrase drift).
  const skills = Object.keys(skillVariantPools)
  const pool = {}          // skill -> variant array [{id, text, base}]
  const state = {}         // skill -> {x, n, trials, done}
  const active = []
  for (const s of skills) {
    const vs = skillVariantPools[s] && skillVariantPools[s].variants
    if (!vs || !vs.length) { state[s] = { x: 0, n: 0, trials: [], done: true, error: 'no-preauthored-variants' }; continue }
    pool[s] = vs
    state[s] = { x: 0, n: 0, trials: [], done: false }
    active.push(s)
  }

  // 2. Interleaved batched rounds. Each round advances every still-active skill by 5 trials,
  //    but the router CALLS interleave variants across skills (never a same-skill cluster per call).
  //    After each round (== one batched call's worth of trials per skill), evaluate the breaker.
  const CHANNEL = channel === 'v1.0-single' ? 'v1.0-single' : channel
  while (active.length) {
    // Build this round's trial items: 5 per still-active skill.
    const roundItems = []
    for (const s of active) {
      const st = state[s]
      const vs = pool[s]
      for (let i = 0; i < 5; i++) {
        const v = vs[(st.n + i) % vs.length]
        roundItems.push({ id: s + '::' + (st.n + i + 1), text: v.text, skill: s, variant: v.id, base: v.base || null })
      }
    }
    // Interleave so no batched call holds a same-skill cluster: round-robin the skills.
    roundItems.sort(function (a, b) { return a.id.localeCompare(b.id) })  // stable, deterministic
    const interleaved = interleaveBySkill(roundItems)
    const routed = await routeItems(catalog, interleaved.map(function (it) { return { id: it.id, text: it.text } }), CHANNEL, batchK)
    const firedBy = {}
    for (const r of routed) firedBy[r.id] = r.fired
    // Fold results back per skill.
    for (const it of interleaved) {
      const st = state[it.skill]
      const fired = Object.prototype.hasOwnProperty.call(firedBy, it.id) ? firedBy[it.id] : 'ERROR'
      st.trials.push({ variant: it.variant, base: it.base, text: it.text, fired: fired })
      if (fired === it.skill) st.x++
      st.n++
    }
    // Evaluate the breaker AFTER this round's worth of trials, per skill.
    const stillActive = []
    for (const s of active) {
      const st = state[s]
      const w = wilson(st.x, st.n)
      if (st.n >= 30) { st.done = true; continue }
      if (st.n >= 10 && w.half <= 0.08) { st.done = true; st.stopped_early = true; continue }
      stillActive.push(s)
    }
    active.length = 0
    for (const s of stillActive) active.push(s)
  }

  // 3. Serialize per skill (same shape as baseline repeatSkill()).
  const perSkill = []
  const trialsBySkill = []
  for (const s of Object.keys(state)) {
    const st = state[s]
    if (st.error) { perSkill.push({ skill: s, error: st.error }); trialsBySkill.push({ skill: s, trials: [] }); continue }
    const w = wilson(st.x, st.n)
    perSkill.push({
      skill: s, n: st.n, activations: st.x,
      proportion: Math.round(st.x / st.n * 10000) / 10000,
      wilson_ci: [Math.round(w.lo * 10000) / 10000, Math.round(w.hi * 10000) / 10000],
      wilson_ci_nominal: channel !== 'v1.0-single',
      stopped_early: !!st.stopped_early,
    })
    trialsBySkill.push({ skill: s, trials: st.trials })
  }
  return {
    metric: 'L1.3',
    channel: channel === 'v1.0-single' ? 'v1.0-single' : ('v1.1-batched-K' + (batchK && batchK > 0 && batchK <= 15 ? batchK : 15)),
    schedule: 'batch5-min10-target20-max30-halfwidth0.08',
    per_skill: perSkill,
    trials_by_skill: trialsBySkill,
  }
}

// Round-robin interleave a flat item list so consecutive items rotate through skills —
// guarantees no same-skill cluster lands inside a K-sized router call (SPEC v1.1 rule 2).
function interleaveBySkill(items) {
  const bySkill = {}
  const order = []
  for (const it of items) { if (!bySkill[it.skill]) { bySkill[it.skill] = []; order.push(it.skill) } bySkill[it.skill].push(it) }
  const out = []
  let remaining = items.length
  while (remaining > 0) {
    for (const s of order) {
      const q = bySkill[s]
      if (q.length) { out.push(q.shift()); remaining-- }
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// CONTROL ROWS (SPEC v1.1 rule 3 equivalence demonstration) — re-measure a set of
// stable/unfixed skills against a PINNED catalog passed in args, so channel is the only
// variable vs the reference. Same L1.2 machinery, tagged as control.
// ---------------------------------------------------------------------------
async function measureControls(controls, channel, batchK) {
  if (!controls || !controls.pinnedCatalog || !controls.promptSets || !controls.promptSets.length) return null
  const res = await measureL12(controls.pinnedCatalog, controls.promptSets, channel, batchK)
  res.role = 'equivalence-control'
  res.pinned_catalog_sha = controls.catalogSha || null
  res.note = 'Control rows re-measured against a pinned reference catalog so the router CHANNEL is the only variable vs the baseline Wilson CIs (SPEC v1.1 rule 3).'
  return res
}

// ===========================================================================
// MAIN — everything comes from `args`. No hard-coded results dir, date, label.
// The workflow RETURNS the result JSON; the caller (main session) writes files.
// ===========================================================================
// Normalize args: some harnesses deliver the args input as a JSON-encoded string.
const A = (function () {
  if (typeof args === 'undefined' || args === null) return {}
  if (typeof args === 'string') { try { return JSON.parse(args) } catch (e) { throw new Error('l1-delta: args arrived as a string that is not valid JSON.') } }
  return args
})()
// Portability (v0.20.0 N1-family fix): no baked-in machine path — every environment passes its own kit root.
const KIT = A.kit ? String(A.kit) : (() => { throw new Error('l1-delta: A.kit required (absolute path to the kit root).') })()

// ---- Refuse-to-clobber guard (the defect this script fixes) ----------------
// The output dir is chosen by the CALLER (A.outDir). This script never writes files,
// but it validates the caller's intent so a delta run can never be aimed at a frozen
// baseline dir. Any path containing a "-baseline" results segment is refused.
const OUT_DIR = (A.outDir !== undefined && A.outDir !== null) ? String(A.outDir) : null
if (!OUT_DIR) throw new Error('l1-delta: A.outDir is required (the caller-chosen results dir; this script returns JSON for the caller to write there).')
if (/\/results\/[^/]*baseline[^/]*(\/|$)/.test(OUT_DIR) || /-baseline(\/|$)/.test(OUT_DIR)) {
  throw new Error('l1-delta: refusing to run — resolved output dir "' + OUT_DIR + '" targets a frozen baseline results dir. Delta/re-measure runs MUST write to a NEW dated dir (e.g. results/<date>-<label>/). The 2026-07-03-baseline tree is frozen (HARNESS-SPEC §2.3 / §7).')
}
const DATE = (A.date !== undefined && A.date !== null) ? String(A.date) : null
if (!DATE) throw new Error('l1-delta: A.date is required (no argless new Date() in this runtime — pass the date).')
const LABEL = (A.label !== undefined && A.label !== null) ? String(A.label) : 'delta'
if (/^baseline$/i.test(LABEL)) throw new Error('l1-delta: refusing label "baseline" — that label belongs to the frozen 2026-07-03 run.')
const SPEC_VERSION = (A.specVersion !== undefined && A.specVersion !== null) ? String(A.specVersion) : '1.1'
const CHANNEL = (A.channel !== undefined && A.channel !== null) ? String(A.channel) : 'v1.1-batched'   // 'v1.0-single' | 'v1.1-batched'
const BATCH_K = (A.batchK !== undefined && A.batchK !== null === 'number') ? A.batchK : 15

// ---- Scope: which packs/skills/metrics run, plus the reused prompt/variant sets --------
// A.scope = [
//   { pack, catalog, runL12, l12PromptSets:[{skill,prompts}], runL13,
//     l13Skills:{skill:{variants:[{id,text,base}]}} }   // PRE-AUTHORED variant pools, reuse-verbatim
// ]
// Prompt/variant sets are PRE-AUTHORED and passed in (reuse-verbatim). This script NEVER authors prompts.
const SCOPE = (Array.isArray(A.scope)) ? A.scope : []
if (!SCOPE.length) throw new Error('l1-delta: A.scope must be a non-empty array of pack scopes ({pack, catalog, runL12/l12PromptSets, runL13/l13Skills}).')

// ---- Equivalence controls (SPEC v1.1 rule 3), optional but required for batched headline moves --
const CONTROLS = (A.controls !== undefined && A.controls !== null) ? A.controls : null

log('l1-delta start: date=' + DATE + ' label=' + LABEL + ' channel=' + CHANNEL + ' K=' + BATCH_K + ' spec=' + SPEC_VERSION + ' packs=' + SCOPE.length + ' outDir=' + OUT_DIR)

const packResults = await parallel(SCOPE.map(function (sc) {
  return async function () {
    if (!sc || !sc.catalog) return { pack: sc ? sc.pack : 'unknown', error: 'no-catalog' }
    const catalog = sc.catalog
    const out = { pack: sc.pack, catalog_provided: true }
    if (sc.runL12 && Array.isArray(sc.l12PromptSets) && sc.l12PromptSets.length) {
      out.l12 = await measureL12(catalog, sc.l12PromptSets, CHANNEL, BATCH_K)
      out.l12.pack = sc.pack; out.l12.spec_version = SPEC_VERSION
    }
    if (sc.runL13 && sc.l13Skills && Object.keys(sc.l13Skills).length) {
      out.l13 = await measureL13(catalog, sc.l13Skills, CHANNEL, BATCH_K)
      out.l13.pack = sc.pack; out.l13.spec_version = SPEC_VERSION
    }
    log('pack ' + sc.pack + ' done: L12=' + (out.l12 ? 'yes' : 'no') + ' L13=' + (out.l13 ? Object.keys(sc.l13Skills).length + ' skills' : 'no'))
    return out
  }
}))

const controlResult = await measureControls(CONTROLS, CHANNEL, BATCH_K)

// The workflow RETURNS the assembled result; the main session writes it under OUT_DIR.
// No recorder agents (closes HD-9's recorder-truncation channel for delta-sized payloads).
return {
  spec_version: SPEC_VERSION,
  layer: 1,
  kind: 'l1-delta',
  date: DATE,
  label: LABEL,
  out_dir: OUT_DIR,
  channel: CHANNEL === 'v1.0-single' ? 'v1.0-single' : ('v1.1-batched-K' + (BATCH_K > 0 && BATCH_K <= 15 ? BATCH_K : 15)),
  batch_k: CHANNEL === 'v1.0-single' ? null : (BATCH_K > 0 && BATCH_K <= 15 ? BATCH_K : 15),
  models: { author: 'none (pre-authored sets reused verbatim)', router: 'claude-haiku-4-5' },
  wilson_ci_note: CHANNEL === 'v1.0-single' ? 'exact-coverage single-call channel' : 'NOMINAL — trial independence weakened by batching even with cross-skill interleave (SPEC v1.1 rule 5); directional bounds.',
  equivalence_controls: controlResult,
  packs: packResults.filter(Boolean),
}
