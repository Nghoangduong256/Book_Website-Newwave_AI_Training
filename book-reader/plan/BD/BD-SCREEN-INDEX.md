# Screen Index

Every screen in the system, with its route and its way in. **The "entry point" column is the one
that matters:** a screen with no entry point is unreachable, and that gap is invisible to any test
that navigates by URL.

| Screen | Module | Route | Archetype | Permission | Entry point | Status |
|---|---|---|---|---|---|---|
| SC-01-01 | MOD-01 | `/login` | form | — (public) | the application root | ⬜ |
| SC-nn-mm | MOD-nn | `/<module>` | list | `<res>:read` | main nav → <module> | ⬜ |

## Reachability assertions

Checked programmatically, not by inspection:

1. Every route in this index resolves (no 404).
2. Every route is reachable by clicking from the application root — not only by typing its URL.
3. Every state in a module's state machine has a **reachable action** that advances it. A screen
   you can open but on which the next step is invisible is still a dead end.
4. Every route renders without horizontal overflow at 375px.
