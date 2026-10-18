// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PreparationAssessment, PreparationLesson, PreparationOverview } from "./learning";
import { INDEPENDENT_FORMS, PRACTICE_FORMS, ACTIVITIES } from "./catalog";
import { emptyState, serialize, STORAGE_KEY, type State } from "./model";
import type { Family } from "../foundation/contracts";
vi.mock("./catalog", async original => ({ ...await original<typeof import("./catalog")>(), MASTERY_AVAILABLE: true }));
beforeEach(() => { localStorage.clear(); vi.stubGlobal("crypto", webcrypto); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("resets only Preparation and preserves Essentials, P01, Math and Regression bytes", async () => {
  const keys = ["ml-math-lab:python:visualization:v1", "ml-math-lab:python:pandas:v1", "ml-math-lab:python:numpy:v1", "ml-math-lab:python:essentials:v2", "ml-math-lab:python:essentials:v1", "math-preserved", "regression-preserved"];
  keys.forEach(key => localStorage.setItem(key, "preserved mastery"));
  render(<PreparationOverview/>);
  await waitFor(() => expect(screen.getByRole("button", { name: "Reset Preparation only" })).toBeDisabled());
  fireEvent.click(screen.getByRole("checkbox", { name: /Confirm removing this Preparation module/ }));
  fireEvent.click(screen.getByRole("button", { name: "Reset Preparation only" }));
  keys.forEach(key => expect(localStorage.getItem(key)).toBe("preserved mastery"));
});
function answer(region: HTMLElement, definition: Family) {
  definition.atoms.forEach((atom, position) => {
    const value = definition.accepted[0][position];
    if (atom.kind === "choice" && value.kind === "choice") fireEvent.click(within(region).getByRole("radio", { name: atom.options.find(option => option.id === value.optionId)!.label }));
    if (atom.kind === "number" && value.kind === "number") fireEvent.change(within(region).getByRole("spinbutton"), { target: { value: String(value.value) } });
    if (atom.kind === "slots" && value.kind === "slots") atom.slots.forEach(slot => fireEvent.change(within(region).getByRole("combobox", { name: slot.label }), { target: { value: value.entries.find(entry => entry.slotId === slot.id)!.optionId } }));
  });
}
it("teaches all six lessons and completes practice/activity without mastery, restoring evidence", async () => {
  for (let lesson = 0; lesson < 6; lesson++) {
    render(<PreparationLesson lesson={lesson}/>);
    await waitFor(() => expect(screen.getByRole("group", { name: "Preparation teaching and guided practice" })).toBeEnabled());
    expect(screen.getByRole("heading", { name: "Why this exists" })).toBeInTheDocument();
    for (let offset = 0; offset < 4; offset++) {
      const definition = PRACTICE_FORMS[0][lesson * 4 + offset];
      const region = screen.getByRole("region", { name: `Practice ${definition.objective}` });
      answer(region, definition);
      fireEvent.click(within(region).getByRole("button", { name: `Check ${definition.objective}` }));
    }
    const config = ACTIVITIES[lesson][1];
    fireEvent.change(screen.getByRole("combobox", { name: "Experiment configuration" }), { target: { value: config.id } });
    fireEvent.change(screen.getByRole("combobox", { name: "Predict normalized outcome" }), { target: { value: config.output } });
    fireEvent.change(screen.getByRole("combobox", { name: "Explain this trace" }), { target: { value: config.reasonId } });
    fireEvent.click(screen.getByRole("button", { name: "Check and reveal trace" }));
    expect(screen.getByRole("status", { name: "Experiment result" })).toHaveFocus();
    expect(screen.getByText("Lesson completed. Independent module mastery is separate.")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).evidence.masteryEvidence).toEqual([]);
    cleanup();
    render(<PreparationLesson lesson={lesson}/>);
    await screen.findByText("Lesson completed. Independent module mastery is separate.");
    cleanup();
  }
});
it("requires explicit full-attempt confirmation, fails a critical gate at 23, then passes independent retry and restores", async () => {
  const state = emptyState();
  state.draft.answers = INDEPENDENT_FORMS[0].map(definition => structuredClone([...definition.accepted[0]]));
  state.draft.answers[0][1] = { kind: "unanswered" };
  localStorage.setItem(STORAGE_KEY, serialize(state));
  render(<PreparationAssessment/>);
  await waitFor(() => expect(screen.getByRole("button", { name: "Review all 24 answers" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Review all 24 answers" }));
  expect(screen.getByRole("heading", { name: "Review before submitting" })).toHaveFocus();
  expect(screen.queryByText(/optionId/)).not.toBeInTheDocument();
  expect(screen.getByText(/T01.O1:/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit confirmed attempt" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox", { name: /I reviewed the full attempt/ }));
  fireEvent.click(screen.getByRole("button", { name: "Submit confirmed attempt" }));
  expect(screen.getByRole("heading", { name: "Not yet mastered: 23/24" })).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Retry next independent form" }));
  INDEPENDENT_FORMS[1].forEach(definition => answer(screen.getByRole("region", { name: definition.objective }), definition));
  fireEvent.click(screen.getByRole("button", { name: "Review all 24 answers" }));
  fireEvent.click(screen.getByRole("checkbox", { name: /I reviewed the full attempt/ }));
  fireEvent.click(screen.getByRole("button", { name: "Submit confirmed attempt" }));
  expect(screen.getByRole("heading", { name: "Mastery demonstrated: 24/24" })).toHaveFocus();
  cleanup(); render(<PreparationAssessment/>);
  await screen.findByRole("heading", { name: "Mastery demonstrated: 24/24" });
  expect((JSON.parse(localStorage.getItem(STORAGE_KEY)!) as State).history).toHaveLength(2);
});
