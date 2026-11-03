# ADR-0000 — Record architecture decisions

**Status:** Accepted · **Date:** YYYY-MM-DD · **Deciders:** <name>

## Context

This project is documentation-driven: the RD says what the system must do, the BD says how, and the
code is their projection. That arrangement fails in one specific way — **execution contradicts a
design document, the engineer does the right thing, and nobody writes down why.** Six months later
the document and the code disagree, and no one can tell which is wrong.

## Decision

Every deviation from a design document is recorded as an ADR in this directory, **at the moment it is
discovered**, before the work continues. The ADR is then referenced from the affected document's open
items, and a CR amends that document.

Numbering is sequential and never reused. An ADR is immutable once accepted: a later decision
supersedes it, with both linked.

## Consequences

- Writing the ADR at the moment costs a few minutes. Reconstructing the reasoning at the end of a
  stage costs much more and produces something tidier and less true.
- The documents stay honest, because a contradiction has a defined destination.
- **An ADR explains a past decision; a rule prevents a future mistake.** If the trap is invisible from
  the code, it needs both — the ADR here, and a rule in `.claude/rules/`.
