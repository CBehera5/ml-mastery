// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MlpAssessment, MlpLesson, MlpOverview } from "./learning";
import { LESSONS } from "./teaching";
import { EXPERIMENTS, FORMS } from "./catalog";
import { STORAGE_KEY, load } from "./model";

afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });

for (let lesson = 0; lesson < 5; lesson++) it(`teaches NN0${lesson + 1} objectives and practical examples`, async () => {
  render(<MlpLesson lesson={lesson}/>);
  await waitFor(() => expect(screen.getByRole("group", { name: "Objective understanding and guided practice" })).toBeEnabled());
  for (let objective = 1; objective <= 4; objective++) expect(screen.getByRole("heading", { name: new RegExp(`^NN0${lesson + 1}.O${objective}:`) })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Mathematics and symbols" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Python application" })).toBeInTheDocument();
});

it("keeps practice and lesson completion separate from mastery and preserves other scope records", async () => {
  localStorage.setItem("ml-math-lab:supervised:svm:full:v1", "earlier SVM evidence");
  render(<MlpOverview/>);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Independent MLP mastery not yet earned"));
  expect(localStorage.getItem("ml-math-lab:supervised:svm:full:v1")).toBe("earlier SVM evidence");
  expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();
});

it("requires prediction and a reason before revealing a frozen experiment state", async () => {
  const mockFetch = vi.fn(async () => ({ ok: true, json: async () => ({ id: "NN-E1.v1", dataset: { id: "fictional", training: { ids: ["train-1"] } }, config: { id: EXPERIMENTS[0].configs[0].id, kind: "manual-forward", prediction_question: "Predict the probability and class.", prediction_options: [{ id: "forward", label: "p=.5,class=0" }, { id: "wrong", label: "A weight update occurs" }], reason_options: [{ id: "mechanism", label: "The forward pass uses fixed parameters" }, { id: "boundary", label: "The test set chooses the checkpoint" }], correct_prediction_id: "forward", correct_reason_id: "mechanism", explanation: "The activation changes the signal.", counterexample: "Identity layers collapse.", parameters: { W1: [[1]], b1: [-1] }, forward: { probability: .5 } } }) }));
  vi.stubGlobal("fetch", mockFetch);
  render(<MlpLesson lesson={0}/>);
  await waitFor(() => expect(screen.getByText("Predict the probability and class.")).toBeInTheDocument());
  expect(screen.getByRole("button", { name: "Reveal reference outcome" })).toBeDisabled();
  fireEvent.change(screen.getByRole("combobox", { name: "Predict before reveal" }), { target: { value: "forward" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Predict why" }), { target: { value: "mechanism" } });
  expect(screen.getByRole("button", { name: "Reveal reference outcome" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Reveal reference outcome" }));
  expect(await screen.findByText(/Prediction matched the reference/)).toBeInTheDocument();
  expect(screen.getByText(/Test observations are deliberately absent/)).toBeInTheDocument();
  expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("nn-e1.manual.h1.identity.base.v1"));
});

it("exposes the exact assessment size and thresholds without awarding mastery from overview", async () => {
  expect(FORMS.flat()).toHaveLength(60);
  render(<MlpOverview/>);
  expect(await screen.findByRole("heading", { name: "Introductory Multilayer Perceptrons" })).toBeInTheDocument();
  cleanup(); render(<MlpAssessment/>);
  expect(screen.getByText(/20 objective families\. Pass requires16\/20/)).toBeInTheDocument();
  expect(LESSONS).toHaveLength(5);
});
