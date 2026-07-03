# Vigilance Feed Archive

> Digest archive for the kit's daily / weekly / monthly vigilance scans. See `workflows/KIT-VIGILANCE.md` for the doctrine; `prompts/dispatch/DAILY_PULSE_SCAN.md`, `WEEKLY_SYNTHESIS.md`, and `MONTHLY_INTEGRATION.md` for the runnable prompts.

## Folder structure

```
vigilance/
├── WATCHLIST.md              # 32 curated sources (audited quarterly)
├── feed/
│   ├── README.md             # this file
│   ├── daily/                # YYYY-MM-DD.md per day
│   ├── weekly/               # YYYY-WW.md per ISO week (Sunday-written)
│   ├── monthly/              # YYYY-MM.md per month (1st of month)
│   └── quarterly/            # YYYY-Q.md per quarter (1st of Jan/Apr/Jul/Oct)
└── state/                    # per-source delta-detection state (gitignored)
    ├── anthropic-news.json
    ├── claude-code-releases.json
    └── ...
```

## What's tracked vs. gitignored

**Tracked (committed to the repo):**
- `vigilance/WATCHLIST.md` — source list; auditable history of which sources were on the list when.
- `vigilance/feed/daily/*.md` — daily digests. Yes, every one of them. The digests are the project's audit trail.
- `vigilance/feed/weekly/*.md` — weekly synthesis files.
- `vigilance/feed/monthly/*.md` — monthly integration manifests (these contain architect prompts the user reviews).
- `vigilance/feed/quarterly/*.md` — quarterly audit reports.

**Gitignored:**
- `vigilance/state/*.json` — per-source cursor / hash / failure-count state. Machine-local; not useful in version control.

## Reading order

If you're catching up after time away:

1. **Latest weekly synth** (`vigilance/feed/weekly/YYYY-WW.md`) — what's actionable this week.
2. **Latest monthly manifest** (`vigilance/feed/monthly/YYYY-MM.md`) — which architect prompts are queued for kit-integration this month.
3. **Latest quarterly audit** (`vigilance/feed/quarterly/YYYY-Q.md`) — watchlist health + integration-rate trends.

The dailies are useful as forensic record but rarely the right starting point — too much volume, too little aggregation.

## How the cadence stacks compose

```
Daily Pulse (every 08:00 UTC+4 / 04:00 UTC)
   ↓ writes  →  vigilance/feed/daily/YYYY-MM-DD.md
Weekly Synthesis (Sundays 09:00 UTC+4)
   ↓ reads daily/ past 7 days, writes  →  vigilance/feed/weekly/YYYY-WW.md
Monthly Integration (1st of month 10:00 UTC+4)
   ↓ reads weekly/ past 4 weeks, writes  →  vigilance/feed/monthly/YYYY-MM.md
   ↓ each architect prompt in the manifest dispatches a Code session
   ↓ Code session updates the kit (KB section / skill / template / case-study)
   ↓ consequential updates land DECISIONS.md entries per KB-04 §2
Quarterly Audit (manual, Jan/Apr/Jul/Oct)
   ↓ reads all of the above, writes  →  vigilance/feed/quarterly/YYYY-Q.md
   ↓ updates WATCHLIST.md (commits with diff)
```

Skipping a cadence collapses the discipline; see `workflows/KIT-VIGILANCE.md` § Anti-patterns.

## File ownership

The Cowork scheduled tasks own the daily and weekly files (and best-effort the monthly file). The user owns the quarterly audit (manual). The Code sessions dispatched from the monthly manifest own the actual kit updates that follow.

No file in this folder is ever auto-merged back into the kit. The discipline produces *candidates*; the user reviews; Code executes.

## Cross-references

- `workflows/KIT-VIGILANCE.md` — doctrine
- `vigilance/WATCHLIST.md` — current source list
- `prompts/dispatch/DAILY_PULSE_SCAN.md` — daily scheduled-task prompt
- `prompts/dispatch/WEEKLY_SYNTHESIS.md` — weekly scheduled-task prompt
- `prompts/dispatch/MONTHLY_INTEGRATION.md` — monthly integration prompt
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` — the methodology the discipline applies to itself
