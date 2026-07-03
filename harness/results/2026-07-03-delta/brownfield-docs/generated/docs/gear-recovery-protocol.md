---
owner: founder
verified: 2026-02-14
sources:
  - governance/DECISIONS.md (D2)
  - OPS-MASTER-PLAN.md (section 4)
---

# Gear recovery protocol

Gear out the door has to come back. This playbook governs how a depot chases down
overdue and unreturned rentals before they become fleet losses.

> **Freshness warning (do not silently fix):** this playbook is overdue for
> re-verification. The escalation ladder below still describes the two-strike rule.
> Ridgeway moved to a three-strike rule in April and the change was never propagated
> here. Re-verify against current depot practice before trusting the ladder.

## When a rental goes overdue

A rental is overdue the morning after its due date. The depot that rented it owns the
recovery, regardless of which depot the customer used to book.

## Escalation ladder

1. **Day 1 overdue** — automated courtesy reminder. No hold action yet.
2. **Day 3 overdue** — personal call from the depot. First strike logged.
3. **Day 7 overdue** — deposit hold converted toward replacement cost. Second strike
   logged. Under the old two-strike rule this was the last strike before write-off.
4. **Day 14 overdue** — item written off against the deposit and flagged fleet-lost.

## Deposit interaction

Recovery leans on the replacement-cost deposit hold established in D2. The hold is the
enforcement mechanism; without it the ladder has no teeth. See
`deposit-and-refund-policy.md` for how the hold is placed and released.

## Peak-season note

During summer and winter peaks, recovery lag compounds fast because the same item is
already booked for the next customer. Peak recovery is same-day, not next-morning.
