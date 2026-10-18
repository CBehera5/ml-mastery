# Beta feedback

The questionnaire intentionally avoids names, email addresses, employer details, source code, and account creation. It asks:

1. Prior ML experience: new, tutorial/coursework, or production systems.
2. Ease of understanding on a 1–5 scale.
3. Concepts that remained confusing.
4. Perceived learning value on a 1–5 scale.
5. Whether the debugging challenge was useful: yes, partly, or no.
6. Whether the participant would consider the unfinished complete kit at $39: yes, maybe, or no.
7. The single most important improvement.

The form is available at `/beta/feedback`. For a beta release, set `NEXT_PUBLIC_BETA_FEEDBACK_FORM_URL` to an HTTPS form endpoint that accepts POST fields. The provider must be configured not to collect sign-in identity or email automatically. Without this setting, submission is safely blocked and the answers are not transmitted.

Review results in aggregate after each 2–3 sessions. Treat purchase consideration as product-interest research, never as a purchase, preorder, or commitment.

