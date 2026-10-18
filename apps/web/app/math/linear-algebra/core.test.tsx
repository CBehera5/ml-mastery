// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { CoreLearning } from "./core-learning";
import { CoreAssessment } from "./assessment";
import { VectorsDotProductLesson } from "../vectors-dot-product/vectors-dot-product";
import { MatricesLesson } from "../matrices-multiplication/matrices-lesson";
import { CORE_BLUEPRINT, MODULE_ID, lessonTopics, questions, type Lesson } from "./content";
import { DRAFT_KEY, MASTERY_ID, STORAGE_KEY, assessmentQuestions, type Variant } from "./model";

beforeEach(() => localStorage.clear()); afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const ready = () => waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull());
function answerAssessment(variant: Variant, missCritical = false) {
  assessmentQuestions(variant).forEach((question, index) => {
    const group = screen.getByRole("group", { name: `Q${index + 1}. ${question.critical ? "Critical · " : ""}${question.exercise.prompt}` });
    if (question.exercise.kind === "numerical") fireEvent.change(within(group).getByRole("spinbutton"), { target: { value: missCritical && question.key === "vectors.norm" ? 999 : question.exercise.expected } });
    else fireEvent.click(within(group).getByRole("radio", { name: question.exercise.options.find(option => question.exercise.kind === "conceptual" && option.id === question.exercise.expectedOptionId)!.label }));
  });
}
function submit() {
  fireEvent.click(screen.getByRole("button", { name: "Review core responses" }));
  expect(screen.getByRole("heading", { name: "Review your core responses" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Submit core assessment" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox")); fireEvent.click(screen.getByRole("button", { name: "Submit core assessment" }));
}
describe("Linear Algebra core UI and persistence", () => {
  it("keeps copying separate from new understanding/mastery and resets only the original lesson", async () => {
    localStorage.setItem("ml-math-lab:lesson:matrices-multiplication:v1", "[true,false,false,false,false]");
    render(<VectorsDotProductLesson />); await ready();
    const stage = within(screen.getByRole("region", { name: "Existing five-stage house lab" }));
    fireEvent.click(screen.getByRole("button", { name: /NumPy/ }));
    fireEvent.click(stage.getByRole("button", { name: /Copy NumPy exercise/ }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem("ml-math-lab:lesson:vectors-dot-product:v1")!)[3]).toBe(true));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives).toEqual({});
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toEqual([]);
    fireEvent.click(stage.getByRole("button", { name: "Reset this lesson" }));
    expect(localStorage.getItem("ml-math-lab:lesson:matrices-multiplication:v1")).toBe("[true,false,false,false,false]");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives).toEqual({});
  });
  it("uses native editable table cells, retains baseline predictions and rejects overflow-scale edits", async () => {
    render(<MatricesLesson />); await ready();
    fireEvent.click(screen.getByRole("button", { name: /Explore/ }));
    const table = within(screen.getByRole("table", { name: "Editable house feature matrix" }));
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    expect(table.getAllByRole("columnheader")).toHaveLength(4);
    expect(table.getAllByRole("rowheader")).toHaveLength(3);
    expect(screen.getByTestId("matrix-predictions")).toHaveTextContent("[28, 39, 29]");
    const cell = table.getByRole("spinbutton", { name: "House B Bedrooms" });
    expect(cell.closest("td")).not.toBeNull();
    fireEvent.change(cell, { target: { value: "1e308" } });
    expect(screen.getByRole("alert")).toHaveTextContent("previous valid value is retained");
    expect(screen.getByTestId("matrix-predictions")).toHaveTextContent("[28, 39, 29]");
    fireEvent.change(cell, { target: { value: "3" } });
    expect(screen.getByTestId("matrix-predictions")).toHaveTextContent("[28, 41, 29]");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  it.each(["vectors", "matrices"] as Lesson[])("records %s completion only after both activities and eight checks", async lesson => {
    const legacy = "[true,true,true,true,true]";
    localStorage.setItem("ml-math-lab:lesson:vectors-dot-product:v1", legacy);
    localStorage.setItem("ml-math-lab:evidence:math.algebra:v1", "preserved algebra bytes");
    localStorage.setItem("ml-math-lab:evidence:linear-regression:v1", "preserved regression bytes");
    localStorage.setItem("ml-math-lab:topic:derivatives:v1", "preserved derivatives bytes");
    const view = render(<CoreLearning lesson={lesson} />); await ready();
    questions(0).filter(question => lessonTopics(lesson).includes(question.topic)).forEach(question => {
      const group = screen.getByRole("group", { name: question.exercise.prompt });
      if (question.exercise.kind === "numerical") fireEvent.change(within(group).getByRole("spinbutton"), { target: { value: question.exercise.expected } });
      else fireEvent.click(within(group).getByRole("radio", { name: question.exercise.options.find(option => question.exercise.kind === "conceptual" && option.id === question.exercise.expectedOptionId)!.label }));
      fireEvent.click(within(group).getByRole("button"));
    });
    expect(screen.queryByRole("heading", { name: "Core lesson outcome demonstrated" })).not.toBeInTheDocument();
    for (const topic of lessonTopics(lesson)) {
      const group = document.getElementById(`core-${topic}`)!;
      fireEvent.change(within(group).getAllByRole("slider")[0], { target: { value: 2 } });
    }
    expect(screen.getByRole("heading", { name: "Core lesson outcome demonstrated" })).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).lessons[`${MODULE_ID}.${lesson}`].state).toBe("completed"));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toEqual([]);
    view.unmount(); render(<CoreLearning lesson={lesson} />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Core lesson outcome demonstrated" })).toBeInTheDocument());
    expect(localStorage.getItem("ml-math-lab:lesson:vectors-dot-product:v1")).toBe(legacy);
    expect(localStorage.getItem("ml-math-lab:evidence:math.algebra:v1")).toBe("preserved algebra bytes");
    expect(localStorage.getItem("ml-math-lab:evidence:linear-regression:v1")).toBe("preserved regression bytes");
    expect(localStorage.getItem("ml-math-lab:topic:derivatives:v1")).toBe("preserved derivatives bytes");
  });
  it("explains zero geometry, incompatible products and incorrect reasoning", async () => {
    const view = render(<CoreLearning lesson="vectors" />); await ready();
    const dot = within(document.getElementById("core-dot")!);
    fireEvent.change(dot.getByRole("slider", { name: "v component 1" }), { target: { value: 0 } });
    expect(dot.getByRole("status")).toHaveTextContent("Projection onto zero v is undefined");
    fireEvent.change(screen.getByRole("spinbutton", { name: /Calculate vector magnitude/ }), { target: { value: 7 } });
    fireEvent.click(screen.getByRole("button", { name: "Check: Calculate vector magnitude." }));
    expect(screen.getByText(/Reconsider: Use √/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[`${MODULE_ID}.vectors.norm`]).toBeUndefined();
    view.unmount(); render(<CoreLearning lesson="matrices" />); await ready();
    fireEvent.change(screen.getByRole("combobox", { name: "Right matrix shape" }), { target: { value: "incompatible" } });
    expect(screen.getByText(/No result: incompatible shapes/)).toBeInTheDocument();
  });
  it("restores a critical failure, retries changed questions and persists mastery without deleting history", async () => {
    let view = render(<CoreAssessment />); await ready();
    answerAssessment("v01", true); expect(screen.queryByText(/Worked result:/)).not.toBeInTheDocument(); submit();
    expect(screen.getByRole("status")).toHaveTextContent("15/16");
    expect(screen.getByRole("status")).toHaveTextContent("no new mastery");
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toEqual([]));
    view.unmount(); view = render(<CoreAssessment />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Review before another core attempt" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Start alternate core variant" }));
    expect(screen.getByText(/Current variant: v02/)).toBeInTheDocument(); expect(screen.getByRole("progressbar")).toHaveAttribute("value", "0");
    answerAssessment("v02"); submit();
    expect(screen.getByRole("heading", { name: "Linear Algebra core mastery criteria met" })).toHaveFocus();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[MASTERY_ID].mastered).toBe(true));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).assessmentAttempts).toHaveLength(2);
    view.unmount(); render(<CoreAssessment />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Linear Algebra core mastery criteria met" })).toBeInTheDocument());
  });
  it("restores partial drafts, resets review consent, rejects forged results and reports save failure", async () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, variant: "v01", phase: "review", responses: { "vectors.norm": { kind: "numerical", value: 10 } } }));
    let view = render(<CoreAssessment />); await ready();
    await waitFor(() => expect(screen.getByRole("spinbutton", { name: "Numerical answer for Q1" })).toHaveValue(10));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    view.unmount(); localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, variant: "v01", phase: "submitted", responses: {}, attemptId: "forged" }));
    view = render(<CoreAssessment />); await ready(); await waitFor(() => expect(screen.getByRole("progressbar")).toBeInTheDocument());
    view.unmount(); vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<CoreAssessment />); await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("cannot be saved"));
    expect(CORE_BLUEPRINT.minimumPercent).toBe(80);
  });
  it("preserves unreadable and future evidence bytes instead of relabeling or overwriting them", async () => {
    for (const raw of ["broken", JSON.stringify({ schemaVersion: "2.0.0", curriculumVersion: "future" }), JSON.stringify({ schemaVersion: "1.0.0", curriculumVersion: "linear-algebra.geometry.v2", lessons: {}, objectives: {}, assessmentAttempts: [], masteryEvidence: [], projectMilestones: [] })]) {
      localStorage.setItem(STORAGE_KEY, raw);
      const view = render(<CoreLearning lesson="vectors" />);
      await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("cannot be saved"));
      fireEvent.change(screen.getAllByRole("slider")[0], { target: { value: 4 } });
      expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
      view.unmount();
    }
  });
});
