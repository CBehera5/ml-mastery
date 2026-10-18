# Task 013.2 — P01 copy-only evidence map

16 October 2026. Founder-approved implementation; map identity `p01-to-essentials.copy.1`. Implemented in `apps/web/app/python/essentials/model.ts`; this is not an automatic migration.

## Compatibility and consent

Source key `ml-math-lab:python:essentials:v1`, content `python-p01.1.0.0`, original policy/environment and strict original codec. Destination key `ml-math-lab:python:essentials:v2`, schema2, content `python.essentials.1.0.0`, same approved policy/reference environment. No other source/target version or implicit alias is accepted.

Learner opens overview → Preview P01 copy → reviews objective status, counters, drafts, experiment/completion, source version/map/SHA-256 → separately opts in → confirms. Cancel has no effect. Preview reads only; hydration does not write. Source SHA-256 fingerprints the exact source bytes, not a signature or tamper-proof identity.

Target P01 practice/activity must be pristine: no passed practice, drafts, submissions, review cycles, changed/revealed experiment. Otherwise reject instead of overwriting; source remains accessible. Existing other lesson/assessment work and already earned target mastery are preserved. If declining copy, both scopes remain independent.

## Exact objective equivalence

| Source → destination | Justification | Transferred evidence |
|---|---|---|
| python.essentials.p01.o1 → same ID in v2 | Exact original P01 value/type fixture families A/B reused. | Validated practice/completion only. |
| python.essentials.p01.o2 → same ID in v2 | Exact weighted prediction/type/order/units and text-repetition decision/reason tuples reused, both atoms required. | Validated practice/completion only, never critical independent mastery. |
| python.essentials.p01.o3 → same ID in v2 | Same reassignment/comparison numeric-plus-choice fixtures and numeric tolerance. | Validated practice/completion only. |
| python.essentials.p01.o4 → same ID in v2 | Same finite grouping/conversion slots, both authored equivalent repairs and invalid-conversion failure. | Validated practice/completion only. |

No inference to P02–P08 or independent objectives is justified or implemented. No objective gap in the four exact P01 mappings; no broad programming-skill equivalence claim.

## Field mapping

- Source practice[0..3] cycle/counts/variant/passed/reviewed → corresponding target fields unchanged. Source response atom arrays → target answers, or supported blank answers for null source draft. Legal partial repair drafts remain drafts, never correct graded evidence.
- Source counterexample → target remediation, using the exact original P01 recovery answer semantics. Source feedback text is deliberately unmapped; target last=null and teaching regenerates feedback. Feedback is not evidence.
- Source experiment config/changed/prediction/reason/passed/revealed → target activities[0], using the same six configurations and original output/reason IDs. No fabricated interaction.
- Each validated source completed objective → stable completion provenance `p01-to-essentials.copy.1:<objective>`; original timestamp retained, or newer existing destination timestamp kept. Four fixed objective IDs prevent duplicate inflation.
- Original lesson state/completedObjectiveIds/updatedAt → same target lesson after strict source validation. Lesson completion still requires four practice passes and a correctly explained changed experiment.
- Marker records map, source version, exact byte hash, transfer time and up to five original evidence dates in the same target envelope.
- Independent mastery, assessment attempts/history, assessment answers, unknown metadata, unsupported versions, corrupt/noncanonical records and feedback strings are **not** transferred. Original P01 cannot contain mastery under its strict codec.

## Failure safety and idempotency

ModuleStore re-reads source bytes and target bytes at confirmation and rejects a stale preview. Strictly validates complete proposed target before writing. One atomic localStorage setItem stores copied evidence and marker together; the source is never written/deleted. Quota/write rejection leaves original source and previous target bytes intact and commits no transfer marker or in-memory copy. Repeating an already applied map returns the same state; preview is disabled after success.

Read-denied/unsupported target scopes cannot copy; they remain visible memory-only without overwriting stored data. A separately confirmed module reset can clear v2 only; re-copy after an explicit reset is not duplicate progress within one envelope. Lesson reset retains the existing copy marker so it cannot silently refill cleared practice.

This is failure-safe single-key persistence with optimistic stale-tab checks, not cross-key mutation or a guaranteed multi-writer compare-and-swap transaction. localStorage is origin-local, not authenticated, synchronized or tamper-proof. Tests cover partial/full source, consent, unchanged source bytes, repeated copy, busy target, corruption, unsupported source/target, quota and stale preview; production UI verifies preview/confirmation/restoration separately.
