import { expect, it } from "vitest";
import { CATALOG_VALID, MASTERY_AVAILABLE, VERIFICATION_RELEASED } from "./catalog";
import { confirmAttempt, emptyState } from "./model";
it("releases mastery only after complete catalog and explicit verification", () => {
  expect(CATALOG_VALID).toBe(true);
  expect(MASTERY_AVAILABLE).toBe(CATALOG_VALID && VERIFICATION_RELEASED);
  if (!VERIFICATION_RELEASED) expect(() => confirmAttempt({ ...emptyState(), draft: { ...emptyState().draft, phase: "review" } }, true, "2026-10-16T12:00:00Z")).toThrow(/verification/);
});
