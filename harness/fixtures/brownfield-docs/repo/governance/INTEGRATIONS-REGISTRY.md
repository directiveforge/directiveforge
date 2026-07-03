# Integrations registry

> The house record of external tools and services this business relies on. Governed by
> D4: nothing external is wired up without a founder bootstrap, and every candidate is
> proposed here first. This file is the vetting front door.

## Vetted and in use

| Tool / service | Purpose | Vetted on | Credential owner | Notes |
|---|---|---|---|---|
| Ledgerline Books | Bookkeeping and seasonal close | 2026-01-20 | founder | Read-only export used for the season-close ritual. No write access granted. |
| DepotHold Payments | Card processing with native deposit holds | 2026-06-04 | founder | Adopted per D5. Replaces the prior charge-then-refund processor. Hold-release semantics are the reason for the switch. |
| FieldRoster Scheduling | Seasonal crew scheduling across the four depots | 2026-02-25 | founder | Peak-season only; deactivated in shoulder seasons to avoid the idle-seat charge. |

## Proposal protocol

Anyone — including an AI assistant — may propose a new tool. Proposing is not installing.
To propose:

1. **Draft a candidate row** below under "Proposed — awaiting founder bootstrap," with the
   tool, the job it does, why an existing vetted tool can't cover it, and the recurring
   cost if any.
2. **State the credential surface.** What keys, scopes, or account access would it need?
   Least privilege only — name the narrowest scope that does the job.
3. **Stop there.** Do not create an account, do not store a key, do not connect anything.
   Per D4 the founder bootstraps every credential personally. A proposal that arrives
   pre-wired is a governance violation and gets torn out.
4. **Founder decision.** The founder either bootstraps it (moving the row up to "Vetted
   and in use" with a credential owner and vetted date) or rejects it with a note.

Recurring-cost proposals are additionally subject to the shoulder-season spend caution in
the master plan — a monthly bill is a money decision, not a convenience call.

## Proposed — awaiting founder bootstrap

_None open._
