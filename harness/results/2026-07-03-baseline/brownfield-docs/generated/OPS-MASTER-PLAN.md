# Trailhead Collective — Operations Master Plan

> **Status: active.** This is the declared source of truth for how the business runs.
> Referenced from README.md and CLAUDE.md. When a playbook disagrees with this document,
> this document wins. Superseding it requires a governance decision.
>
> Last structural revision: 2026-06-15.

## 1. What the business is

Trailhead Collective is a four-depot outdoor-gear rental network in the Cascade Foothills
region. We rent gear across four lines — backpacking, climbing, paddle, and winter — from
four staffed depots. The business is founder-owned and seasonally staffed.

## 2. The four depots

| Depot | Opened | Primary gear lines | Peak load |
|---|---|---|---|
| Pinecrest | 2023 | backpacking, climbing | summer |
| Ridgeway | 2024 | backpacking, winter | winter |
| Stonebrook | 2024 | paddle, backpacking | summer |
| Larkfield | 2026-03 | winter, climbing | winter |

Larkfield is the newest and least mature; its playbooks are still being filled in.

## 3. The operating year

- **Summer peak — June through August.** Highest volume. Backpacking and paddle carry it.
- **Winter peak — December through February.** Winter and climbing gear carry it.
- **Two shoulder seasons** (spring, fall) are for maintenance, re-verification of playbooks,
  and planning. The doc-freshness audit runs in shoulder season.

## 4. The non-negotiables

1. **Gear out must come back.** Recovery discipline and deposit holds are the margin, not
   overhead. The gear-recovery protocol is a top-tier playbook.
2. **Deposits protect the fleet.** Every rental carries a deposit hold sized to replacement
   cost. Refund discipline is governed policy, not clerk discretion.
3. **Decisions are logged.** Anything that changes how a depot operates, what we spend, or
   who we integrate with goes in the governance ledger before it takes effect.
4. **We do not overspend the shoulder seasons.** Cash is tight between peaks; recurring
   commitments are governance decisions with money gates, not casual sign-ups.

## 5. Governance model

- Strategic and money-stakes calls are recorded in `governance/DECISIONS.md` as numbered
  decisions (D1, D2, …), appended in sequence and never rewritten.
- External tools and services are vetted through `governance/INTEGRATIONS-REGISTRY.md`.
  Nothing is integrated without a proposal and a founder bootstrap of its credentials
  (see D4).
- Spend above the depot-level threshold requires an explicit signed authorization
  decision with a stated ceiling (see D6 for the current instance).

## 6. Documentation model

- All operating knowledge lives in `docs/` as one-topic-per-file playbooks.
- Freshness is tracked by the `verified:` date in each file's frontmatter. Playbooks past
  90 days are due for re-verification during the shoulder-season audit.
- The master plan (this file) sits above the playbooks. Playbooks implement it; they do
  not override it.

## 7. Roadmap (as of 2026-06-15)

- Finish Larkfield's onboarding and staffing playbooks (opened late, still thin).
- Complete the summer-peak freshness audit across all depot-facing playbooks.
- Decide on the drysuit supplier once summer paddle numbers are in (comparison archived).
