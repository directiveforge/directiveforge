---
owner: founder
verified: 2026-02-18
sources:
  - governance/DECISIONS.md (D2, D5)
  - governance/INTEGRATIONS-REGISTRY.md (DepotHold Payments)
---

# Deposit and refund policy

How deposits are sized, held, and returned. This is governed policy, not clerk
discretion.

> **Freshness warning (do not silently fix):** overdue for re-verification. The refund
> window below (7 days) is still correct, but the card-hold language predates the
> processor switch logged in D5. Reconcile the hold-and-release section against D5 and
> the DepotHold Payments registry entry before bumping the verified date.

## Deposit sizing

Every rental carries a deposit sized to the item's replacement cost, per D2. There is no
flat deposit fee. Replacement costs are maintained on the internal gear list; when in
doubt, size up, not down.

## Hold and release

A deposit is placed as a card hold at checkout. On clean, on-time gear return the hold is
released in full. The refund window is **7 days** from return for any disputed condition
charge to be reversed.

> Note under review: the hold-and-release mechanics described here assume the pre-D5
> charge-then-refund flow. Under DepotHold Payments the hold is a native pre-authorization
> that releases automatically. This section is the open reconciliation item.

## Condition deductions

If gear returns damaged beyond normal wear, the depot deducts the repair or replacement
amount from the deposit hold and issues the remainder. Deductions are itemized to the
customer within the refund window.

## No-return conversion

If gear is never returned, the deposit converts to replacement cost per the gear-recovery
protocol. See `gear-recovery-protocol.md` for the escalation ladder that leads here.
