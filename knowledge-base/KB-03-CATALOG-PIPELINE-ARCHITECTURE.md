# KB-03: Multi-Source Catalog Pipeline Architecture (May 2026)

> **Purpose**: Reusable patterns for building production-grade reference catalogs from heterogeneous public sources — structured APIs, polite HTML scraping, open knowledge graphs, image CDNs. Use this when the project's core deliverable is a *normalized reference dataset* (products, books, ingredients, places, equipment, vehicles) rather than transactional data.
>
> **Audience**: Engineers and AI agents bootstrapping data pipelines that must (a) merge multiple imperfect sources, (b) survive source-side schema drift, (c) produce typed, validated, queryable artifacts (JSON + SQLite + TypeScript types), (d) include rich media. The patterns are language-agnostic but examples lean on Python (pydantic v2, httpx, selectolax) — substitutable.
>
> **Companion**: KB-01 covers the AI-assisted workflow that builds these pipelines; KB-02 covers project infrastructure. KB-03 is the *data architecture* layer.
>
> **Provenance**: These patterns were originally distilled from a real-world multi-source catalog pipeline (v1 → v2 rewrite in the same month). The fully-instantiated worked example — with original entity counts, source domains, byte sizes, and runtime numbers — lives at the private lab's worked instance (not shipped). This document holds only the domain-agnostic patterns.

---

## Table of Contents

1. [The Problem: Reference Catalogs Are Different](#1-problem)
2. [The Five-Layer Identity Schema](#2-five-layer-schema)
3. [Source Cascade Pattern](#3-source-cascade)
4. [Match Cascade Architecture](#4-match-cascade)
5. [Single-Pass Scrape: Don't Split Phases](#5-single-pass)
6. [Deferred Image Processing Pipeline](#6-image-processing)
7. [Multi-Tier Resolution Discovery](#7-resolution-discovery)
8. [Polymorphic Media Table](#8-polymorphic-media)
9. [Migration Via Identity Tuples](#9-migration)
10. [Thread-Safe Rate-Limited HTTP](#10-rate-limit)
11. [Knowledge-Graph Reality Check](#11-knowledge-graph-reality)
12. [Anti-Patterns](#12-anti-patterns)
13. [Filter Capability Comparison](#13-filter-comparison)

---

## 1. The Problem: Reference Catalogs Are Different {#1-problem}

A *reference catalog* (products, equipment models, books, places) is not a transactional database. It has these distinguishing properties:

- **Append-mostly, never deleted.** A 1995-vintage entity still exists even though it's no longer for sale or in production.
- **Stable IDs across years.** A user's bookmark must still resolve five years later.
- **Multi-source merge required.** No single public source has 100% coverage. You merge 2-4.
- **Media is a first-class entity.** A catalog without images is a spreadsheet. Multiple images per entity.
- **i18n is mandatory.** At least two languages — usually a regional pair plus English.
- **License posture per record.** Some images are CC-BY (safe to ship), some are scraped (fair-use internal).
- **Idempotent + resumable.** Re-running on a warm cache must produce byte-identical outputs.

Transactional database patterns (event sourcing, CQRS, sharding) are **wrong** here. The right patterns are: pydantic-validated JSON exports, SQLite with FK + indexes, TypeScript types as the contract, separated raw / intermediate / final stages.

---

## 2. The Five-Layer Identity Schema {#2-five-layer-schema}

Real reference domains rarely fit "category + item". They have layered identity that update on different cadences. The pattern is to model **five tiers** of progressively narrower identity:

```
Tier 1   ←  brand / publisher / manufacturer entity     (rarely changes)
  └─ Tier 2     ←  named product family                 (occasional additions)
       └─ Tier 3     ←  lifecycle / edition             (major revisions)
            └─ Tier 4     ←  visual / regional variant  (mid-cycle changes)
                 └─ Tier 5     ←  fully-specified SKU   (combinatorial leaf)
```

**Key insight**: each tier has DIFFERENT update cadence and DIFFERENT source authority.

| Tier | Best source role | Cadence | Why |
|---|---|---|---|
| 1 | Structured API / industry list | yearly | Top-level entities rarely appear/die |
| 2 | Structured API + knowledge graph | quarterly | Owners add families |
| 3 | HTML catalog scrape | quarterly | Year ranges drift |
| 4 | HTML scrape | monthly | Variant announcements |
| 5 | Detail-page scrape | monthly | Spec combinations multiply |

**Polymorphic Media** sits orthogonal to this hierarchy — see §8.

This schema is **strictly more granular** than what most public sites expose to filters (incumbents collapse Tier 5 into a free-text string). Granularity is leverage: filtering precisely needs Tier 5 records, not free text.

### Schema enforcement

Every record round-trips through pydantic v2 with `extra="forbid"` before being written to disk:

```python
class Tier4Variant(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: KebabId                       # ^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$
    parent_id: KebabId                # FK to Tier 3
    variant_kind: VariantKind         # closed enum
    year_from: int | None = Field(default=None, ge=1800, le=2100)
    year_to: int | None = Field(default=None, ge=1800, le=2100)
    is_refresh: bool | None = None    # null = unknown (per spec)
    refresh_label: str | None = None
    label_en: str = Field(min_length=1)
    label_l2: str | None = None       # regional language 1
    label_l3: str | None = None       # regional language 2
```

`extra="forbid"` is non-negotiable: it catches "I added a field, forgot to update the schema" silent breakage at the boundary.

---

## 3. Source Cascade Pattern {#3-source-cascade}

A reference catalog merges sources in **strict descending authority** per field. Abstract the sources by role rather than by name:

- **Source A** — primary structured API (best coverage of names, parent relations, country).
- **Source B** — HTML scrape with hydration JSON embedded in `<script>` blobs (best coverage of specs, year ranges, gallery images).
- **Source C** — open knowledge graph (best coverage of cross-language labels, canonical IDs, dimensional facts).
- **Source D** — public image CDN / render service (best coverage of high-resolution media).

The cascade per field looks like:

```
Field             Source 1 (authority)   Source 2 (fallback)    Source 3 (last resort)
────────────────  ─────────────────────  ─────────────────────  ─────────────────────
id                Generated (slugify)    —                      —
name_en           Source A               Source C label@en      —
name_l2           Source A               Source C label@l2      —
name_l3           Source C label@l3      L3-wiki H1             enwiki langlinks → l3
country           Source A               Source C "country" prop —
year_from         Source C "inception"   Source B catalog page  —
graph_id          Source C SPARQL match  —                      —
images (logo)     Source C "logo" prop   Source C commons       open logo registry
images (gallery)  Source C commons       Source B galleries     Source D rendered CGI
specs (technical) Source B scrape        —                      (Source C — see §11)
```

The cascade is **explicit and audited**: every record carries a `_source` provenance field (e.g. `name_l3_source: "l3_wiki" | "graph" | "transliterated" | "manual"`). When sources disagree, the higher-authority source wins but the conflict is logged to `data/intermediate/<phase>/conflicts.json` for review.

### Why the cascade matters

- **Coverage**: Source A has 100% of names in scope but no specs. Source B has specs but missing some entities. Source C has a third-language label for a minority of records. The union beats any single source.
- **Robustness**: If Source A's API goes down, fall back to its mirror. If Source B changes URL structure, Source C still gives you the entity.
- **License layering**: Source C images are typically CC-BY (safe to redistribute); scraped images are fair-use internal (`license_safe_for_public=false`). The cascade selects the safest available.

### Pattern: confidence-scored merge

```python
@dataclass
class FieldClaim:
    value: Any
    source: str
    confidence: int  # 100 (verified) ... 50 (fuzzy) ... 0 (rejected)
    timestamp: str

# Merge order: higher confidence wins; ties broken by source order.
def merge_field(claims: list[FieldClaim]) -> Any | None:
    valid = [c for c in claims if c.confidence >= 80]
    if not valid:
        return None
    valid.sort(key=lambda c: (-c.confidence, SOURCE_RANK[c.source]))
    return valid[0].value
```

When confidence < 80, route to `ambiguous.json` for human review. Don't auto-apply. **Conservative wins over aggressive in catalogs.**

---

## 4. Match Cascade Architecture {#4-match-cascade}

Cross-source merge requires resolving "this record on Source A == that record on Source B". Naïve exact-string match leaks data — a real v1 of this pipeline lost roughly a quarter of its scrape URLs because `dict.get((parent, child))` failed on slug variants.

**The right structure is a priority cascade with explicit logging:**

```
Tier 1: alias override (human-curated)
Tier 2: exact slug equality
Tier 3: separator normalization (hyphen ↔ underscore)
Tier 4: corporate-suffix stripping (<vendor>-<legalentity> → <vendor>)
Tier 5: prefix-strip cascade (<parent>/<child-with-suffix> → <parent>/<child>)
Tier 6: rapidfuzz with length-delta guard
Tier 7: explicit reject (out-of-scope)
Tier 8: log to unmatched.json
```

Each match emits a `MatchAudit` JSONL line:

```json
{"source_url":"…","src_parent":"<a>","src_child":"<b><suffix>","step":"prefix_strip",
 "matched_parent":"<a>","matched_child":"<b>","notes":"<b><suffix>→<b>"}
```

**Why this matters**:

- **Forensic**: when a future bug surfaces, you can trace exactly which rule made the decision.
- **Tunable**: distribution analysis (e.g. "5% of matches went via fuzzy, suggesting an alias-map gap") tells you which tier to extend.
- **Reversible**: the alias map lives in one file; changes are reviewable in code review.

### Length-delta guard for rapidfuzz

Pure rapidfuzz silently merges near-neighbors that differ only by a sub-trim suffix: `<name>` vs `<name> <suffix>` will score 85-92%. Add `abs(len(a) - len(b)) <= 3` as a hard guard. This is the single most impactful tweak for fuzzy matching in a catalog domain.

### Hardcoded alias map structure

```python
# source slug → canonical id, or None to explicitly reject.
PARENT_ALIASES: dict[str, str | None] = {
    # Recoverable variants
    "<vendor_a_alt_slug>": "<vendor_a_canonical>",
    "<vendor_b_alt_slug>": "<vendor_b_canonical>",
    # Out of scope (explicit reject)
    "<out_of_scope_1>": None,
    "<out_of_scope_2>": None,
}
```

The `None` value is the equally-important half: explicit out-of-scope reject. Without it, hundreds of out-of-scope URLs would either pollute the catalog or end up in the "unmatched" bucket creating false alarms.

---

## 5. Single-Pass Scrape: Don't Split Phases {#5-single-pass}

The temptation: split scraping into Phase 3 (catalog metadata) and Phase 3.5 (detail-page specs). The reasoning: cleaner phases, separate concerns.

**Reality**: the same HTML page contains catalog metadata AND specs. A split fetches the page twice (or maintains an intermediate `parsed-pages.jsonl`) — wasted work and a checkpoint-management surface.

**Single-pass rule**: each scraped page emits ALL downstream record types in one pass:

```python
@dataclass
class ParsedPage:
    url: str
    # Catalog metadata (Tier 3/4)
    variant_kind: VariantKind | None
    year_from: int | None
    year_to: int | None
    edition_name: str | None
    is_refresh: bool | None
    # Tier 5 specs (was Phase 3.5 in v1)
    leaf_specs: list[dict]      # ← parsed in same pass
    # Image URLs for the deferred media phase
    gallery_image_urls: list[str]
```

Then `cluster_to_editions()` returns `(editions, variants, leaves, image_urls)` from a single pass over `parsed_pages: list[ParsedPage]`.

**Tradeoff**: the `parse_page()` function is bigger (~150 lines) but each downstream record type stays cohesive. Tests are easier — one fixture HTML drives all assertions.

**When to split**: only when the second source is on a *different domain* with an independent rate limit, or if the second source has 10x lower coverage than the first (so you scrape it for a small subset only).

### Hydration-JSON extraction

Modern HTML pages embed structured data in `<script type="application/json">` blobs (or `__NEXT_DATA__`, `window.__INITIAL_STATE__`, etc.) for client-side hydration. **Always prefer parsing those blobs over regexing the rendered DOM.** A CSS-class hash change can break a regex overnight; the hydration payload is far more stable because it ships the page's data model.

```python
for node in tree.css('script[type="application/json"]'):
    try:
        blob = json.loads(node.text())
    except json.JSONDecodeError:
        continue
    if "specs" in blob:
        yield from blob["specs"]
```

---

## 6. Deferred Image Processing Pipeline {#6-image-processing}

A catalog has thousands of images per top-tier entity. The pipeline is:

```
URL  ──fetch──▶  raw bytes  ──Pillow assess──▶  accepted | rejected
                                                    │
                              ┌─────────────────────┴──────────────────────┐
                              ▼                                            ▼
                  Pillow resize × 3 widths             Reject log (sha256, reason)
                   (320 / 640 / 1280)
                              │
                  ┌───────────┴────────────┐
                  ▼                        ▼
              WebP (q=85)              JPEG (q=88)
              Disk write              Disk write
                              │
                              ▼
                  Media record (pydantic)
                  + sha256 dedup index
```

**Tiered acceptance** — a hard 800px floor is wrong for older catalogs (vintage entities rarely have hi-res):

- Target: width ≥ 800px → `low_res=False`
- Fallback: 480 ≤ width < 800px → `low_res=True` (accept but flag in UI)
- Reject: width < 480px → log to `rejected_too_small.json`, discard
- Aspect guard: 1.2 ≤ w/h ≤ 2.5 (excludes weirdly-cropped)
- Special case: logos relax aspect to 0.3-3.5 (logos are often square or tall)

**Output naming**: `<source>-<id>-<size>.<format>` flat per parent directory:

```
data/final/images/tier4/<entity-slug>/
  src_b-00-thumb.webp   320px
  src_b-00-thumb.jpg
  src_b-00-card.webp    640px
  src_b-00-card.jpg
  src_b-00-full.webp    1280px (or original if smaller — never upscale)
  src_b-00-full.jpg
  src_b-01-thumb.webp   ... (next image)
  src_d-front_3q-2014-thumb.webp  ... (CGI render with angle/year)
```

**Why 3 sizes × 2 formats**:

- WebP for modern browsers (smaller, better quality).
- JPEG fallback for old browsers and email/PDF embedding.
- 320 (thumb in lists) / 640 (cards) / 1280 (lightbox) covers the responsive layout matrix.

**SVG special case**: vector logos save as `logo.svg` only — no Pillow round-trip, no fan-out. All `url_thumb/url_card/url_full` point to the same `.svg` file. The browser scales for free. Pillow can't open SVG natively (without a `cairosvg` dep) so detect SVG by URL extension or magic bytes and short-circuit.

---

## 7. Multi-Tier Resolution Discovery {#7-resolution-discovery}

Web sources lie about image resolution. Filenames are not metadata.

A representative URL pattern (sanitized):

```
URL pattern                                    Decoded width
/photos/fullsize/<parent>/<child>/p144_*.jpg   144 px (NOT "fullsize")
/photos/fullsize/<parent>/<child>/p168_*.jpg   168 px (still tiny)
/photos/fullsize/<parent>/<child>/p1200_*.jpg  1024 px (real fullsize)
/photos/fullsize/<parent>/<child>/<a>_<b>.jpg  ~800 px (no prefix)
/photos/editions/500x_*.jpg                    162 px (despite "500x_")
```

The `/photos/fullsize/` path is misnamed: filenames embed the actual rendered HEIGHT in pixels (`p<N>_`). The catalog HTML uses `p144_` / `p168_` for inline thumbnails, but the lightbox JavaScript substitutes `p1200_` for the gallery shot.

**Pattern**: for every public image source, write a probe script that:

1. Picks 5-10 known URLs.
2. Fetches each and **measures actual pixel dimensions** with Pillow.
3. Tries URL pattern transforms (replace prefix, swap path component, append size hint).
4. Reports which transform yields the largest valid image.

```python
def _upgrade_url(url: str) -> str:
    """Catalog inlines p144_/p168_ (3-5 KB thumbs); lightbox uses p1200_
    (30-100 KB, ~1024px). Rewrite to p1200_ and fall back to original
    on 404."""
    if "/photos/fullsize/" not in url:
        return url
    return _PREFIX_RE.sub("p1200_", url)


def fetch_with_upgrade(client, original_url, log) -> FetchResult:
    upgraded = _upgrade_url(original_url)
    if upgraded != original_url:
        result = fetch_bytes(client, upgraded, log)
        if result.ok:
            return result
    return fetch_bytes(client, original_url, log)
```

**Cost**: one extra round-trip per item in the worst case (when the upgraded URL doesn't exist). Worth it: order-of-magnitude resolution gain.

This is a source-specific gotcha but the **principle is universal**: never trust the "fullsize" / "original" / "high-res" wording in URLs. Always probe.

---

## 8. Polymorphic Media Table {#8-polymorphic-media}

Catalog images attach at multiple levels: brand logos (Tier 1), family heroes (Tier 2), edition press shots (Tier 3), variant gallery photos (Tier 4). A naïve schema with one image table per entity type causes JOIN explosion in queries.

**Polymorphic pattern**:

```python
class Media(BaseModel):
    id: str                                    # med_<sha256[:16]>
    subject_type: SubjectType                  # tier1 | tier2 | tier3 | tier4
    subject_id: KebabId                        # the parent entity's id (FK by convention)
    role: MediaRole                            # exterior | interior | logo | sketch | ...
    angle: MediaAngle | None                   # front_3q | side | rear | ...  (only for role=exterior)
    year: int | None
    url: str                                   # primary URL (== url_full)
    url_thumb: str | None                      # 320px
    url_card: str | None                       # 640px
    url_full: str | None                       # 1280px
    width: int                                 # actual decoded width
    height: int
    low_res: bool                              # < 800px source
    source: MediaSource                        # graph | scrape | cdn_render | ...
    license: str                               # verbatim from source
    license_safe_for_public: bool              # derived: true only for CC-BY/PD/manual
    sha256: str                                # global dedup key
    is_primary: bool                           # exactly one per (subject_type, subject_id)
```

**Index strategy** in SQLite:

```sql
CREATE INDEX idx_media_subject ON media (subject_type, subject_id);
CREATE INDEX idx_media_safe ON media (license_safe_for_public);
CREATE INDEX idx_media_source ON media (source);
```

**Query patterns it enables**:

- "Show me all images for variant X" → `WHERE subject_type='tier4' AND subject_id=?` — uses the composite index.
- "All images for a Tier-2 family regardless of layer" → join through `tier4 → tier3 → tier2` and union by subject.
- "License audit: how many records can we ship publicly?" → `WHERE license_safe_for_public = true`.

**Primary selection ladder** (one `is_primary=true` per subject):

1. License-safe over license-debt (graph > scrape > rendered).
2. `angle=front_3q` over other angles.
3. Source preference order (configurable).
4. Largest original resolution.
5. Most recent year.

**Multiple primaries are a hard rule violation** in QA. Zero primaries (a subject with no media) is allowed but flagged as a soft warning.

---

## 9. Migration Via Identity Tuples {#9-migration}

When the schema or matching logic changes between versions, the IDs of records may change too. A common failure mode: v1 used a buggy ID generator (e.g. double-stamping a segment like `<a>-<b>-<b>-<suffix>`); v2 generated cleaner IDs. Tens of gigabytes of v1 image files need to be remapped to v2 IDs, not re-downloaded.

**Pattern**: identity tuples for cross-version mapping.

```python
def _variant_key(v: dict) -> tuple:
    """The natural identity of a Tier-4 variant — independent of the ID
    generation scheme used by any version."""
    parent_id = v["parent_id"]
    grandparent_id = "-".join(parent_id.split("-")[:-1])
    return (grandparent_id, v["variant_kind"], v["is_refresh"], v["year_from"], v["year_to"])

# Build lookup: identity tuple -> v2 id
v2_by_key = {_variant_key(v): v["id"] for v in v2_records}

# Compute v1 -> v2 mapping
id_map = {v1["id"]: v2_by_key[_variant_key(v1)] for v1 in v1_records if _variant_key(v1) in v2_by_key}
```

**Steps**:

1. Compute `id_map: dict[v1_id, v2_id]`.
2. For each v1 record without a v2 counterpart → `v1_orphans.json` (media will be lost).
3. For each v2 record without a v1 counterpart → no action (the incremental phase will fill).
4. **Pre-flight collision check**: detect cases where multiple v1 IDs map to the same v2 ID. Resolve deterministically (smallest v1 ID wins; others go to orphans). **Abort if collisions can't be resolved.**
5. Apply atomically: `mv` directories, rewrite `subject_id` and `url` fields in `media.json`.

**Critical rule**: do this in dry-run first. The script should print a delta report (renames, orphans, collisions, net-new) without touching disk. Apply only after manual approval.

**What NOT to do**: try to make IDs "stable" by keeping v1 conventions. v1 had bugs in those conventions; the rewrite is a chance to fix them. Migration is the cleanup phase.

---

## 10. Thread-Safe Rate-Limited HTTP {#10-rate-limit}

Naïve scraping is single-threaded with `time.sleep()` between requests. A single thread is wasteful — while it's rate-limit-sleeping, no Pillow encoding happens. But N parallel threads each with their own rate-limiter become N×N r/s and trip 429s.

**Right pattern**: shared token-bucket rate limiter accessed under a lock.

```python
class CachedHttpClient:
    def __init__(self, ...):
        self._last_request_at: dict[str, float] = {}
        self._rate_lock = threading.Lock()

    def _wait(self, domain: str) -> None:
        """Reserve the next slot for this domain; sleep until then."""
        min_iv = DOMAIN_MIN_INTERVAL_SEC.get(domain, DEFAULT_MIN_INTERVAL_SEC)
        with self._rate_lock:
            now = time.monotonic()
            last = self._last_request_at.get(domain, 0.0)
            scheduled = max(now, last + min_iv)
            self._last_request_at[domain] = scheduled  # reserve
        wait = scheduled - time.monotonic()
        if wait > 0:
            time.sleep(wait)              # sleep OUTSIDE the lock
```

N worker threads × shared limiter @ R r/s = aggregate **R r/s**, but Pillow encoding happens in parallel during the sleep windows. Order-of-magnitude speedups are typical when image fetch is the bottleneck.

**Per-domain rate map** (illustrative — discover real values per source):

```python
DOMAIN_MIN_INTERVAL_SEC = {
    "source-b.example":          1.0,    # catalog server — strictest
    "cdn.source-b.example":      0.2,    # CDN — looser, 5 r/s
    "upload.source-c.example":   0.5,    # 429s aggressively above 2 r/s
    "cdn.source-d.example":      0.2,    # CGI render service — generous
    "query.source-c.example":    0.2,    # SPARQL endpoint
}
```

**Retry-After respect**:

```python
if r.status_code == 429:
    retry_after = _parse_retry_after(r.headers.get("retry-after"))
    if retry_after is not None and retry_after <= 120:
        time.sleep(retry_after + 0.5)
        # retry once
    if r.status_code == 429:
        raise RateLimitedError("countermeasure detected; stop and log per spec")
```

Honoring Retry-After is etiquette, **not** bypassing. The hard rule is: don't solve captchas, don't rotate IPs, don't change UA to fake a browser. Sleeping when the server says "wait 11 seconds" is the polite thing.

**Key sub-pattern**: separate worker pool sizes per domain class.

```python
WORKERS = 8                    # permissive CDNs, render services
KNOWLEDGE_GRAPH_WORKERS = 2    # stricter sources still 429 at 8 workers even at 2 r/s aggregate
```

Empirically: some sources **rate-limit per concurrent connection**, not just per req-rate. Reducing parallelism without reducing throughput (still 2 r/s) eliminates 429s.

### HTTP cache as a first-class project artifact

The on-disk HTTP cache (keyed by `sha256(method + URL + body)`) is not a debug aid — it's part of the project. A second run on warm cache must hit zero new network for unchanged URLs. This is what makes it cheap to iterate the parser on the same fixture data without re-fetching, and it's also what makes phase resumes near-instant. Treat the cache directory as a deliverable; don't `.gitignore` it on shared dev machines.

---

## 11. Knowledge-Graph Reality Check {#11-knowledge-graph-reality}

Open knowledge graphs (SPARQL-queryable, claim-based) are wonderful in theory and disappointing in practice for technical specs. **Don't plan around fields that aren't actually populated.**

Two failure modes to verify before committing to a schema field:

1. **Coverage is unevenly distributed**: a property that looks central to the domain (e.g. a key dimensional spec) may have *10-40% coverage* across the entity class, while a peripheral property may have 100%. The graph is community-curated, and community attention does not map to your priorities.
2. **Property labels lie**. A property described as "engine displacement" in the public docs may have been internally repurposed and tagged as "depositary" with 0% coverage on your entity class. The string label is documentation; the actual claim distribution is ground truth.

**Counter-strategy**: prove coverage with a probe SPARQL query before designing fields around a property. Five minutes of investigation saves a week of "why is this field always null".

```sparql
SELECT (COUNT(?item) AS ?total) (COUNT(?val) AS ?with_value)
WHERE {
  ?item wdt:P31 wd:<CLASS_ID> .
  OPTIONAL { ?item wdt:<PROPERTY_ID> ?val . }
}
```

Run this for every property you intend to read. If coverage is under ~20%, treat the field as optional and route it through Source B (scrape) as the primary; use the graph only as a fallback. If a property's coverage is 0%, the field belongs entirely outside the knowledge-graph cascade — no amount of merging will populate it.

The pattern generalizes beyond SPARQL to any external schema with optional fields: **measure population before designing**.

---

## 12. Anti-Patterns {#12-anti-patterns}

### "Just normalize the slugs and exact-match"

Two sources will *never* converge on slug conventions. Underscores vs hyphens, English vs transliteration, granular variants vs base names, language-localized labels vs canonical English. Build the cascade. Audit it.

### "We'll add resumability later"

Long phases (image fetch, scrape) MUST be resumable from day one. `_progress.jsonl` per phase, append-only, keyed by item ID. A scrape that takes 25 hours and crashes at hour 23 with no resume is a project-killing event. Phase-gated pipelines with checkpoint files are not a "nice-to-have"; they are the difference between a pipeline you can iterate on and one you fear running.

### "Same logic for all sources"

Different sources have different politeness profiles. A permissive CDN may tolerate 5 r/s; a knowledge-graph endpoint will 429 at 3 r/s with 8 concurrent connections. Per-domain rate config + per-stage worker pools.

### "Trust the URL filename"

`/photos/fullsize/...` may serve a 144x108 thumbnail. `<id>_2018.jpg` may be a placeholder. Probe for actual dimensions; don't trust what the URL implies.

### "We'll merge data sources at query time"

Don't. Merge at write time, in the canonical schema, with provenance. Query-time merging means N times the latency, N times the failure modes, no shared validation.

### "Rate limit per thread"

Each thread getting its own `time.sleep(0.2)` doesn't bound the aggregate rate to 5 r/s. It bounds it to N×5 r/s. Shared lock + reservation protocol is non-optional.

### "Just regex the HTML"

Fine for body-type-like fields and year ranges. Wrong for nested spec tables embedded as JSON in `<script type="application/json">` blobs. Search for application/json scripts and parse the JSON. The output is more stable than regex over rendered HTML, which is one CSS-class hash away from breaking.

### "Skip the audit log; we'll figure it out from the code"

Every match decision (parent, child, variant kind, primary selection) writes one JSONL line. When v2's coverage is 60% and you need to find the missing 40%, the audit log is the difference between 30 minutes and a full week.

### "Always-online assumption"

Production catalogs run from cold-cache rebuilds when an upstream source schema changes. Cache HTTP responses by `sha256(URL + method)` to disk. A second run on warm cache must hit zero new network for unchanged URLs. This makes it cheap to iterate the parser on the same data.

### "Single mega-config"

Resist `config.json` for everything. Code: pydantic schemas, alias maps, per-domain rate tables. Version it, review it, type-check it. Configuration that affects matching logic is code, not config.

---

## 13. Filter Capability Comparison {#13-filter-comparison}

The litmus test for catalog architecture: can your data drive the same filter UX as the incumbent?

A typical incumbent filter card exposes ~9 fields (Tier-1 brand, Tier-2 family, Tier-3 edition, Tier-4 variant kind, plus three or four Tier-5 spec axes and a year range).

A correctly-built catalog with the five-tier schema covers all of them from a single SQL query:

```sql
SELECT v.id, v.label_l2, l.spec_a, l.spec_b, l.spec_c, l.spec_d
FROM tier1 t1
JOIN tier2 t2 ON t2.parent_id = t1.id
JOIN tier3 t3 ON t3.parent_id = t2.id
JOIN tier4 v  ON v.parent_id  = t3.id
JOIN tier5 l  ON l.parent_id  = v.id
WHERE t1.id = '<vendor>'
  AND t2.id = '<vendor>-<family>'
  AND t3.year_from <= 2009 AND (t3.year_to >= 2005 OR t3.year_to IS NULL)
  AND v.variant_kind IN ('<kind_a>','<kind_b>')
  AND l.spec_a = '<value_a>'
  AND l.spec_b = '<value_b>'
  AND l.spec_c BETWEEN 1900 AND 2100
ORDER BY l.spec_d DESC;
```

**What this architecture does NOT and SHOULD NOT cover**:

| Incumbent filter field | Catalog covers? | Why |
|---|---|---|
| Listing tags (new / used / all) | NO | Listing-layer, not catalog-layer |
| Per-listing usage metrics (e.g. mileage) | NO | Per-instance, not per-spec |
| Price range | NO | Commercial data; spec hard rule excludes |
| Listing counts | NO | Listing aggregation |

**These belong to a separate listings layer** that points back to catalog records via `tier4_id` / `tier5_id`. Don't blend them into the catalog. The catalog is the dimension; listings are the fact table.

**Capabilities the catalog can offer BEYOND the incumbent**:

- **Multi-language facets** — incumbents typically expose a single regional language.
- **Compare mode** — diff specs between two Tier-4 variants.
- **Image angle filter** (`media.angle = 'front_3q'`) — incumbents don't expose this.
- **License-safe-only mode** (`license_safe_for_public = true`) — for public deployment without copyright debt.
- **Dimensional fit search** (`width_mm <= ? AND height_mm <= ?`) — for "fits in my space" use cases.
- **Refresh-cycle filter** — incumbents collapse mid-cycle refreshes into a single edition; this exposes them.

This is the strategic value of strict normalization: the schema is *more granular than the public-facing UI* of every major incumbent, so any filter they offer is SQL trivia, and you can offer extras.

---

## Appendix A: When NOT to use this architecture

This KB describes catalog-style reference data. Don't use it for:

- **High-volume transactional data** (orders, events, telemetry) — use streaming + columnar warehouses.
- **Personal data** (users, profiles, preferences) — different access controls, GDPR concerns.
- **Time-series** (price histories, sensor data) — different storage layout (Parquet, Druid).
- **Spatial-first** (maps, GIS) — needs spatial indexes, PostGIS or H3.

The pattern shines for: **append-mostly, multi-source-merged, human-curated, image-heavy reference data with i18n.**

---

## Appendix B: Stage Tooling

Recommended tools per stage (Python; substitutable for other ecosystems):

| Stage | Tool | Why |
|---|---|---|
| HTTP fetch | `httpx` + custom CachedHttpClient | retry, rate limit, on-disk cache |
| HTML parse | `selectolax` (lexbor) | 5-10× faster than BeautifulSoup |
| JSON parse | stdlib `json` | hydration blobs in `<script>` tags are well-formed |
| Schema validation | `pydantic` v2 | strict, fast, generates JSON Schema for free |
| Image processing | `Pillow` | mature, supports WebP + JPEG |
| Fuzzy match | `rapidfuzz` | 5-10× faster than fuzzywuzzy, same API |
| ID generation | `python-slugify` | handles non-Latin transliteration |
| Retry/backoff | `tenacity` | declarative, composable |
| SQLite export | `sqlite-utils` | FK + index management, JSON-friendly |
| TS types | hand-rolled from pydantic | `datamodel-code-generator` works but adds a dep |
| Browser automation | `Playwright` | only when JS-protected; avoid otherwise |
| Task orchestration | `invoke` | shell-flavored Python, no DAG overhead |

**Avoid**: heavy frameworks (Scrapy, Airflow, dbt) for projects under ~100 top-tier entities. They add more ceremony than value at this scale.
