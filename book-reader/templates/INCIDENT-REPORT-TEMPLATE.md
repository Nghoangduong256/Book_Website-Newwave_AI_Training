# Incident — <short description>

**Date:** YYYY-MM-DD · **Severity:** SEV1 / SEV2 / SEV3
**Detected:** HH:MM (by: alert / a user / chance) · **Mitigated:** HH:MM · **Resolved:** HH:MM
**Author:** <name>

---

## What users experienced

In their terms, not ours. Who, how many, for how long, and what they could not do.

## Timeline

| Time | Event | Who |
|---|---|---|
| | first symptom in the data (often earlier than detection) | |
| | detected | |
| | mitigated | |
| | resolved | |

**Detection delay** — first symptom to detection — is usually the most actionable number here.

## Root cause

The chain, not the last link. "The worker ran a stale image" is a link; "there is no check that the
deployed image matches the source" is the cause.

## Why it was not caught earlier

Which gate should have caught it, and why it did not. **If no gate could have caught it, that is the
finding.**

## Data impact

| | |
|---|---|
| Rows written incorrectly | |
| Can they be identified? | |
| Can they be corrected? | |
| Was anything irrecoverably lost? | |

A stale worker, a bad migration or a wrong default writes **well-formed wrong rows** that outlive the
incident. Ask this question even when the service looked healthy throughout.

## What was done

| Action | When | By |
|---|---|---|

## Follow-up

| # | Action | Type | Owner | Due |
|---|---|---|---|---|
| 1 | | prevent / detect / mitigate | | |

**At least one must be "detect".** A fix that prevents this exact cause leaves the next, different
cause just as invisible.

## What goes into the permanent record

| Where | What |
|---|---|
| `.claude/rules/` | the rule that would have prevented it, if it is invisible from the code |
| `docs/adr/` | the decision, if the fix changes a design |
| `management/FINDINGS.md` | anything found on the way and not fixed |
| `templates/RISK-REGISTER-TEMPLATE.md` | the risk, if it was unlisted — and its trigger |

> No blame. The question is always what made the mistake *possible*, never who made it.
