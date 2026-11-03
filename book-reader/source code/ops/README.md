# ops/

Operational scripts. Everything here is something a person or CI **runs**, and whose output is
**read** — these are the commands the rules refer to.

Expected contents as the project grows:

| Script | Purpose | Referenced by |
|---|---|---|
| `responsive.sh <route>` | Assert no horizontal overflow inside `main` at 375px and 768px | R-C7a §47, every screen's definition of done |
| `a11y.sh <route>` | Axe pass on a route | NFR-05 |
| `check_criteria_coverage.py` | Which acceptance criteria are named by at least one test | the exit gate |
| `check_permission_surface.py` | Every route, its permission, and the ones without | the exit gate, `security-reviewer` |
| `check_screen_reachability.py` | Every screen reachable by **clicking**, not only by URL | the exit gate |
| `check_deployed_is_current.py` | The running image matches the source tree | the exit gate |
| `evaluate_<feature>.py` | Run an AI feature's evaluation set, report the metric and the delta | R-AI7 |
| `load/` | Load scripts behind the latency NFRs | NFR-01 |

Two rules for anything added here:

1. **It must fail loudly.** A check that prints a warning and exits 0 is a check nobody will notice
   has stopped working.
2. **It must say what it did not cover.** A coverage script that globs for filenames looks identical
   whether it matched thirty files or zero — name the files individually, or print the count.
