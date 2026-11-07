# CR Management

How a change to a baselined document is raised, assessed, decided and closed — and the register of
what that has cost so far.

The individual change requests live in `plan/CR/`. This document is the governance and the metrics.

---

## 1. When something is a CR

| Situation | CR? | Instead |
|---|---|---|
| A baselined (🟢) document must say something different | **Yes** | — |
| A draft (🟡) document is still being written | No | Edit it |
| The code is wrong and the document is right | No | A fix, and a row in `FINDINGS.md` |
| The document is wrong and was found out by the code | **Yes**, after the ADR | Write the ADR at that moment, then raise the CR |
| New scope a stakeholder asked for | **Yes** | — |
| A defect whose fix changes designed behaviour | **Yes** | — |
| A typo, a clarification that changes no behaviour | No | Edit, note the version bump |

> **The test:** would a reader of the baselined document be surprised by what the system now does?
> If yes, it is a CR.

## 2. The flow

```
raise ──▶ triage ──▶ impact assessment ──▶ decision ──▶ implementation ──▶ close
 1 day     2 days         owner's estimate     stakeholder    a phase/stage    documents + code agree
```

1. **Raise.** Copy `plan/CR/CR-TEMPLATE.md` → `plan/CR/CR-nnn_<slug>.md`. Add the row to
   `plan/CR/CR-INDEX.md` and to §6 below.
2. **Triage** (within 2 working days): is it a CR at all, how urgent, who assesses it.
3. **Impact assessment** by the owning engineer: §5 of the CR, including a **do-nothing option**
   and an effort figure with its basis.
4. **Decision** by the authority in §3, recorded in the CR with the rationale **in the decider's
   words**.
5. **Implementation** in a named phase/stage. The documents are amended as part of the change, not
   afterwards.
6. **Close** only when the documents, the code and the tests all agree.

## 3. Decision authority

| Impact | Who decides | Target |
|---|---|---|
| ≤ 1 day, no schedule or contract effect | Tech lead | 2 days |
| ≤ 5 days, or any API/schema break | Tech lead + PM | 5 days |
| Schedule, cost or contractual effect | Project sponsor | 10 days |
| Scope reduction below a committed deliverable | Customer / sponsor, in writing | — |

**Emergency path:** a production defect may be fixed first and the CR raised within 24 hours, with
the ADR written at the time of the fix. It is the only path that works backwards, and it is used
for incidents, not for convenience.

## 4. What a CR must not be used for

- **Retroactive justification.** A CR written after the code shipped to make the documents match is
  not governance; it is paperwork. Raise it when the need is discovered.
- **A substitute for a decision.** If a stakeholder has to choose, the row belongs in
  `OPEN-DECISIONS.md`. The CR implements the answer.
- **Scope creep laundering.** Three small CRs that each look cheap can cost more than the one big
  one somebody would have refused. §7 exists to make that visible.

## 5. Chốt tài liệu
Ngày2026-11-07 chủ dự án duyệt BASELINE-1.0. Danh sách và phiên bản nguồn nằm trong [BASELINE-REGISTER](BASELINE-REGISTER.md); không dùng bảng mẫu0.1 trước đây.
Không còn quyết định sản phẩm mở. Xác minh công cụ/triển khai được hoãn có chủ đích với phụ trách và thời hạn ở sổ mốc chuẩn, không được ghi là đã hoàn thành.
Đổi nội dung hành vi sau mốc này dùng CR; sửa lỗi chữ/Markdown không đổi nghĩa có thể sửa trực tiếp. Việc chốt ban đầu theo yêu cầu người dùng không cần tạo CR hồi tố.

## 6. Register

### Open

| # | Title | Type | Priority | Affects | Raised | Assessed | Decision due | Status |
|---|---|---|---|---|---|---|---|---|

### Closed

| # | Title | Decision | Decided | Implemented | Est → actual |
|---|---|---|---|---|---|

## 7. Metrics — reviewed at every phase gate

| Metric | This phase | Cumulative | Why it is watched |
|---|---|---|---|
| CRs raised | 0 | 0 | |
| CRs approved | 0 | 0 | |
| Days added by approved CRs | 0 | 0 | **The scope-creep number.** Report it against the original phase estimate, not against the revised one — a revised baseline hides exactly what this metric exists to show |
| Median days raise → decision | — | — | A slow decision is a stalled phase |
| CRs caused by a design document being wrong | 0 | 0 | High here means RD/BD review is too shallow, and the fix is upstream |
| CRs raised after implementation started | 0 | 0 | High here means phases start before their inputs are stable |
