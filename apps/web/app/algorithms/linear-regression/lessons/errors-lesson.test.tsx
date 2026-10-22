// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { evidenceStorageKey } from "../../../learn/foundation/evidence";
import { evaluateExercise } from "../../../learn/foundation/exercises";
import { ErrorsLab } from "../labs/errors-lab";
import { ERROR_DIRECTION_EXERCISE, ERRORS_EXERCISES, ERRORS_LESSON_ID, ERRORS_OBJECTIVES, METRIC_CHOICE_EXERCISE, RESIDUAL_VALUE_EXERCISE, TRAINING_ERROR_EXERCISE } from "./errors-content";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function completeErrorsLesson() {
  fireEvent.click(screen.getByRole("radio", { name: /Negative: the model underpredicted/ }));
  fireEvent.click(screen.getByRole("button", { name: "Reveal residual" }));
  fireEvent.change(screen.getByRole("spinbutton", { name: "Residual answer" }), { target: { value: "-5" } });
  fireEvent.click(screen.getByRole("button", { name: "Check residual" }));
  fireEvent.click(screen.getByRole("radio", { name: "MSE" }));
  fireEvent.click(screen.getByRole("button", { name: "Reveal outlier" }));
  fireEvent.click(screen.getByRole("radio", { name: /MSE, because squaring/ }));
  fireEvent.click(screen.getByRole("radio", { name: /Not enough: evaluate/ }));
}

describe("complete Error Metrics lesson", () => {
  it("explains metric units and exposes an accessible runtime table", () => {
    render(<ErrorsLab/>);
    expect(screen.getByRole("heading", { name: "The transformation determines what the metric emphasizes." })).toBeInTheDocument();
    expect(screen.getByText("Squared target units")).toBeInTheDocument();
    expect(screen.getByText("Mean Absolute Error (MAE)")).toBeInTheDocument();
    expect(screen.getByText(/Error metrics compare those estimates/)).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Runtime-generated residual calculations.*scroll horizontally/ })).toHaveAttribute("tabindex", "0");
    const table = screen.getByRole("table", { name: /Runtime-generated residual calculations/ });
    expect(within(table).getAllByRole("row")).toHaveLength(7);
    expect(within(table).getByRole("columnheader", { name: "Squared" })).toBeInTheDocument();
  });

  it("requires four correct checks and the outlier experiment for completion", async () => {
    render(<ErrorsLab/>); completeErrorsLesson();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Error-metrics outcome demonstrated" })).toBeInTheDocument());
    const stored = JSON.parse(localStorage.getItem(evidenceStorageKey("linear-regression"))!);
    expect(stored.lessons[ERRORS_LESSON_ID].state).toBe("completed");
    expect(Object.keys(stored.objectives).sort()).toEqual(Object.values(ERRORS_OBJECTIVES).sort());
    expect(stored.masteryEvidence).toEqual([]);
  });

  it("keeps experiment reset separate from recorded lesson completion", async () => {
    render(<ErrorsLab/>); completeErrorsLesson();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Error-metrics outcome demonstrated" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Reset experiment" }));
    expect(JSON.parse(localStorage.getItem(evidenceStorageKey("linear-regression"))!).lessons[ERRORS_LESSON_ID].state).toBe("completed");
  });
});

describe("error metric deterministic exercises", () => {
  it("scores all lesson exercises with fixed expected outcomes", () => {
    const results = [
      evaluateExercise(ERROR_DIRECTION_EXERCISE, { kind: "parameter-prediction", optionId: "negative" }, 1),
      evaluateExercise(RESIDUAL_VALUE_EXERCISE, { kind: "numerical", value: -5 }, 1),
      evaluateExercise(METRIC_CHOICE_EXERCISE, { kind: "conceptual", optionId: "mse" }, 1),
      evaluateExercise(TRAINING_ERROR_EXERCISE, { kind: "conceptual", optionId: "insufficient" }, 1),
    ];
    expect(results).toHaveLength(ERRORS_EXERCISES.length);
    expect(results.every(({ correct }) => correct)).toBe(true);
  });
});
