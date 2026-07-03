---
owner: founder
verified: 2026-05-28
sources:
  - OPS-MASTER-PLAN.md (section 4)
  - governance/INTEGRATIONS-REGISTRY.md (Ledgerline Books)
---

# Inventory cycle count

How each depot keeps its fleet count honest without shutting down for a full physical
inventory. Cycle counting spreads the work across the calendar.

## Cadence

Each depot counts one gear line per week on a rolling basis, so every line is counted
roughly monthly. Peak-season counts run on the depot's slowest weekday.

## The count

1. Pull the expected on-hand count for the line from the fleet board.
2. Physically count in-depot items plus items out on active rental.
3. Reconcile. Any gap is either an unlogged return, an item mid-recovery, or a genuine
   loss — resolve to one of those three, never leave a gap open.
4. Feed confirmed losses into the season-close books (Ledgerline export).

## Condition pass

Cycle count doubles as a condition pass. Any item that counts present but fails condition
comes off the rentable fleet and into repair. This is where paddle mid-season inspection
(`paddle-fleet-rotation.md`) and winter safety-gear retirement
(`avalanche-season-closeout.md`) hook in.

## What a gap is not

A count gap is never written off silently. Every gap resolves to a named cause. Silent
write-offs hide recovery failures and are how a fleet bleeds out unnoticed.
