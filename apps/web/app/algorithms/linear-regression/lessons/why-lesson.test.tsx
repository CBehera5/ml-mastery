// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { evidenceStorageKey } from "../../../learn/foundation/evidence";
import { evaluateExercise } from "../../../learn/foundation/exercises";
import { REGRESSION_KIND_EXERCISE, SIZE_PREDICTION_EXERCISE, SUITABILITY_EXERCISE, WHY_LESSON_ID, WHY_OBJECTIVES } from "./why-content";
import { WhyLinearRegressionLesson } from "./why-lesson";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function completeLesson() {
  fireEvent.click(screen.getByRole("radio", { name: /3.6-thousand/ }));
  fireEvent.click(screen.getByRole("button", { name: "Reveal the model estimate" }));
  fireEvent.change(screen.getByRole("slider", { name: "Floor area (thousand ft²)" }), { target: { value: "3" } });
  fireEvent.click(screen.getByRole("radio", { name: "A numerical price estimate" }));
  fireEvent.click(screen.getByRole("radio", { name: /monthly energy use/ }));
}

describe("Why Linear Regression lesson", () => {
  it("teaches the required vocabulary without requiring derivatives", () => {
    render(<WhyLinearRegressionLesson />);
    expect(screen.getByRole("heading", { name: "Start with the decision, not the equation." })).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument(); expect(screen.getByText("Target")).toBeInTheDocument();
    expect(screen.queryByText(/derivative/i)).not.toBeInTheDocument();
  });

  it("requires a prediction before revealing runtime-computed estimates", () => {
    render(<WhyLinearRegressionLesson />);
    const reveal = screen.getByRole("button", { name: "Reveal the model estimate" });
    expect(reveal).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: /3.6-thousand/ })); fireEvent.click(reveal);
    const feedback = screen.getByText(/The verified runtime estimates/);
    expect(feedback).toHaveTextContent("₹198.8 lakh"); expect(feedback).toHaveTextContent("₹291.2 lakh");
  });

  it("keeps graph observations keyboard selectable", () => {
    render(<WhyLinearRegressionLesson />);
    const point = screen.getByRole("button", { name: /Select observation 1/ });
    fireEvent.keyDown(point, { key: "Enter" });
    expect(screen.getByRole("img", { name: /Selected observation 1/ })).toBeInTheDocument();
  });

  it("does not complete from navigation or one answer", async () => {
    render(<WhyLinearRegressionLesson />);
    fireEvent.click(screen.getByRole("radio", { name: "A numerical price estimate" }));
    await waitFor(() => expect(localStorage.getItem(evidenceStorageKey("linear-regression"))).toContain('"state":"started"'));
    expect(screen.getByRole("heading", { name: "Connect the final pieces" })).toBeInTheDocument();
  });

  it("records completion and three objective outcomes only after meaningful actions", async () => {
    render(<WhyLinearRegressionLesson />); completeLesson();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Lesson outcome demonstrated" })).toBeInTheDocument());
    const stored = JSON.parse(localStorage.getItem(evidenceStorageKey("linear-regression"))!);
    expect(stored.lessons[WHY_LESSON_ID].state).toBe("completed");
    expect(Object.keys(stored.objectives).sort()).toEqual(Object.values(WHY_OBJECTIVES).sort());
    expect(stored.masteryEvidence).toEqual([]);
  });

  it("restores locally recorded completion without altering other evidence", async () => {
    const other = { state: "completed", completedObjectiveIds: ["other.objective"], updatedAt: "2026-10-15T00:00:00.000Z" };
    localStorage.setItem(evidenceStorageKey("linear-regression"), JSON.stringify({ schemaVersion: "1.0.0", curriculumVersion: "old", lessons: { "linear-regression.equation": other, [WHY_LESSON_ID]: { state: "completed", completedObjectiveIds: Object.values(WHY_OBJECTIVES), updatedAt: "2026-10-15T00:00:00.000Z" } }, objectives: {}, assessmentAttempts: [], masteryEvidence: [], projectMilestones: [] }));
    render(<WhyLinearRegressionLesson />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Lesson outcome demonstrated" })).toBeInTheDocument());
    expect(localStorage.getItem(evidenceStorageKey("linear-regression"))).toContain("linear-regression.equation");
  });
});

describe("Why lesson deterministic exercises", () => {
  it("scores prediction, misconception, and suitability outcomes deterministically", () => {
    expect(evaluateExercise(SIZE_PREDICTION_EXERCISE, { kind: "parameter-prediction", optionId: "larger" }, 1).correct).toBe(true);
    expect(evaluateExercise(REGRESSION_KIND_EXERCISE, { kind: "conceptual", optionId: "class" }, 1).correct).toBe(false);
    expect(evaluateExercise(SUITABILITY_EXERCISE, { kind: "conceptual", optionId: "energy" }, 1).correct).toBe(true);
  });
});
