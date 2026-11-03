# Book Reader — System Build Strategy

Version: 0.1. Date: 2026-11-03. Status: Draft, not baselined.

## 1. Purpose

A personal library and reading application for PDF and EPUB on mobile and PC, with light/dark modes, navigation, custom table of contents, and reading position persistence.

## 2. Confirmed scope

Personal use in the first release. Separate PDF and EPUB rendering behind a shared reading interface. Support importing files and direct document URLs. Original project Project_ngan is reference material; template-ai remains unchanged.

Multi-user operation is a later capability, designed as an account/access module. It requires integration changes and migration, not merely adding a login screen.

## 3. Architecture boundaries — proposed

- Library module owns book metadata and file references.
- Reader module owns format-specific rendering and location semantics.
- Reading-data module owns per-reader progress, bookmarks, and custom TOC.
- Storage module owns server files and per-device offline copies.
- Account/access module later supplies the authenticated reader and authorization policy.

Use a current-reader interface from the first release. The personal implementation resolves one stable local reader; business services do not assume one global user's data. Ownership must be checked server-side. Future account integration replaces reader resolution while retaining domain boundaries.

Book ownership is separate from reading progress ownership. Store PDF locations by page and within-page position; EPUB locations by content locator, with file revision association. Offline availability is per device, not a global book flag.

When enabling multiple users, migrate the personal library to an explicit account, scope queries/files/jobs to the authenticated owner, migrate local caches safely, and test cross-user isolation. Authentication is deferred; domain ownership is not.

## 4. Confirmed stack

React + TypeScript + Vite; Java + Spring Boot + JPA; SQL Server. Versions are to be verified at kickoff and recorded in references/STACK.md. Do not copy inherited version suggestions as verified facts.

## 5. Proposed delivery order

1. Analysis, scope, company-template adaptation and architecture decisions.
2. Foundation and personal PDF library/reader with persisted reading position.
3. EPUB reader and shared navigation/custom TOC/light-dark experience.
4. Offline reliability and release verification on mobile and PC.
5. Future account/access module and multi-user integration, under a separate plan.

## 6. Delivery rules

All code in source code/; designs in plan/; delivery records in management/. Follow RD → BD → implementation plan → code → exit gate. Keep traceability and record actual verification results. Changes to baselined documents use CR governance.

## 7. Locked decisions

| ID | Decision | Date | Authority |
|---|---|---|---|
| D1 | Separate project copied from company template | 2026-11-03 | Project owner, conversation |
| D2 | Keep existing Java/React/SQL Server stack | 2026-11-03 | Project owner, conversation |
| D3 | Personal use first; multi-user account/access as a future module | 2026-11-03 | Project owner, conversation |

## 8. Pending design

Deployment boundaries for personal use; import/storage limits; migration of old data; sync scope for the first release; account module contract; acceptance criteria and NFR measurements. Record concrete questions with recommendations in management/OPEN-DECISIONS.md.
