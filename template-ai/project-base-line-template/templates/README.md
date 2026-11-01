# templates/

Reusable artifacts that are not design documents. The design-document templates live beside the
documents they produce — `plan/RD/RD-TEMPLATE.md`, `plan/BD/BD-TEMPLATE.md`, and so on — because a
template is found when it is next to the thing it makes, not in a directory you have to remember.

| File | Use it for |
|---|---|
| `MEETING-NOTES-TEMPLATE.md` | Any meeting whose decisions bind someone |
| `UAT-SCRIPT-TEMPLATE.md` | User acceptance testing, per module or per phase |
| `PR-DESCRIPTION-TEMPLATE.md` | Every pull request |
| `RISK-REGISTER-TEMPLATE.md` | Project risks, reviewed at every phase gate |
| `AI-PROMPT-TEMPLATE.md` | A registry entry for a prompt |
| `AI-EVALUATION-SET-TEMPLATE.md` | The evaluation set that ships with an AI feature |
| `RELEASE-GATE-TEMPLATE.md` | The go/no-go before a production release |
| `INCIDENT-REPORT-TEMPLATE.md` | After a production incident |

The ADR template is in `source code/docs/adr/ADR-TEMPLATE.md`, for the same reason.
