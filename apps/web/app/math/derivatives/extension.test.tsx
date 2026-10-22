// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { CalculusEssentials } from "./calculus-essentials";
import { DerivativesTopic } from "./topic";
import { TOPIC_PROGRESS_KEY, scoreAssessment } from "./curriculum";
import { EXTENSION_KEY, EXTENSION_MASTERY, EXTENSION_BLUEPRINT, emptyExtension, extensionChecks, gradeExtension, commitExtension } from "./extension-model";
import { validateExercise, type LearnerResponse } from "../../learn/foundation/exercises";
import { validateCurriculumCatalog } from "../../learn/foundation/curriculum";
import { REFERENCE_CURRICULUM } from "../../learn/foundation/reference-catalog";

beforeEach(() => localStorage.clear()); afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const ready = () => waitFor(() => expect(localStorage.getItem(EXTENSION_KEY)).not.toBeNull());
const correctAnswers = (variant: 0 | 1) => Object.fromEntries(extensionChecks(variant).map(check => [check.key, check.exercise.kind === "numerical" ? { kind: "numerical", value: check.exercise.expected } : { kind: "conceptual", optionId: check.exercise.expectedOptionId }])) as Record<string, LearnerResponse>;
function enterAnswers(variant: 0 | 1, wrongCritical = false) {
  extensionChecks(variant).forEach((check, index) => {
    const group = within(screen.getByRole("group", { name: `${index + 1}. ${check.critical ? "Critical · " : check.introductory ? "Introductory · " : ""}${check.exercise.prompt}` }));
    if (check.exercise.kind === "numerical") fireEvent.change(group.getByRole("spinbutton"), { target: { value: wrongCritical && check.key === "partial-x" ? 999 : check.exercise.expected } });
    else fireEvent.click(group.getByRole("radio", { name: check.exercise.options.find(option => check.exercise.kind === "conceptual" && option.id === check.exercise.expectedOptionId)!.label }));
  });
}
describe("Calculus essential completion", () => {
  it("covers ten essentials plus two noncritical introductions, with valid catalog and hand-calculated values", () => {
    expect(EXTENSION_BLUEPRINT.criticalKeys).toEqual(["limit", "jump", "corner", "partial-x", "simultaneous"]);
    expect(extensionChecks(0).filter(check => !check.introductory)).toHaveLength(10);
    for (const variant of [0, 1] as const) extensionChecks(variant).forEach(check => expect(validateExercise(check.exercise)).toEqual([]));
    expect(extensionChecks(0).flatMap(check => check.exercise.kind === "numerical" ? [check.exercise.expected] : [])).toEqual([2, 2, 12, 1.4, 2, 2, 6]);
    expect(extensionChecks(1).flatMap(check => check.exercise.kind === "numerical" ? [check.exercise.expected] : [])).toEqual([4, 4, 6, .4, 4, 1, 6]);
    expect(validateCurriculumCatalog(REFERENCE_CURRICULUM)).toEqual({ valid: true, errors: [] });
    expect(scoreAssessment({ concept: "sensitivity", calculation: "6", graph: "negative", application: "increase", debug: "wrong" })).toMatchObject({ score: 4, mastered: true });
  });
  it("requires 10/12 and every essential critical gate while preserving previously earned extension mastery", () => {
    const all = correctAnswers(0), essentials = { ...all }; delete essentials.jacobian; delete essentials.hessian;
    expect(gradeExtension(0, essentials)).toMatchObject({ score: 10, passed: true });
    delete essentials["partial-y"]; expect(gradeExtension(0, essentials)).toMatchObject({ score: 9, passed: false });
    for (const key of EXTENSION_BLUEPRINT.criticalKeys) { const missed = { ...all }; delete missed[key]; expect(gradeExtension(0, missed)).toMatchObject({ score: 11, passed: false }); }
    const passed = commitExtension(emptyExtension(), gradeExtension(0, all), "passed", "2026-10-15T14:00:00Z");
    const failed = commitExtension(passed, gradeExtension(1, {}), "failed", "2026-10-15T14:01:00Z");
    expect(failed.objectives[EXTENSION_MASTERY].mastered).toBe(true); expect(failed.masteryEvidence).toEqual(passed.masteryEvidence);
    expect(gradeExtension(1, all).passed).toBe(false);
  });
  it("makes corner/continuity and partial sensitivities available through native controls", async () => {
    render(<CalculusEssentials />); await ready();
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Differentiable: no");
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Symmetric estimate: 0");
    fireEvent.change(screen.getByRole("combobox", { name: "Continuity example" }), { target: { value: "hole" } });
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Two-sided limit: 2. Continuous: no");
    expect(within(screen.getByRole("table", { name: "Approach from both sides" })).getByText("Undefined")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider", { name: "Partial derivative x" }), { target: { value: 2 } });
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("Gradient=[4, 12]");
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("next point=[1.6, 0.8]");
    expect(JSON.parse(localStorage.getItem(EXTENSION_KEY)!).masteryEvidence).toEqual([]);
  });
  it("persists extension outcomes and alternative checks without altering old evidence", async () => {
    const old = JSON.stringify({ completed: ["why", "lab", "mastery"], mastered: true, bestScore: 4 });
    localStorage.setItem(TOPIC_PROGRESS_KEY, old); localStorage.setItem("ml-math-lab:evidence:math.linear-algebra:v1", "preserved core bytes");
    const view = render(<CalculusEssentials />); await ready(); enterAnswers(0, true); fireEvent.click(screen.getByRole("button", { name: "Submit extension check" }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent("11/12. No new extension mastery");
    expect(JSON.parse(localStorage.getItem(EXTENSION_KEY)!).masteryEvidence).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "Try alternate extension values" })); enterAnswers(1); fireEvent.click(screen.getByRole("button", { name: "Submit extension check" }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent("12/12. Extension mastery criteria met");
    await waitFor(() => expect(JSON.parse(localStorage.getItem(EXTENSION_KEY)!).objectives[EXTENSION_MASTERY].mastered).toBe(true));
    view.unmount(); render(<CalculusEssentials />); await waitFor(() => expect(screen.getByText(/Previously earned extension mastery is saved/)).toBeInTheDocument());
    expect(localStorage.getItem(TOPIC_PROGRESS_KEY)).toBe(old); expect(localStorage.getItem("ml-math-lab:evidence:math.linear-algebra:v1")).toBe("preserved core bytes");
  });
  it("does not complete guided practice from the calculation alone, and clarifies the historical mastery prompt", async () => {
    render(<DerivativesTopic />); await ready(); fireEvent.click(screen.getByRole("button", { name: /Guided practice/ }));
    const pilot = within(screen.getByRole("article", { name: "Derivatives pilot activity" }));
    fireEvent.change(pilot.getByRole("textbox", { name: "Calculated derivative" }), { target: { value: "14" } }); fireEvent.click(pilot.getByRole("button", { name: "Check" }));
    expect(JSON.parse(localStorage.getItem(TOPIC_PROGRESS_KEY)!).completed).not.toContain("practice");
    fireEvent.click(pilot.getByRole("button", { name: "Negative" })); fireEvent.click(pilot.getByRole("button", { name: "Increase w" })); fireEvent.click(pilot.getByRole("button", { name: "Record guided practice" }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem(TOPIC_PROGRESS_KEY)!).completed).toContain("practice"));
    fireEvent.click(screen.getByRole("button", { name: /Mastery assessment/ })); expect(pilot.getByRole("textbox", { name: "Mastery debug" }).parentElement).toHaveTextContent("coefficient c");
  });
  it("keeps future extension evidence untouched and tolerates blocked legacy storage", async () => {
    const future = '{"schemaVersion":"2.0.0","curriculumVersion":"future"}'; localStorage.setItem(EXTENSION_KEY, future);
    const view = render(<CalculusEssentials />); await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("cannot be saved"));
    fireEvent.change(screen.getByRole("slider", { name: "Partial derivative x" }), { target: { value: 2 } }); expect(localStorage.getItem(EXTENSION_KEY)).toBe(future); view.unmount();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<DerivativesTopic />); await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(2)); expect(screen.getByRole("heading", { name: "Beyond one smooth curve" })).toBeInTheDocument();
  });
});
