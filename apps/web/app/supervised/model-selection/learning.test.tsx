// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ModelSelectionAssessment, ModelSelectionLesson, ModelSelectionOverview } from "./learning";
import { EXPERIMENTS, FORMS, PRACTICE } from "./catalog";
import { STORAGE_KEY, load } from "./model";
import { LESSONS } from "./teaching";

afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });

for (let lesson = 0; lesson < 6; lesson++) it(`teaches MS0${lesson + 1} objectives, worked reasoning and practical workflow`, async () => {
  render(<ModelSelectionLesson lesson={lesson}/>);
  await waitFor(() => expect(screen.getByRole("group", { name: "Objective reasoning and guided practice" })).toBeEnabled());
  for (let objective = 1; objective <= 4; objective++) expect(screen.getByRole("heading", { name: new RegExp(`^MS0${lesson + 1}.O${objective}:`) })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Mathematical idea" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Python application" })).toBeInTheDocument();
});

it("keeps practice completion isolated to its own scope and does not confer mastery", async () => {
  localStorage.setItem("ml-math-lab:supervised:mlp:full:v1", "earlier MLP evidence");
  render(<ModelSelectionOverview/>);
  expect(await screen.findByRole("heading", { name: "Model Selection & Comparison" })).toBeInTheDocument();
  expect(localStorage.getItem("ml-math-lab:supervised:mlp:full:v1")).toBe("earlier MLP evidence");
  expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();
});

it("requires a prediction and rationale before revealing a frozen comparison state", async () => {
  const first = EXPERIMENTS[0].configs[0].id, second = EXPERIMENTS[0].configs[1].id;
  const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
    const id = String(input).includes(encodeURIComponent(second)) ? second : first;
    return { ok: true, json: async () => ({ id: "MS-E1.v1", dataset: { fixtures: [{ fixtureId: "fictional", train: ["train-a"], validation: ["valid-a"] }] }, config: { id, kind: "fitted candidate", predictionQuestion: "What comparison evidence is valid?", predictionOptions: [{ id: "fair", label: "Accept this fair development comparison." }, { id: "reject", label: "Reject the state." }, { id: "frozen", label: "Freeze the choice." }], reasonOptions: [{ id: "mechanism", label: "The row IDs, metric and fitting boundary govern the score." }], correctPrediction: "fair", correctReason: "mechanism", explanation: "The candidate used the same development comparison conditions.", counterexample: "Different row IDs cannot be ranked fairly.", reference: { validation: { metrics: { mae: 4 } } } } }) };
  });
  vi.stubGlobal("fetch", mockFetch);
  render(<ModelSelectionLesson lesson={0}/>);
  await waitFor(() => expect(screen.getByText("What comparison evidence is valid?")).toBeInTheDocument());
  const select = screen.getByRole("combobox", { name: "MS-E1 configuration" });
  fireEvent.change(select, { target: { value: second } });
  await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent(second))));
  fireEvent.change(screen.getByRole("combobox", { name: "Predict comparison outcome" }), { target: { value: "fair" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Predict why this result is valid" }), { target: { value: "mechanism" } });
  const reveal = screen.getByRole("button", { name: "Reveal reference outcome" });
  expect(reveal).toBeEnabled(); fireEvent.click(reveal);
  expect(await screen.findByText(/Your prediction matches the reference classification/)).toBeInTheDocument();
  expect(screen.getByText(/Sealed final-test targets and sidecar outputs are not sent to the browser/)).toBeInTheDocument();
});

it("shows objective-specific practice feedback and keeps independent assessment locked", async () => {
  render(<ModelSelectionLesson lesson={0}/>);
  await waitFor(() => expect(screen.getByRole("group", { name: "Objective reasoning and guided practice" })).toBeEnabled());
  const family = PRACTICE[0][0], accepted = family.accepted[0][0];
  if (accepted.kind !== "choice") throw Error("Expected the authored finite-choice contract.");
  const option = family.atoms[0]; if (option.kind !== "choice") throw Error("Expected a choice atom.");
  const label = option.options.find(item => item.id === accepted.optionId)!.label;
  fireEvent.click(screen.getByLabelText(label));
  fireEvent.click(screen.getByRole("button", { name: "Check MS01.O1" }));
  await waitFor(() => expect(screen.getByText(/Correct for practice/)).toBeInTheDocument());
  expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();
  cleanup(); render(<ModelSelectionAssessment/>);
  expect(screen.getByRole("alert")).toHaveTextContent("mastery remains unavailable");
  expect(screen.getByRole("button", { name: "Review all 24 objective families" })).toBeDisabled();
  expect(FORMS.flat()).toHaveLength(72); expect(LESSONS).toHaveLength(6);
});
