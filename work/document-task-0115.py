from pathlib import Path
import json
root=Path('docs')
bp=json.loads(Path('apps/web/app/learn/linear-regression/mastery/blueprint.v1.json').read_text())
p=Path('apps/web/app/learn/linear-regression/mastery/assessment.ts');s=p.read_text().replace('`In a ${domain} dataset, one observation contributes most of the squared error. What is defensible?`','`In this fictional dataset for ${domain}, one observation contributes most of the squared error. What is defensible?`');p.write_text(s)
formats={**{f'q{i:02d}':'Numerical' for i in [4,5,6,7,8,9,13,19]},**{f'q{i:02d}':'Prediction before reveal' for i in [3,10,16]},**{f'q{i:02d}':'Constrained code correction' for i in [17,18,20]}}
text='''# Linear Regression mastery assessment blueprint

## Implemented version

Task 011.5 implements assessment `linear-regression.mastery.v1`, blueprint/exercise version `1.0.0`, at `/learn/linear-regression/mastery`. The machine-readable blueprint is `apps/web/app/learn/linear-regression/mastery/blueprint.v1.json`.

This is the first implemented blueprint. It supersedes the Task 011.1 design-only nine-domain weighted proposal with the six competency areas explicitly requested in Task 011.5. The provisional policy remains unchanged: at least 80% overall and every designated critical objective passed in the same attempt.

## Scoring and award rule

- 24 questions, each worth one point; four questions per competency. Each competency contributes 4/24 of the total.
- 80% of 24 is 19.2; therefore at least 20/24 is required. Compare unrounded scores for the gate; percentages are rounded only for display.
- All 10 critical objectives must pass. A 23/24 attempt with one missed critical item fails.
- No partial credit or negative marking. All constrained-code slots in a question must match. Missing, incomplete, invalid and non-finite responses score zero. Numerical absolute tolerance is 0.001.
- Any failed attempt awards no new mastery, including for its correct individual items. It can record passed-objective completion evidence and an assessed lesson state.
- A successful attempt awards mastery only to its correctly demonstrated item objectives and the preserved aggregate objective `linear-regression.mastery.objective`. Missed noncritical objectives remain unmastered unless previously earned.
- Prior valid mastery survives later lower-scoring or failed attempts. Lesson/project completion never substitutes for an assessment result.

## Question-to-objective coverage

Every row has one stable objective and remediation route. Critical designation is versioned with this blueprint.

| Question | Competency | Objective ID and capability | Format | Critical | Remediation |
| --- | --- | --- | --- | --- | --- |
'''
competencies={area['id']:area['title'] for area in bp['competencies']}
for q in bp['questions']:
 text+=f"| {q['key'].upper()} | {competencies[q['competency']]} | `{q['objectiveId']}` — {q['statement']} | {formats.get(q['key'],'Conceptual scenario / diagnosis')} | {'Yes' if q['critical'] else 'No'} | `{q['remediationRoute']}` |\n"
text+='''
## Variant design and independence

Twelve variants (`v01`–`v12`) vary numerical inputs, signed residuals and derivatives, feature effects, optimization traces, preprocessing mistakes, leakage boundaries and evaluation scenarios. Electricity use, delivery duration and crop yield replace familiar lesson housing examples. Options and order within each competency rotate deterministically. Question IDs/objectives remain stable across variants; exercise IDs include assessment and variant IDs.

Numerical expectations use existing verified runtime functions. A separately calculated standard-Python arithmetic fixture covers all eight numerical items in all twelve variants. Tests prove that replaying the complete correct response set from any different variant cannot pass the next assessment. The finite pool cycles after 12; this is a local educational assessment, not secure proctored certification. Learner pilots and item calibration remain future validation work.

## Active attempt, review and feedback

The route can be attempted directly with no lesson-completion gate and no time limit. A named progress indicator counts valid entered responses, without scoring. The active form and review contain no correctness flags, expected numeric values or explanations. Displayed answer options are ordinary choices, not revealed keys.

Review lists all entered/incomplete responses. Learners can edit a specific question and return with focus on its fieldset. Unanswered items are explicitly reported and may be submitted for zero credit. Final submission requires a new confirmation checkbox; review/consent is not restored after reload. Enter from the form opens review rather than submitting a grade.

After submission show score, six competency subtotals, each passed/failed critical objective, worked explanations for incorrect answers, remediation links and next learning steps. A retake clears current responses and uses the next deterministic variant. No arbitrary Python or external grader is invoked.

## Evidence and retention

Existing versioned curriculum, exercise and evidence schemas remain unchanged. Each submission records assessment/version identity, variant, score/max score, passed objective IDs and timestamp. Failed critical objectives and competency summaries can be derived from the pinned blueprint and passed IDs; raw response histories are unnecessary.

The latest 20 summaries for this assessment are retained without trimming unrelated assessment histories. One validated current draft stores bounded numeric/choice/code responses; partial code slots restore safely. Unknown versions and malformed drafts reset only the draft, selecting the next variant from canonical history. Canonical existing learning and Derivatives state remain intact.

A submitted result is displayed after hydration only when its variant, score and passed objective IDs match a canonical attempt. Submission commits are idempotent by attempt ID; hydration never awards mastery. Completion/mastery evidence IDs are bounded by the finite variant/objective set. Stable mastery record IDs preserve prior valid results. Storage failures are shown visibly.

## Verification and release limits

Automated tests cover all competencies, variants and numerical references, exact scoring thresholds, high-score critical failures, failed/successful attempts, objective awards, retakes, bounded history, unrelated evidence preservation, partial drafts, confirmation reset and mismatched stored results. The complete frontend, TypeScript, Python and production-build suites pass.

Real-browser checks on an isolated production test origin verified keyboard review/confirmation, a 23/24 critical failure, a 24/24 successful retake, remediation, variant changes and reload persistence. Browser inspection found and fixed grid min-content overflow. The repaired narrow layout measured 466 px with equal document/content widths; this browser backend did not supply an actual 400 px layout despite the requested override.

Manual assistive-technology pronunciation, zoom and smaller/device-specific viewports remain unverified. Earlier lesson/project end-to-end acceptance is not established by the mastery journey. The assessment and overall module remain `implemented`, not fully verified. No deployment or Task 012 work was performed.
'''
(root/'LINEAR_REGRESSION_MASTERY_BLUEPRINT.md').write_text(text)
p=root/'LINEAR_REGRESSION_EDUCATIONAL_STANDARD.md';s=p.read_text();s+='''
## Task 011.5 independent assessment standard

The final route is independently attemptable. The mastery blueprint pins 24 item objectives across six competencies and 12 deterministic variants. Active attempts and review expose choices and entered responses without correctness feedback or worked answers. A distinct review step and explicit submission confirmation precede grading; there is no timer or punitive marking.

Use the existing deterministic exercise evaluator and numerical runtimes; learner code is constrained or traced, never executed arbitrarily. At least 80% overall plus every critical objective must pass in one attempt. Failed attempts award no new mastery. Successful attempts award separate objective-level mastery only for demonstrated objectives; missed noncritical objectives retain remediation needs. Lesson/project completion and assessed state are not mastery.

After submission report competency performance, critical outcomes, causal explanations and targeted lesson links. Retakes change data, signs and scenarios rather than only rearranging options. Preserve earlier progress and valid mastery; bound this assessment's own history without deleting unrelated records. Restore partial drafts safely and do not preserve submission consent. Match submitted displays to canonical evidence and never award mastery during hydration.

Browser checks and component accessibility checks must be reported separately. Real-browser review, confirmation, failure, success, retry and reload were exercised in Task 011.5; screen-reader speech, zoom, smaller viewports and complete module acceptance remain separate release gates. No complete-module verification claim follows from automated or assessment-only acceptance.
''';p.write_text(s)
p=root/'LINEAR_REGRESSION_COMPLETION_PLAN.md';s=p.read_text();first='seven educationally verified lessons, an implemented six-stage guided applied project, and one remaining placeholder route (`mastery`)';s=s.replace(first,'all nine substantive routes: seven educationally verified lessons, the applied project bridge, and the independent mastery assessment. Project, assessment and module statuses remain implemented pending complete browser/accessibility acceptance')
s='\n'.join('| `mastery` | Versioned 24-question, six-competency independent assessment with 12 deterministic variants | Scope complete for provisional bounded assessment; pilot/calibration remains | 80% plus all 10 critical objectives; objective-level completion/mastery, review/confirmation, feedback, remediation, 20-summary retention | Real browser failure/success/retry/reload and keyboard checks performed; narrow-grid overflow fixed; screen reader/zoom/smaller viewports and whole-module acceptance pending | Mastery only on a passing independent attempt; no awards from visits or guided completion | Implemented; do not label the whole module fully verified |' if line.startswith('| `mastery` |') else line for line in s.splitlines())+'\n'
s=s.replace('5. Mastery assessment last, after every assessed objective has a taught/remediation path.','5. Independent mastery delivered in Task 011.5 after taught/remediation paths were mapped; full release acceptance remains pending.')
s=s.replace('## Recommended Task 011.5 scope — approval required, not started','## Original Task 011.5 recommendation (superseded by closure below)')
s+='''
## Task 011.5 independent mastery closure — 15 October 2026

All nine routes now contain substantive learning/assessment content. The mastery route implements a versioned 24-question assessment with four items in each of six requested competencies and 12 deterministic variants. Ten critical objectives and an unrounded 80% threshold gate objective-level mastery. Failed attempts record assessment evidence without awarding new mastery; earlier valid results and all earlier progress remain intact.

The interface supports a named response-progress indicator, native controls, independent entry, review, focused editing, explicit submission consent, post-submission explanations/remediation and alternate retakes. Correctness feedback is never shown during an active attempt or review. Canonical submission history is bounded to 20 records for this assessment without trimming unrelated histories. One bounded versioned draft restores partial code choices and rejects mismatched submitted displays.

Real-browser verification became possible after starting localhost successfully. On a separate production test port, a 23/24 attempt with a critical failure correctly failed and a 24/24 variant-v02 retry passed; both records survived reload. Keyboard review/confirmation and focus transitions worked. A real narrow-screen overflow was identified and fixed in the assessment grid. The measured narrow viewport was 466 px, with equal content/document width; an actual 400 px layout, manual screen-reader speech, zoom and earlier routes' complete browser journeys remain unverified.

The complete module remains implemented rather than fully verified. Local preview is available; no deployment occurred. Task 012 is recommended for a separately approved mathematics-foundations scope, starting with the roadmap's Algebra/Functions work after reviewing remaining gaps. Task 012 has not begun.
''';p.write_text(s)
p=root/'IMPLEMENTATION_STATUS.md';s=p.read_text().replace('# Implementation status', '''# Implementation status

## Task 011.5 independent mastery — 15 October 2026

- [x] Existing mastery route now implements an independently attemptable 24-question assessment
- [x] Versioned objective/competency/critical/remediation blueprint; four items per six competencies
- [x] Twelve deterministic variants with changed numerical values, signs and diagnostic scenarios
- [x] At least 80% overall plus all 10 critical objectives required in one attempt
- [x] Failed submissions award no new mastery; passed objective evidence and previous mastery preserved
- [x] Review, explicit confirmation, keyboard focus, progress, results and targeted remediation
- [x] One validated bounded draft and 20 local summaries without deleting unrelated histories
- [x] Existing runtime and curriculum/evidence schemas preserved; assessment integrated additively
- [x] Full frontend/TypeScript/Python suites, numerical parity, type checking and production build
- [x] Real isolated-origin browser verification of high-score critical failure, success, retry, confirmation and reload
- [x] Narrow assessment grid overflow found and fixed; measured document/content widths equal at 466 px
- [ ] Remaining release gates: manual screen-reader/zoom/smaller-device review and full earlier-route acceptance
- [ ] Overall Linear Regression module fully verified: intentionally not claimed; status remains implemented
- [ ] Task 012 not begun; no deployment
''',1)
s=s.replace('- [ ] Independent mastery remains planned; Task 011.5 not begun','- [x] Independent mastery subsequently implemented in Task 011.5; further modules not begun');p.write_text(s)
p=root/'V1_IMPLEMENTATION_ROADMAP.md';s=p.read_text();old='Independent mastery remains planned. Task 011.5 is recommended for the approved mastery blueprint (80% plus all critical objectives), but has not begun.';new='Task 011.5 now implements the independent 24-question mastery assessment with six competencies, 12 deterministic variants, 80% plus all 10 critical objectives, separate objective mastery evidence, bounded history, review/confirmation and remediation. Browser failure/success/retry/reload checks passed on an isolated test origin and responsive overflow was fixed. Manual assistive-technology/zoom/smaller-device checks and complete earlier-route browser acceptance remain pending: the module is implemented, not fully verified. Task 012 is the next proposed scope, not started; begin only with founder approval.';s=s.replace(old,new);p.write_text(s)
p=root/'TASK_017_CONCEPTUAL_DEPTH_BACKLOG.md';s=p.read_text();s+='''
## Findings from Task 011.5 (full review deferred)

- Pilot the six-competency assessment for question clarity, difficulty and transfer. Structural coverage and deterministic correctness do not establish psychometric validity.
- Evaluate whether the 10 critical items discriminate unsafe mathematical/evaluation mental models without overweighting reading demands.
- Review item equivalence across twelve variants, including constant-column scaling, signed gradients and temporal/entity leakage cases.
- The bounded response interface measures calculation, code tracing/correction and decisions; richer open explanation requires a separately approved rubric and must not be keyword graded.
- Manual screen-reader mathematical pronunciation, zoom and actual 320–400 px device acceptance remain open. Browser keyboard/focus and a 466 px narrow layout were checked; they do not establish all accessibility criteria.
- Revisit finite-pool exposure and spaced retake design after learner evidence. The pool cycles after twelve, with that limit explicitly disclosed; it is not secure proctored certification.
- Review cross-module assessment policy/version changes and retention of old valid mastery while preserving unrelated progress.

No full Task 017 review, shared mathematical semantic change or arbitrary learner-code execution was performed.
''';p.write_text(s)
