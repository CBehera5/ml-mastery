# Privacy-conscious beta analytics

Task 004 uses a first-party, session-scoped event log in `sessionStorage`. Each record contains only the event name, ISO timestamp, and application route. It contains no user identifier, fingerprint, form answer, mathematical input, or cross-session identifier. Events also emit a browser `CustomEvent` named `ml-math-lab:analytics` so an approved analytics integration can subscribe later without changing product flows.

| Event | Trigger |
| --- | --- |
| `beta_started` | The `/beta` welcome experience mounts. |
| `demo_started` | The `/demo` X-Ray mounts, including direct access. |
| `demo_completed` | All five lesson actions have genuinely passed their completion conditions. |
| `challenge_started` | The learner runs the deliberately broken update. |
| `challenge_completed` | A computed attempt matches the production descent update and reduces loss. |
| `feedback_opened` | The feedback page mounts or its completion link is selected. |
| `pricing_interest_clicked` | The learner selects the $39 interest link after challenge completion. This is interest only, not a purchase. |

No network analytics service is configured. Session events disappear when the browser session ends. Any future provider requires a privacy review, consent decision, retention policy, and an update to this document before activation.

