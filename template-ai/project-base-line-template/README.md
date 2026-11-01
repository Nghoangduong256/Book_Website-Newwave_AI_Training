# Project Baseline Template

A documentation-driven, AI-assisted delivery baseline for a **Python + Next.js + PostgreSQL**
product. Copy this directory, rename it, fill in the placeholders, and you have the full working
method on day one instead of inventing it in week six.

It encodes one idea: **the design documents are the source of truth, the code is their projection,
and an AI agent is only as good as the documents and rules you point it at.**

---

## 1. What is in here

```
<project-root>/
├── plan/                       ← ALL design documents. Never write code here.
│   ├── STRATEGY.md             ← why the system exists, scope, architecture, phases, locked decisions
│   ├── RD/                     ← Requirement Definition — WHAT the system must do (per module)
│   ├── BD/                     ← Basic Design — HOW it does it (schema, API, screens, flows)
│   ├── CR/                     ← Change Requests — every change after a document is baselined
│   ├── Implementation plan/    ← step-by-step build instructions, per phase
│   └── analysis/               ← pre-RD feasibility, gap and positioning analyses
├── management/                 ← PM artifacts; the project's memory between sessions
│   ├── PROGRESS.md             ← running log. The FIRST file any new session reads
│   ├── OPEN-DECISIONS.md       ← the one place a stakeholder answers a question
│   ├── FINDINGS.md             ← defects found while doing something else (scope-creep brake)
│   ├── CR-MANAGEMENT.md        ← change-request register and governance
│   └── Px-EXIT-GATE.md         ← per-phase evidence-based gate record
├── source code/                ← THIS is the repository. All code lives here.
│   ├── .claude/                ← agents, rules and skills the AI assistant operates under
│   ├── CLAUDE.md               ← operating instructions, read before any code is written
│   ├── docker-compose.yml      ← the whole stack, one command
│   ├── backend/ frontend/ infra/ ops/ docs/
├── templates/                  ← reusable artifacts (ADR, UAT, meeting notes, PR, prompts, evals)
└── references/                 ← stack versions, glossary, cheat sheets, playbooks
```

## 2. The directory contract — the one rule that must not bend

> **Never write source code outside `source code/`.
> Never write design documents inside it** — the only exceptions are `CLAUDE.md`, `README.md`,
> `.claude/` and `docs/adr/`.

Everything else in this template is advice you may tune. This one is load-bearing: it is what lets
an agent find the right document from a path alone, and what keeps design and code from drifting
into two unrelated stories.

## 3. The delivery loop

```
analysis → STRATEGY → RD (what) → BD (how) → Implementation plan (steps) → code → exit gate
                ▲                                                                      │
                └──────────────── CR (a change after baseline) ◀── FINDINGS / decisions ┘
```

1. **Analyse** before committing (`plan/analysis/`) — only when the feature is new in kind.
2. **Baseline the strategy.** Scope, architecture, phases, and the decisions a stakeholder owns.
3. **RD per module** — actors, use cases, functional requirements (`FR-nn-mm`), business rules
   (`BR-nn-mm`), data requirements, acceptance criteria. No implementation detail.
4. **BD per module** — schema, API, screens, sequence flows, and a §14 traceability table that maps
   every `FR`/`BR` to a BD section. An untraceable requirement is a requirement that will be missed.
5. **Implementation plan per phase** — stages, each with `Read / Create / Verify / Manual check`.
6. **Build**, following `source code/CLAUDE.md` and `.claude/rules/`.
7. **Exit gate** — evidence, not assertion. Copy `management/Px-EXIT-GATE.md` per phase.
8. **Any change after baseline is a CR**, not a silent edit.

## 4. How to start a new project from this template

See [GETTING-STARTED.md](GETTING-STARTED.md). It is a checklist, roughly a day of work, and it ends
with a stack that boots and an agent that knows the rules.

## 5. Why the management/ files exist

They are not bureaucracy; each one is a brake on a failure that costs real days:

| File | The failure it prevents |
|---|---|
| `PROGRESS.md` | A new session re-deriving where the last one stopped, and trusting work that was never verified |
| `OPEN-DECISIONS.md` | Engineering quietly deciding something that belongs to a stakeholder, then building on it |
| `FINDINGS.md` | A 36-minute task becoming a 2-hour one because every defect found on the way was fixed inline |
| `CR-MANAGEMENT.md` | Scope growing without anybody agreeing to the cost |
| `Px-EXIT-GATE.md` | "Done" meaning "the tests are green" rather than "it was run and the output was read" |

## 6. Placeholders

Every template uses the same markers. Search for them before you ship anything:

- `<PROJECT>` — product name
- `<MOD-nn>` / `<module>` — module id and slug
- `<Pn>` — phase id
- `YYYY-MM-DD` — a date
- `[Proposed]` — a value shipped without ratification; it must be visible on screen and in the doc
- `TODO` / `TBD` — unfinished. A document with either is not baselined.
