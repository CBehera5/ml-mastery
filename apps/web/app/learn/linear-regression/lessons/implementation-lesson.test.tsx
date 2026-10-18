// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { evidenceStorageKey } from "../../foundation/evidence";
import { evaluateExercise } from "../../foundation/exercises";
import { ImplementationLesson } from "./implementation-lesson";
import { GRADIENT_FORMULA_EXERCISE, IMPLEMENTATION_EXERCISES, IMPLEMENTATION_LESSON_ID, IMPLEMENTATION_OBJECTIVES, ITERATION_TRACE_EXERCISE, MSE_REPAIR_EXERCISE, PREDICTION_CODE_EXERCISE, RESIDUAL_CODE_EXERCISE, UPDATE_REPAIR_EXERCISE, WORKFLOW_EXERCISE } from "./implementation-content";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function completeImplementationLesson() {
  const answers = ["w * x + b", "prediction - actual", "r ** 2", "(2 / m) * sum(r * x for r, x in zip(residuals, xs))", "w - learning_rate * dw"];
  const selects = screen.getAllByRole("combobox"), buttons = screen.getAllByRole("button", { name: "Check code" });
  answers.forEach((answer, index) => { fireEvent.change(selects[index], { target: { value: answer } }); fireEvent.click(buttons[index]); });
  fireEvent.change(screen.getByRole("spinbutton", { name: "Updated weight" }), { target: { value: "1.8" } });
  fireEvent.click(screen.getByRole("button", { name: "Check result" }));
  fireEvent.click(screen.getByRole("radio", { name: /Split first, fit on training rows/ }));
  fireEvent.click(screen.getByRole("button", { name: "Check decision" }));
}

describe("Python implementation lesson", () => {
  it("teaches the progressive implementation and exposes a notebook download", () => {
    render(<ImplementationLesson/>);
    expect(screen.getByRole("heading", { name: /Translate each mathematical idea/ })).toBeInTheDocument();
    expect(screen.getByLabelText("Single feature prediction function")).toHaveTextContent("return w * x + b");
    expect(screen.getByRole("heading", { name: "Read the equation as a sentence." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Review derivatives and gradients/ })).toHaveAttribute("href", "/math/derivatives");
    expect(screen.getByText("Learning rate")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Download the Colab-compatible notebook/ })).toHaveAttribute("href", "/notebooks/linear-regression-from-scratch.ipynb");
    expect(screen.getByText("Residuals", { selector: "dt" }).parentElement).toHaveTextContent("[-2, -3]");
  });

  it("does not complete from reading or a single exercise", async () => {
    render(<ImplementationLesson/>);
    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "w * x + b" } }); fireEvent.click(screen.getAllByRole("button", { name: "Check code" })[0]);
    expect(screen.getByRole("heading", { name: "1 of 7 checks complete" })).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(evidenceStorageKey("linear-regression"))!).lessons[IMPLEMENTATION_LESSON_ID].state).toBe("started"));
  });

  it("records three objective completions without awarding mastery", async () => {
    render(<ImplementationLesson/>); completeImplementationLesson();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Implementation outcome demonstrated" })).toBeInTheDocument());
    const stored = JSON.parse(localStorage.getItem(evidenceStorageKey("linear-regression"))!);
    expect(stored.lessons[IMPLEMENTATION_LESSON_ID].state).toBe("completed");
    expect(Object.keys(stored.objectives).sort()).toEqual(Object.values(IMPLEMENTATION_OBJECTIVES).sort());
    expect(stored.masteryEvidence).toEqual([]);
  });
});

describe("implementation deterministic exercises", () => {
  it("validates every required exercise deterministically", () => {
    const responses = [
      [PREDICTION_CODE_EXERCISE, { kind: "constrained-code", slots: { return: "w * x + b" } }],
      [RESIDUAL_CODE_EXERCISE, { kind: "constrained-code", slots: { residual: "prediction - actual" } }],
      [MSE_REPAIR_EXERCISE, { kind: "constrained-code", slots: { term: "r ** 2" } }],
      [GRADIENT_FORMULA_EXERCISE, { kind: "constrained-code", slots: { gradient: "(2 / m) * sum(r * x for r, x in zip(residuals, xs))" } }],
      [UPDATE_REPAIR_EXERCISE, { kind: "constrained-code", slots: { update: "w - learning_rate * dw" } }],
      [ITERATION_TRACE_EXERCISE, { kind: "numerical", value: 1.8 }],
      [WORKFLOW_EXERCISE, { kind: "conceptual", optionId: "safe" }],
    ] as const;
    expect(responses).toHaveLength(IMPLEMENTATION_EXERCISES.length);
    responses.forEach(([exercise, response]) => expect(evaluateExercise(exercise, response, 1).correct).toBe(true));
  });
});
