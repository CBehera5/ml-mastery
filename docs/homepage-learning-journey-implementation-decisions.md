# Homepage learning journey — implemented decisions

Status: **Implemented; awaiting founder review.** Founder authorized the accepted bounded homepage/navigation design. This is not authorization for Task014, a new curriculum, deployment or external testing. The earlier audit/wireframes remain historical design evidence.

## Frozen behavior

| Decision | Implemented rule |
|---|---|
| Entry point |/ is the Learning Journey Dashboard, not a redirect. Existing /demo,/beta, Math/Python/Regression routes remain. Shared logo returns /. |
| Hierarchy |One primary Start Learning/Continue Learning action, current or suggested focus, concept-to-ML motivation, independent evidence summary, optional experience choices, staged roadmap, conceptual links and grouped tools/help. |
| Availability |Math and six Python modules available; ML Algorithms partly available through Linear Regression; full Project Studio planned, limited guided Regression bridge separately available; Deployment/MLOps future/unscoped with no launch control. No percentages/unlocks invented. |
| Starting knowledge |Guided, Refresher and Challenge-first entry use existing explanations/practice/assessments. Choices and browsing selection are in-memory for this visit only. No new ability record or global placement test. |
| Current stage |Roadmap initially selects the stage of the validated recommendation; an explicit stage selection overrides browsing for the current view. This is not a stored proficiency classification. |
| Continuation |Read-only allowlist of25 existing storage keys. Relevant validated evidence timestamps rank candidates newest first; candidates without timestamps follow in stable declared scope order. Exact last visit is never claimed. All other saved active scopes are reachable through evidence details. |
| No usable progress |Start variables/equations. Read denial/unsupported/corrupt/oversized scope is unknown, not zero; show a warning without resetting or rewriting bytes. Other valid scopes can still supply continuation. |
| Python restoration |Lazy-load the owning module's existing strict codec only when its saved envelope exists; derive a minimal navigation summary, never expose answers. Active independent draft → original assessment; confirmed failed critical family → native lesson recall; already earned mastery → overview/review; otherwise actual started practice → lesson, falling back to first unfinished lesson. All-complete practice → overview for learner choice, not mastery. |
| Scope boundaries |Six Python module keys (Essentials v2, other modules v1); original P01 v1 stays separate. Math/Regression shared evidence uses the existing validator plus exact version and owned ID prefixes. Pilot/legacy progress remains explicitly labeled, never promoted to modern module mastery. |
| Legacy/drafts |Supported original P01, Derivatives pilot, three five-flag Math lessons, Regression bridge/draft and three Math assessment drafts use original codecs or exact existing flag shape. Parsers that normally reset invalid records are wrapped with compatibility/round-trip checks; dashboard never invokes their reset/store machinery. |
| Draft confirmation |Continue opens original active/review flow; no automatic review, scoring, submission, answer reveal or mastery. Reload/confirmation semantics remain with the owning assessment. |
| Persistence |No setItem/removeItem/clear, migrations, award or transfer call from the dashboard. Storage/pageshow/focus refresh recomputes summaries without writing. No arbitrary localStorage scan, persistent last-opened record, telemetry or account sync added. |
| Concept graph |Five requested explanatory pathways are accessible native disclosures with real route links; no prerequisite locks or cross-topic evidence equivalence. |
| Shared navigation |Native Browse topics/Challenges/Help disclosures, one open at a time, Escape closes and returns focus; link activation closes the menu. Beta Guide under Help; X-Ray/debugging retained under Challenges and contextual tools. |
| Reuse |Existing design tokens/native controls and Next Link; scoped dashboard/nav CSS; no new dependency, runtime, backend or database. |

## Conflicts resolved and limits

The audit/design were read before editing. No unresolved product decision blocked this bounded implementation. The earlier roadmap's “not authorized” text is historical and is superseded by the founder's explicit implementation authorization, not silently treated as approval of subsequent phases.

One actual content/status conflict was found: the Regression overview said its working guided project and independent assessment were planned. Only that status paragraph and its heading were corrected to describe the existing narrow bridge/assessment and open quality obligations; no lesson content or grading was rewritten.

Some existing controllers do not save current route, transient answers or precise last activity. A genuinely empty/unsupported record cannot supply an exact resume position; the dashboard gives an honestly labeled suggestion/subject entry, not fabricated recency. X-Ray's unsaved session does not become a new persisted history. All current-origin/user-editable evidence limitations remain.

Refresher mode links existing explanations, not a newly authored condensed curriculum. Challenge-first exposes existing Python and Regression assessments; Math assessments remain reachable through their available subject routes. Full Project Studio/MLOps and new algorithms remain unavailable.

## Acceptance evidence

[Completion report](HOMEPAGE_LEARNING_JOURNEY_COMPLETION.md) links final regression logs, production screenshots, browser route/history/keyboard evidence and preservation checks. Genuine screen-reader speech/navigation, genuine200%/400% browser zoom and genuine Colab execution remain unverified. Static/color/320px checks do not replace them.

