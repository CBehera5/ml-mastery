// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { GeometryLearning } from "./geometry-learning";
import { ModuleAssessment } from "./module-assessment";
import { GEOMETRY_CONTENT, geometryQuestions, geometryTopics, type GeometryLesson } from "./geometry-content";
import { MODULE_ID } from "./content";
import { DRAFT_KEY, MASTERY_ID, STORAGE_KEY, assessmentQuestions, newDraft, type Variant } from "./geometry-model";
import { STORAGE_KEY as CORE_KEY, DRAFT_KEY as CORE_DRAFT_KEY, MASTERY_ID as CORE_MASTERY, emptyEvidence as emptyCore } from "./model";

beforeEach(() => localStorage.clear()); afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const ready = () => waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull());
function enterModuleAnswers(variant: Variant, missCritical = false) {
  assessmentQuestions(variant).forEach((question, index) => {
    const group = screen.getByRole("group", { name: `Q${index + 1}. ${question.critical ? "Critical · " : ""}${question.exercise.prompt}` });
    if (question.exercise.kind === "numerical") fireEvent.change(within(group).getByRole("spinbutton"), { target: { value: missCritical && question.key === "transform.apply" ? 999 : question.exercise.expected } });
    else fireEvent.click(within(group).getByRole("radio", { name: question.exercise.options.find(option => question.exercise.kind === "conceptual" && option.id === question.exercise.expectedOptionId)!.label }));
  });
}
function submitModule() {
  fireEvent.click(screen.getByRole("button", { name: "Review module responses" }));
  expect(screen.getByRole("heading", { name: "Review your module responses" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Submit module assessment" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox")); fireEvent.click(screen.getByRole("button", { name: "Submit module assessment" }));
}
/** The new playgrounds add their own live readouts (<dl>); these tests target the original explorers' status paragraphs. */
const legacyStatus = (scope: { getAllByRole: (role: string) => HTMLElement[] }) => scope.getAllByRole("status").filter(node => node.tagName !== "DL" && !node.hasAttribute("data-live-status"))[0];
describe("geometry lessons and module assessment v2", () => {
  it.each(["transformations", "eigenvectors"] as GeometryLesson[])("completes %s only after concept exploration and checks; preserves prior state", async lesson => {
    const core = emptyCore(); core.objectives[CORE_MASTERY] = { completed: true, mastered: true, evidenceIds: ["existing-core-pass"], updatedAt: "2026-10-15T12:00:00Z" };
    const preserved = { [CORE_KEY]: JSON.stringify(core), [CORE_DRAFT_KEY]: "existing core draft", "ml-math-lab:lesson:matrices-multiplication:v1": "[true,true,true,true,true]", "ml-math-lab:evidence:math.algebra:v1": "existing algebra bytes", "ml-math-lab:topic:derivatives:v1": "existing derivatives bytes", "ml-math-lab:evidence:linear-regression:v1": "existing regression bytes" };
    Object.entries(preserved).forEach(([key, value]) => localStorage.setItem(key, value));
    const view = render(<GeometryLearning lesson={lesson} />); await ready();
    for (const question of geometryQuestions(0).filter(question => geometryTopics(lesson).includes(question.topic))) {
      const group = within(screen.getByRole("group", { name: question.exercise.prompt }));
      if (question.exercise.kind === "numerical") fireEvent.change(group.getByRole("spinbutton"), { target: { value: question.exercise.expected } });
      else fireEvent.click(group.getByRole("radio", { name: question.exercise.options.find(option => question.exercise.kind === "conceptual" && option.id === question.exercise.expectedOptionId)!.label }));
      fireEvent.click(group.getByRole("button"));
    }
    expect(screen.queryByRole("heading", { name: "Geometry lesson outcome demonstrated" })).not.toBeInTheDocument();
    for (const topic of geometryTopics(lesson)) {
      const region = within(screen.getByRole("region", { name: GEOMETRY_CONTENT[topic].title }));
      fireEvent.change(region.getByRole("combobox", { name: topic === "eigen" ? "Eigenvector example" : "Transformation A" }), { target: { value: "reflection" } });
    }
    expect(screen.getByRole("heading", { name: "Geometry lesson outcome demonstrated" })).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).lessons[`${MODULE_ID}.geometry.${lesson}`].state).toBe("completed"));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toEqual([]);
    view.unmount(); render(<GeometryLearning lesson={lesson} />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Geometry lesson outcome demonstrated" })).toBeInTheDocument());
    Object.entries(preserved).forEach(([key, value]) => expect(localStorage.getItem(key)).toBe(value));
  });
  it("links span coefficients to the graph and explains singular versus nearly singular undo", async () => {
    render(<GeometryLearning lesson="transformations" />); await ready();
    const span = within(screen.getByRole("region", { name: GEOMETRY_CONTENT.span.title }));
    fireEvent.change(span.getByRole("slider", { name: "Span coefficient c2" }), { target: { value: 2 } });
    expect(span.getByRole("img", {name: /^A maps the grid and vector/})).toHaveAccessibleName(/input \[1, 2\] to \[5, 0\]/);
    expect(span.getAllByRole("status").some(node => node.textContent?.includes("span only a line"))).toBe(true);
    const inverse = within(screen.getByRole("region", { name: GEOMETRY_CONTENT.inverse.title }));
    fireEvent.change(inverse.getByRole("combobox", { name: "Transformation A" }), { target: { value: "near" } });
    expect(legacyStatus(inverse)).toHaveTextContent("Rank=2"); expect(legacyStatus(inverse)).toHaveTextContent("Mathematically invertible, but near-singular");
    fireEvent.change(inverse.getByRole("combobox", { name: "Transformation A" }), { target: { value: "collapse" } });
    expect(legacyStatus(inverse)).toHaveTextContent("Singular: no unique inverse");
    fireEvent.change(screen.getByRole("spinbutton", { name: "Geometry answer: Map a vector using matrix columns and row sums." }), { target: { value: 99 } });
    fireEvent.click(screen.getByRole("button", { name: "Check geometry: Map a vector using matrix columns and row sums." }));
    expect(screen.getByText(/Reconsider: The first row/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[`${MODULE_ID}.geometry.transform.apply`]).toBeUndefined();
  });
  it("explains zero/negative eigenvalues, excludes zero inputs and handles rotations without invented eigenpairs", async () => {
    render(<GeometryLearning lesson="eigenvectors" />); await ready();
    const example = screen.getByRole("combobox", { name: "Eigenvector example" });
    fireEvent.change(example, { target: { value: "reflection" } }); expect(legacyStatus(screen)).toHaveTextContent("λ=-1");
    fireEvent.change(screen.getByRole("slider", { name: "Candidate vector coordinate 1" }), { target: { value: 0 } });
    expect(legacyStatus(screen)).toHaveTextContent("zero vector is excluded");
    fireEvent.change(example, { target: { value: "collapse" } }); fireEvent.change(screen.getByRole("slider", { name: "Candidate vector coordinate 2" }), { target: { value: 1 } });
    expect(legacyStatus(screen)).toHaveTextContent("eigenvalue zero");
    fireEvent.change(example, { target: { value: "rotation" } }); expect(legacyStatus(screen)).toHaveTextContent("not an eigenvector");
    expect(within(screen.getByRole("table", { name: "Chosen known eigenpairs, not a general eigensolver" })).getAllByRole("row")).toHaveLength(1);
  });
  it("restores a 31/32 critical failure, retries v2 coverage and persists expanded mastery separately", async () => {
    localStorage.setItem(CORE_KEY, "existing core mastery bytes"); localStorage.setItem(CORE_DRAFT_KEY, "existing core draft bytes");
    let view = render(<ModuleAssessment />); await ready();
    enterModuleAnswers("v01", true); expect(screen.queryByText(/Worked result:/)).not.toBeInTheDocument(); submitModule();
    expect(legacyStatus(screen)).toHaveTextContent("31/32"); expect(legacyStatus(screen)).toHaveTextContent("no new mastery");
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toEqual([]));
    expect(screen.getByRole("link", { name: `Review ${GEOMETRY_CONTENT.transform.title} →` })).toHaveAttribute("href", "/math/linear-algebra/transformations#geometry-transform");
    view.unmount(); view = render(<ModuleAssessment />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Review before another module attempt" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Start alternate module variant" }));
    expect(screen.getByText(/Current variant: v02/)).toBeInTheDocument(); enterModuleAnswers("v02"); submitModule();
    expect(screen.getByRole("heading", { name: "Linear Algebra module mastery criteria met" })).toHaveFocus();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[MASTERY_ID].mastered).toBe(true));
    expect(within(screen.getByRole("table", { name: "Last 20 Linear Algebra module attempts" })).getByText("8/8")).toBeInTheDocument();
    view.unmount(); render(<ModuleAssessment />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Linear Algebra module mastery criteria met" })).toBeInTheDocument());
    expect(localStorage.getItem(CORE_KEY)).toBe("existing core mastery bytes"); expect(localStorage.getItem(CORE_DRAFT_KEY)).toBe("existing core draft bytes");
  }, 15000);
  it("restores partial v2 drafts, rejects forged submissions, preserves future evidence and reports blocked storage", async () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...newDraft(), phase: "review", responses: { "transform.apply": { kind: "numerical", value: 4 } } }));
    let view = render(<ModuleAssessment />); await ready();
    await waitFor(() => expect(screen.getByRole("spinbutton", { name: "Numerical answer for Q17" })).toHaveValue(4));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument(); view.unmount();
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...newDraft(), phase: "submitted", attemptId: "forged" }));
    view = render(<ModuleAssessment />); await ready(); await waitFor(() => expect(screen.getByRole("progressbar")).toBeInTheDocument()); view.unmount();
    const future = JSON.stringify({ schemaVersion: "2.0.0", curriculumVersion: "future" }); localStorage.setItem(STORAGE_KEY, future);
    view = render(<GeometryLearning lesson="eigenvectors" />); await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("cannot be saved"));
    fireEvent.change(screen.getByRole("slider", { name: "Candidate vector coordinate 2" }), { target: { value: 1 } }); expect(localStorage.getItem(STORAGE_KEY)).toBe(future); view.unmount();
    localStorage.removeItem(STORAGE_KEY); vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<ModuleAssessment />); await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("cannot be saved"));
  });
});
