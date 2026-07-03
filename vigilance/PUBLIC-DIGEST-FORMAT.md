# Weekly Public Digest — format spec

> The public-facing surface of the vigilance loop (`workflows/KIT-VIGILANCE.md`). The internal
> Weekly Synthesis is an action-triage for the maintainer; the **public digest** is the reader-facing
> distillation of it — what moved upstream, what it means for people who use the kit, what changed,
> and what's still open. One issue per ISO week.

## Channel

- **Primary:** GitHub Releases (a lightweight release note tagged `digest-YYYY-WW`) **or** a pinned GitHub Discussion in a `Digest` category. Both are indexable, subscribable, and permalink-stable.
- **Not** email, not a newsletter platform, not X (the X post links here). One canonical home; everything else points to it.

## Honest-numbers inheritance (non-negotiable)

The digest inherits the harness doctrine. Concretely:

1. **Every claim about upstream is dated and verified.** "Anthropic shipped X on YYYY-MM-DD (verified: <primary link>)." No undated "recently."
2. **No unverified counts.** If you cite adoption/stars/downloads, cite the source and its as-of date, or don't cite it. Cache-stale numbers are marked stale.
3. **No marketing multipliers.** The digest never says "N× faster" or "up to X%" about the kit or anything else — same rule as the README.
4. **Kit-status numbers resolve to committed artifacts.** Any figure about the kit's own state (grades, defect counts, spend) links to the file it comes from, exactly as the README does.
5. **Open counts are real counts.** The friction-report count is the actual open count at publish time, each with its current disposition state — not a rounded "a handful."

## Required sections (in order)

Every weekly digest has these five sections. A section with nothing to report says so explicitly ("No upstream BLOCKER/HIGH items this week") rather than being omitted — an empty section is a signal, not a gap.

### 1. What moved upstream this week (dated + verified)
The ⚠ HIGH and 🚨 BLOCKER items that survived the week's synthesis, each as: one-line description · date · severity tag · primary-source link. Model releases, breaking framework changes, spec evolutions, security advisories. Items that appeared once and never again (hype) are excluded by the dwell-time gate — they stay in the internal dailies, not here.

### 2. What it means for kit users
The "so what." For each item in §1 that touches how someone uses the kit: does it change a recommended pattern, deprecate a piece of guidance, or open a gap? Written for a reader who runs the kit, not for the maintainer. If §1 has nothing actionable for users, say "no user-facing impact this week."

### 3. Kit changes — shipped / queued
What actually changed in the kit this week, and what's queued. Shipped items link to the commit or release. Queued items name their target version (e.g. "v0.20.1") and their home in the disposition file. This is where the loop closes visibly: upstream signal → kit change.

### 4. Open friction reports + disposition status
A short table: open report count, and per report a bucket (not a client name), a one-line summary, and its current disposition state (triaged / fixed-pending-release / deferred-with-reason / needs-info). This is the public face of the zero-silent-drops guarantee. Zero open reports is stated as "0 open."

### 5. Next-week watch items
The 🟡 MEDIUM items being monitored for dwell-time — things that might graduate to §1 next week if signal sustains. Explicitly speculative; labelled as watch, not as fact.

## Template skeleton

```markdown
# DirectiveForge Weekly Digest — YYYY-WW (week of YYYY-MM-DD)

## 1. What moved upstream
- [⚠/🚨] <one line>. <YYYY-MM-DD>. (verified: <primary link>)
  *(or: "No ⚠+ items this week.")*

## 2. What it means for kit users
- <plain-English implication, or "no user-facing impact this week">

## 3. Kit changes
**Shipped:** <item> (<commit/release link>)
**Queued:** <item> → <target version> (<disposition-file link>)

## 4. Open friction reports
| bucket | summary | disposition |
|---|---|---|
| <bucket> | <one line> | <state> |
*(N open · or "0 open")*

## 5. Next-week watch
- 🟡 <item being monitored for dwell-time> — watch, not yet actionable.

---
*Numbers about the kit link to committed artifacts. Upstream claims are dated + primary-sourced. No unverified counts, no marketing multipliers.*
```

## Cadence + provenance

- **Published:** weekly, after the Sunday internal synthesis (`prompts/dispatch/WEEKLY_SYNTHESIS.md`).
- **Derived from:** that week's daily digests (`vigilance/feed/daily/`) and synthesis (`vigilance/feed/weekly/YYYY-WW.md`) — the digest is the public distillation, not a new scan.
- **Not auto-published.** Like every kit output, a digest is reviewed before it ships (KIT-VIGILANCE anti-pattern #1: no auto-merge). The vigilance loop produces the candidate; a human approves the issue.
