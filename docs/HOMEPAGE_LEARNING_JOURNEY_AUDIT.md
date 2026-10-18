# Homepage, learning journey and navigation — current UX audit

## Homepage learning journey — implemented, founder review pending

16 October2026. Founder authorized the bounded implementation. **Homepage/navigation are implemented; awaiting founder review**, not deployment or full accessibility acceptance. [Completion report](HOMEPAGE_LEARNING_JOURNEY_COMPLETION.md), [frozen implementation decisions](homepage-learning-journey-implementation-decisions.md) and [actual production-preview evidence](../outputs/homepage-implementation/) supersede earlier “design only/not authorized” status below, which remains historical.

Root / is the journey dashboard; logo returns home; Help contains Beta Guide; Challenges retains X-Ray/debugging. One Start/Continue action reads supported saved work without writes, migrations, mastery transfer or invented percentages. Five stages distinguish available/partial/planned/future content. Optional entry modes and five concept pathways reuse available lessons and native assessments.

Final verification:480 frontend/TypeScript tests in81 files,919 Python tests, typecheck and production build passed. Keyboard, browser history, genuine saved-practice/draft continuation and320px states were exercised on an isolated loopback origin. Original runtimes, scoring/evidence/persistence models, fixtures, notebooks and dependencies are unchanged. No subsequent major task, new curriculum or deployment.

**OPEN:** genuine screen-reader, genuine200%/400% browser zoom and genuine Colab. Comprehensive pedagogy and later authorized learner testing remain outstanding. Local/viewport checks do not close these gates.

### Historical baseline preserved

Observed /→/demo and brand→/beta behavior below describes the pre-implementation audit. The accepted remediation now makes / the dashboard and the logo return home while retaining those destinations. Current screenshots and verification are in the completion report; the original audit remains traceable rather than silently rewritten.

16 October2026. **Design and audit only; awaiting founder approval.** This extends the cumulative curriculum-quality review. No homepage, route, mastery rule, learner record, commercial configuration or brand was changed. “ML Mastery” is the founder's curriculum framing; proposals retain the current **ML Math Lab** name.

## Executive finding

The root is not a curriculum homepage: apps/web/app/page.tsx redirects / to /demo. The logo then links to /beta, a different entry experience. The current seven-link navigation mixes curriculum stages, one algorithm, an experiment, a challenge and beta onboarding as peers. The destinations work individually; their relationship and a learner's next useful action are not explained globally.

The existing X-Ray is an effective focused lab, not an appropriate universal first screen for every learner. Its local five-step guide answers “what next inside this experiment,” not “where am I in the curriculum?” The proposed response is **one orientation/resume card, one primary action, an explorable staged roadmap and contextual concept connections**, not another layer of lessons or a new mandatory linear course.

## Evidence and method

Read actual root, BetaWelcome, BetaNav/CSS, X-Ray, Math/Python hubs, Regression curriculum, shared evidence and Python controllers; checked the current roadmap, master plan, Task013 closure/quality reports and project patterns. Used the unchanged production build at isolated127.0.0.1:3035. Browser inspection covered /→/demo, logo→/beta and existing Math, Python, Linear Regression and debugging destinations. No learning exercises or feedback/commercial forms were submitted.

[Browser evidence](../outputs/homepage-journey-audit/browser-evidence.json) records actual headings, links and widths. At1280px the nav measured78px high; at320px it wrapped to156px. All six inspected destinations had document width320px without horizontal overflow. At320px the beta heading started234px down; the hierarchy cost is vertical attention, **not a demonstrated layout break**. Screenshots are captured observations, not learner-testing evidence. Genuine reader speech/navigation and real browser zoom were not performed.

## Prioritized findings

| ID / priority | Observed implementation | Likely learner impact (expert inference, not tested) | Recommendation |
|---|---|---|---|
| HJ01 / P0 | / redirects to the neural-network X-Ray; logo points to /beta. |Two competing definitions of “home”; newcomers land in advanced notation before choosing a starting stage. |Propose / as the journey dashboard and logo target only after approval; keep /demo and /beta intact and discoverable.|
| HJ02 / P0 |No global Continue action or validated cross-module stage/evidence summary. Progress exists within lessons/modules. |Returning learners must remember module/lesson and cannot reliably distinguish progress from mastery at home. |Read-only evidence summaries; one honestly labeled resume suggestion with completion and mastery separate. Do not infer last visit from unrelated timestamps.|
| HJ03 / P0 |Global peer links: Beta guide, Math, Python, Linear Regression, X-Ray, Debug challenge. |A hub, a subject, a lab and a challenge seem like equivalent stages; no broad progression is visible. |Separate Journey/Browse from Resources/Help; place Regression in partly available ML Algorithms, X-Ray/challenge in applications/resources.|
| HJ04 / P1 |Beta copy targets working developers in a15–20-minute experiment/debug/feedback loop; no calculus refresher required for that beta. |Nonprogrammers may infer the whole platform is not for them; this beta promise can be mistaken for curriculum readiness. |Keep beta-specific copy on /beta; broaden orientation on the proposed homepage without rewriting accepted lessons.|
| HJ05 / P1 |Math hub offers independent subject access and integration; Python hub lists six modules with detailed mastery policies. |Good local entry points, but no global link between “why the mathematics” and “how the code becomes a model.” |One plain-language purpose per stage; a small “how this concept connects” panel linking actual lesson-level explanations.|
| HJ06 / P1 |Some conceptual recall links exist (Regression/Math, T05/S03/S04); no unified navigable concept map. |Learners may treat derivatives, losses, updates and model fitting as unrelated demos. |Typed, explanatory concept edges; distinguish refresher/uses/application from strict prerequisites.|
| HJ07 / P1 |Math uses Available/Implemented/Lab available labels; old gap-audit rows predate completed Math/Python work. |Implementation status, learner availability and demonstrated mastery can be conflated; stale documentation can drive incorrect navigation labels. |Canonical availability allowlist plus separate verification/evidence status; historical gap audit explicitly superseded.|
| HJ08 / P1 |At320px seven global links wrap to156px; local hub text and policy details precede many actions. |High first-screen cognitive load despite no observed overflow. |Compact keyboard-accessible Browse disclosure, one recommended action, details progressively disclosed; preserve direct links.|
| HJ09 / P1 |Local versioned evidence is browser/origin-specific; there is no universal reliable last-visited lesson record. |A dashboard could invent a current stage, erase unsupported progress or promise cross-device resume. |Define validated read-only adapters and unknown/unavailable states; durable navigation preferences require separate approved specification.|
| HJ10 / P2 |Existing design language already has ink/teal/orange, serif headings, rounded panels, native controls and focus states. |A visual rebrand would add cost without resolving information hierarchy. |Reuse tokens/patterns; do not reskin learning content, change commercial messages or prematurely rename the product.|

## What already works and must be preserved

- Working direct routes, experiments, debugging and notebooks; Math's “recommended, not locked” sequence.
- Module-local progress and independent assessment integrity; Task013's36 lessons/144 families/41 paired gates and all six notebooks.
- X-Ray's local five-step explanation and numerical trace; challenge as a focused application of sign/direction reasoning.
- Regression's substantive lesson sequence, guided housing bridge and independent mastery route.
- Original P01 route/evidence and its separately approved opt-in practice/completion copy.
- Current styling/accessibility affordances and truthful limitations; availability does not imply verified accessibility.

## Integrated audit disposition

No missing lesson is proposed to solve a navigation problem. This checkpoint identifies discovery/orientation debt alongside the existing Q013 conceptual-depth, metadata and accessibility obligations. [Design specification](homepage-learning-journey-design-spec.md), [concept map](homepage-concept-map.md) and [one prioritized roadmap](homepage-remediation-roadmap.md) cover remediation. The comprehensive Task017 depth audit and later external learner testing remain outstanding.

Current app preservation:388 existing protected files remain byte-identical; [preservation evidence](../outputs/homepage-journey-audit/preservation.json). Prior Task013.8 regression results remain historical evidence, not a newly rerun product test suite for this documentation-only task.

