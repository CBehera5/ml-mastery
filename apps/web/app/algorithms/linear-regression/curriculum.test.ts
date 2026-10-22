import { describe, expect, it } from "vitest";
import { adjacentLessons, lessonHref, REGRESSION_LESSONS, regressionLessonStatus } from "./curriculum";

describe("linear regression curriculum metadata", () => {
  it("defines nine unique, independently addressable lessons", () => {
    expect(REGRESSION_LESSONS).toHaveLength(9);
    expect(new Set(REGRESSION_LESSONS.map(({ id }) => id)).size).toBe(9);
    expect(REGRESSION_LESSONS.map(({ id }) => lessonHref(id))).toEqual([
      "/algorithms/linear-regression/why",
      "/algorithms/linear-regression/equation",
      "/algorithms/linear-regression/errors",
      "/algorithms/linear-regression/gradient-descent",
      "/algorithms/linear-regression/multiple-features",
      "/algorithms/linear-regression/implementation",
      "/algorithms/linear-regression/failure-modes",
      "/algorithms/linear-regression/project",
      "/algorithms/linear-regression/mastery",
    ]);
  });

  it("provides progression without locking direct lesson access", () => {
    expect(adjacentLessons("why")).toMatchObject({ previous: null, next: { id: "equation" } });
    expect(adjacentLessons("multiple-features")).toMatchObject({ previous: { id: "gradient-descent" }, next: { id: "implementation" } });
    expect(adjacentLessons("mastery")).toMatchObject({ previous: { id: "project" }, next: null });
  });

  it("distinguishes verified, implemented, and planned lessons", () => {
    expect(regressionLessonStatus("why")).toBe("verified");
    expect(regressionLessonStatus("equation")).toBe("verified");
    expect(regressionLessonStatus("errors")).toBe("verified");
    expect(regressionLessonStatus("implementation")).toBe("verified");
    expect(regressionLessonStatus("project")).toBe("implemented");
  });
});
