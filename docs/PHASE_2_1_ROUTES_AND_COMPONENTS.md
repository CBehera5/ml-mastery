# Phase 2.1 routes and component plan

Proposed implementation ledger. No application file listed here changes during specification preparation.

## Route changes and compatibility

| Route or navigation item | Current | Required later behavior |
|---|---|---|
| `/` | Learning Journey Dashboard | Public informational landing, page-specific metadata; no storage read, automatic redirect, login or paywall |
| `/journey` | No dedicated route | New thin page wrapper reuses the existing `LearningJourney` component and current dashboard metadata |
| `/#learning-stages` | No target | New public ordered four-stage section; same-page quiet navigation link |
| `/#getting-started` | Dashboard starting-mode disclosure | Keep this root ID as a labeled compatibility section offering “Choose your starting point in My learning journey” → `/journey#getting-started`; no automatic hash redirect or storage lookup |
| `/#resources` | Dashboard tools/notebooks | Keep this root ID as a labeled compatibility section offering “Open experiments and notebooks in My learning journey” → `/journey#resources` |
| `/journey#getting-started`, `/journey#resources` | Existing IDs inside current dashboard | Preserve original sections and native fragment behavior |
| Landing brand | Root | Remains `/` |
| Existing learner `BetaNav` brand and Learning journey menu | `/` | `/journey`; add a quiet Public home link to `/` in Browse, avoiding loss of either destination |
| Shared Help links | `/#getting-started`, `/#resources` | Update to `/journey#getting-started`, `/journey#resources`; retain beta guide at `/beta` |
| Existing course “Return to your learning journey” links | Some hardcode `/` | Audit by visible intent and update only journey-return links to `/journey`; do not blindly replace every `/` link |
| Try a Free Lab | No new landing action yet | `/demo`, original interactive X-Ray unchanged |
| Math / Python / Algorithm Lab | `/math`, `/python`, `/supervised` | Same URLs; landing stage names may differ from current hub titles without rewriting those hubs |
| Studio | Unavailable | Noninteractive Coming Soon presentation; no new `/projects` or `/studio` route |
| All lessons, assessments, notebooks, `/demo`, `/beta`, `/challenges/wrong-direction`, existing Regression bridge and pilots | Working existing destinations | Preserve URLs, behavior and evidence. No prerequisite/entitlement lock |
| `/labs`, `/curriculum`, `/pricing`, sign-in/account routes | Not implemented as complete surfaces | Do not add routes or broken links in this tranche |

The two root compatibility sections are compact footer utilities, not extra marketing cards or CTAs. Hidden/empty anchors would lose the original intent; each must have a meaningful heading and visible exact destination. Direct fragment entry must bring the relevant utility into view; normal landing hero remains first on unfragmented `/`. No fragment handling may auto-score, open an assessment, change state or suppress browser Back. An explicit permanent redirect is inappropriate for `/` because it has a new public purpose.

## Navigation state requirements

Public navigation is defined by the public shell; learner navigation by the existing learning context. Saved local activity does not authenticate anyone. No session backend, account menu, sign-in stub or auth dependency may be added. A future authenticated variant must consume a genuine approved session and real capabilities under another scope; its definition here is a boundary only. This milestone does not change any route access-control policy.

Use ordinary Next links/native anchors. Public mobile menu needs an accessible name, exposed expanded state and Escape close/focus return; link activation closes it. Reuse native disclosure behavior where practical. Learner menus retain the existing separate Browse/Challenges/Help arrangement, so there is no whole-application navigation redesign. Current-page indication cannot depend only on color. Keyboard/Back/Forward and modified-click/new-tab behavior remain normal.

## Component inventory and reuse

| Component/source | Reuse or proposed bounded change | Guardrail |
|---|---|---|
| `apps/web/app/page.tsx` | Replace dashboard wrapper with public landing composition and local metadata | Do not alter global root layout metadata or runtime merely to style landing |
| Proposed `apps/web/app/journey/page.tsx` | Import existing `LearningJourney`, preserve dashboard metadata | No copied dashboard controller or new persistence layer |
| Proposed `apps/web/app/landing/` | Small scoped landing component/style, public navigation, ordered stage path and root-hash compatibility utilities | No new dependencies, canvas/model runtime, embedded lab, auth, payment or remote assets |
| `learning-journey/catalog.ts` | Reuse verified Math/Python routes; update four stage names/status and add MLP/MS destinations | Preserve established route strings/IDs and keep unscoped MLOps outside core display; no universal catalog-engine rewrite |
| `learning-journey/dashboard.tsx` | Reuse whole dashboard; correct stale copy, four-stage connector condition, scoped evidence clarification and journey-relative help intent | Preserve hooks, recommendations, optional modes, sections and no-write behavior; final-stage connector must not imply an invisible fifth node |
| `learning-journey/journey.module.css` | Only minimal four-stage layout compatibility if current grid hardcodes five | No dashboard visual overhaul; navigation and reading order retained |
| `components/beta-nav.tsx` | Update brand/journey/help destinations and quiet public-home link | Preserve disclosure event semantics, focus and all existing lesson links |
| `components/beta-nav.module.css` | No broad restyle planned; permit only necessary scoped navigation-link layout adjustment | Existing dark/light readability findings are separate measured fixes unless a concrete scoped change is approved |
| Existing hardcoded journey-return links | Explicitly enumerated navigational target corrections only | No prose/lesson-content refactor, grader or route rename |
| Existing icons/typography/Link | Reuse local assets, native controls and system fonts | No imported sample raster used as interactive UI; no external font or dependency |
| Existing dashboard/progress tests and new landing/route tests | Preserve original safety assertions, add meaningful route/hash/status checks | Do not weaken tests to accommodate a fake resume/auth state |
| `learning-journey/progress.ts`, owning codecs/models, authored banks, numerical runtime, frozen verification files | Protected; no intended changes | Missing algorithm resume support is documented, not “fixed” by a new reader in this tranche |

Candidate implementation test files: existing `dashboard.test.tsx` / `progress.test.ts`, new scoped landing/navigation tests and production browser smoke coverage. Exact additional return-link files must be listed after an `rg` intent audit before editing. If implementation needs a file beyond this boundary, document why; a grader, codec, reference or auth change requires separate review rather than opportunistic inclusion.

## Proposed structure

Public header → hero and one primary `/demo` link → ordered four-stage path → compact footer/compatibility links. The learner `/journey` route renders the existing dashboard, including its normal independent Start/Continue action. There is no competing landing CTA on the dashboard. An optional reused stage-list data shape can share truthful names/status across the two surfaces, but must not unify controllers, recalculate progress or change state ownership.
