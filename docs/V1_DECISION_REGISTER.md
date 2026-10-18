# V1 founder decision register

**Status:** Provisional unless an entry records explicit founder approval.  
**Purpose:** Keep architectural defaults reversible while Task 010.2 establishes shared contracts.

| ID | Decision | Provisional working position | Task 010.2 impact | Approval needed by |
| --- | --- | --- | --- | --- |
| FD-001 | V1 launch scope | Retain the three approved phases and three projects; do not infer launch completeness from routes. | Contracts support every phase but instantiate only existing reference content. | Task 011 scope review |
| FD-002 | Progress persistence | Browser-local, versioned evidence is the current implementation boundary; no identity or cross-device promise. | Evidence contracts are storage-neutral and use an additive v1 key convention. | Before commercial beta |
| FD-003 | Paid entitlement | Undecided; billing/authentication are excluded. | No entitlement fields or access gates are added. | Before paid launch implementation |
| FD-004 | Dataset sourcing | Require version, provenance/license, schema, split policy, and limitations; synthetic data must be labeled. | Project milestone contracts remain dataset-neutral. | Before Task 014/production datasets |
| FD-005 | Mastery threshold | Undecided and module-specific; completion never grants mastery. | Contracts store explicit mastery evidence and levels but hardcode no threshold. | Before Task 011 mastery implementation |
| FD-006 | SVM and Jacobian/Hessian depth | Remain in approved scope pending final launch-scope decision. | Generic curriculum contracts can represent them; no content is created. | Before Task 012/015 sequencing |
| FD-007 | Accessibility/browser target | Recommend WCAG 2.2 AA and current evergreen browsers plus mobile Safari/Chrome. | Contracts contain no device assumptions. | Before Task 018 test plan |
| FD-008 | Analytics | Remain local/session-only; no provider or transmission. | Evidence is not emitted as analytics. | Before any analytics expansion |
| FD-009 | Project report format | Undecided; notebooks plus a concise structured report are the working model. | Project milestones are format-neutral. | Before Task 014 report contract |

## Decisions made by explicit Task 010.2 constraints

- No server-side accounts, authentication, billing, deployment, new algorithms, capstones, arbitrary code execution, or mathematical-runtime rewrite.
- No universal simulation framework or CMS.
- Existing Derivatives local storage and behavior must remain valid.
- Existing routes, visual language, and verified mathematical behavior are compatibility boundaries.

## Infrastructure blockers

No provisional item above blocks the additive Task 010.2 contracts because thresholds, persistence transport, datasets, reports, analytics, and entitlement are not encoded as irreversible policy. FD-002 and FD-005 must be explicitly approved before learner-facing shared persistence or mastery awards replace existing module behavior.
