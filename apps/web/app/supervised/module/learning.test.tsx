// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { EvaluationAssessment, EvaluationLesson, EvaluationOverview } from "./learning";
import { FORMS, MASTERY_AVAILABLE, PRACTICE } from "./catalog";
import { canonical } from "../../python/foundation/contracts";
import { emptyState, load, serialize, STORAGE_KEY } from "./model";
beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
async function open(lesson = 1) { render(<EvaluationLesson lesson={lesson}/>); await waitFor(() => expect(screen.getByRole("group", { name: "Objective understanding and guided practice" })).toBeEnabled()); }
it("teaches every objective with mathematics, worked examples, targeted practice and navigation", async () => {
  for (let lesson = 0; lesson < 6; lesson++) {
    await open(lesson);
    for (let objective = 1; objective <= 4; objective++) expect(screen.getByRole("heading", { name: new RegExp(`^EV0${lesson + 1}.O${objective}:`) })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mathematics and symbols" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Python application" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Evaluation navigation" })).toBeInTheDocument();
    cleanup();
  }
});
it("stores only full-EV practice and preserves prototype and prior module bytes", async () => {
  const keys = ["ml-math-lab:supervised:ev:prototype:v1", "ml-math-lab:python:sklearn:v1", "ml-math-lab:python:essentials:module:v1", "math-progress", "linear-regression-progress"];
  keys.forEach(key => localStorage.setItem(key, "earlier-evidence"));
  const writes = vi.spyOn(Storage.prototype, "setItem");
  await open();
  const region = within(screen.getByRole("region", { name: "Practice EV02.O3" }));
  fireEvent.change(region.getByRole("spinbutton"), { target: { value: "0.4" } });
  fireEvent.click(region.getByRole("button", { name: "Check EV02.O3" }));
  expect(region.getByRole("status")).toHaveTextContent("Correct.");
  expect(load(localStorage.getItem(STORAGE_KEY)).practice[6].proof).not.toBeNull();
  expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();
  keys.forEach(key => expect(localStorage.getItem(key)).toBe("earlier-evidence"));
  expect(writes.mock.calls.every(([key]) => key === STORAGE_KEY)).toBe(true);
});
it("requires prediction, handles wrong predictions, clears stale reveals and renders endpoint alternatives", async () => {
  await open(3);
  const config = screen.getByRole("combobox", { name: "Experiment configuration" });
  fireEvent.change(config, { target: { value: "EV-E2.endpoints.t0" } });
  expect(screen.getByRole("button", { name: "Reveal frozen outcome" })).toBeDisabled();
  fireEvent.change(screen.getByRole("combobox", { name: "Your prediction" }), { target: { value: "I expect valid information or better detection/error" } });
  fireEvent.click(screen.getByRole("button", { name: "Reveal frozen outcome" }));
  expect(screen.getAllByText("positive infinity").length).toBeGreaterThan(0);
  expect(screen.getByText(/Selected ROC point: false-positive rate/)).toBeInTheDocument();
  expect(screen.getByRole("table", { name: /Actual rows, predicted columns/ })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox", { name: "Supported explanation" }), { target: { value: "threshold-not-retraining" } });
  fireEvent.click(screen.getByRole("button", { name: "Check experiment explanation" }));
  expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();
  fireEvent.change(config, { target: { value: "EV-E2.no-positives.t1" } });
  expect(screen.queryByRole("combobox", { name: "Supported explanation" })).not.toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: "Your prediction" })).toHaveValue("");
  fireEvent.change(screen.getByRole("combobox", { name: "Your prediction" }), { target: { value: "I expect an undefined or divergent metric" } });
  fireEvent.click(screen.getByRole("button", { name: "Reveal frozen outcome" }));
  expect(screen.getAllByText("undefined").length).toBeGreaterThan(0);
  expect(screen.getByText(/no finite ROC point is drawn/)).toBeInTheDocument();
  expect(load(localStorage.getItem(STORAGE_KEY)).labs[1].credit).not.toBeNull();
});
it("warns and preserves corrupt storage while still allowing in-memory practice", async () => {
  localStorage.setItem(STORAGE_KEY, "foreign-record"); await open();
  expect(screen.getByRole("alert")).toHaveTextContent("in memory only");
  fireEvent.click(screen.getByRole("button", { name: "Check EV02.O1" }));
  expect(localStorage.getItem(STORAGE_KEY)).toBe("foreign-record");
});
it.runIf(MASTERY_AVAILABLE)("does not leak independent correctness, requires review and confirms a complete attempt", async () => {
  const state = emptyState(); state.draft.answers = FORMS[0].map(family => canonical(family.accepted[0]));
  localStorage.setItem(STORAGE_KEY, serialize(state)); render(<EvaluationAssessment/>);
  await waitFor(() => expect(screen.getByRole("group", { name: "Independent answers" })).toBeEnabled());
  expect(screen.queryByText(/^Correct\./)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Review all24 answers" }));
  expect(screen.getByRole("button", { name: "Submit confirmed attempt" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox", { name: /I reviewed the whole attempt/ }));
  fireEvent.click(screen.getByRole("button", { name: "Submit confirmed attempt" }));
  expect(screen.getByRole("heading", { name: "Mastery demonstrated: 24/24" })).toBeInTheDocument();
  expect(load(localStorage.getItem(STORAGE_KEY)).mastery?.score).toBe(24);
  fireEvent.click(screen.getByRole("button", { name: "Retry next independent form" }));
  expect(screen.getByRole("status")).toHaveTextContent("Form B");
  expect(load(localStorage.getItem(STORAGE_KEY)).draft.answers.every(raw => JSON.parse(raw).every((answer: { kind: string }) => answer.kind === "unanswered"))).toBe(true);
});
it("links every available lesson, the preserved prototype and one full notebook", () => {
  render(<EvaluationOverview/>);
  expect(screen.getByRole("link", { name: /original EV01 prototype content/i })).toHaveAttribute("href", "/supervised/evaluation/ev01");
  expect(screen.getByRole("link", { name: /Download the Evaluation/ })).toHaveAttribute("href", "/notebooks/supervised-evaluation.ipynb");
  expect(PRACTICE.flat()).toHaveLength(48);
});
