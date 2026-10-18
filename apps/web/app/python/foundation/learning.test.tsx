// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PythonP01 } from "./learning";
import { PRACTICE } from "./fixtures";
import { STORAGE_KEY } from "./progress";
beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
async function openLesson() {
  render(<PythonP01/>);
  await waitFor(() => expect(screen.getByRole("group", { name: "Interactive learning and saved practice" })).toBeEnabled());
}
function section(index: number) { return screen.getByRole("region", { name: index === 1 ? "P01.O2 — critical reasoning" : `P01.O${index + 1}` }); }
function answerPractice(index: number) {
  const region = section(index);
  const definition = PRACTICE[index][0];
  definition.atoms.forEach((atom, atomIndex) => {
    const answer = definition.accepted[0][atomIndex];
    if (atom.kind === "number" && answer.kind === "number") fireEvent.change(within(region).getByRole("spinbutton"), { target: { value: String(answer.value) } });
    if (atom.kind === "choice" && answer.kind === "choice") fireEvent.click(within(region).getByRole("radio", { name: atom.options.find(option => option.id === answer.optionId)!.label }));
    if (atom.kind === "slots" && answer.kind === "slots") atom.slots.forEach(slot => {
      fireEvent.change(within(region).getByRole("combobox", { name: slot.label }), { target: { value: answer.entries.find(entry => entry.slotId === slot.id)!.optionId } });
    });
  });
  fireEvent.click(within(region).getByRole("button", { name: `Check P01.O${index + 1}` }));
}
describe("P01 learner experience and isolation", () => {
  it("completes four practice families and meaningful experiment, restores without mastery", async () => {
    localStorage.setItem("ml-math-lab:evidence:math.statistics:v1", "preserve-mastery");
    localStorage.setItem("ml-math-lab:evidence:linear-regression:v1", "preserve-regression");
    await openLesson();
    for (let index = 0; index < 4; index++) answerPractice(index);
    expect(screen.queryByText(/^P01 lesson completed/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Experiment configuration" }), { target: { value: "text" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Predict the output" }), { target: { value: "'222'" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Explain the operation" }), { target: { value: "repeat" } });
    fireEvent.click(screen.getByRole("button", { name: "Check prediction and reveal trace" }));
    expect(screen.getByRole("status", { name: "Experiment result" })).toHaveFocus();
    expect(screen.getByText(/^P01 lesson completed/)).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.evidence.masteryEvidence).toEqual([]);
    expect(localStorage.getItem("ml-math-lab:evidence:math.statistics:v1")).toBe("preserve-mastery");
    expect(localStorage.getItem("ml-math-lab:evidence:linear-regression:v1")).toBe("preserve-regression");
    cleanup(); await openLesson();
    expect(screen.getByText(/^P01 lesson completed/)).toBeInTheDocument();
    expect(screen.getAllByText("Practice demonstrated; not independent mastery.", { exact: false })).toHaveLength(4);
  });
  it("preserves a partial repair draft on reload and counts no malformed attempt", async () => {
    await openLesson();
    const region = section(3);
    fireEvent.change(within(region).getByRole("combobox", { name: "Repair the numeric expression" }), { target: { value: "distributed" } });
    fireEvent.click(within(region).getByRole("button", { name: "Check P01.O4" }));
    expect(within(region).getByRole("status")).toHaveTextContent("Unsupported answer representation");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).practice[3].counts).toEqual([0, 0]);
    cleanup(); await openLesson();
    expect(within(section(3)).getByRole("combobox", { name: "Repair the numeric expression" })).toHaveValue("distributed");
  });
  it("does not count correct arithmetic with an incorrect critical explanation", async () => {
    await openLesson();
    const region = section(1);
    fireEvent.click(within(region).getByRole("radio", { name: "250 ($k), numeric prediction" }));
    fireEvent.click(within(region).getByRole("radio", { name: /A digit in quotes is already numeric/ }));
    fireEvent.click(within(region).getByRole("button", { name: "Check P01.O2" }));
    expect(within(region).getByRole("status")).toHaveTextContent("Not yet");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).practice[1].passed).toBe(false);
  });
  it("requires scoped reset consent and preserves unsupported saved versions", async () => {
    await openLesson();
    expect(screen.getByRole("button", { name: "Reset P01 lesson practice" })).toBeDisabled();
    cleanup();
    localStorage.setItem(STORAGE_KEY, '{"future":true}');
    await openLesson();
    expect(screen.getByRole("alert")).toHaveTextContent("Original data is preserved");
    answerPractice(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{"future":true}');
    expect(screen.getByRole("alert")).toHaveTextContent("not saved");
  });
  it("supports in-memory practice when reads or writes are denied", async () => {
    const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw Error("Denied"); });
    await openLesson(); answerPractice(0);
    expect(screen.getByRole("alert")).toHaveTextContent("not saved");
    read.mockRestore(); cleanup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw Error("Quota"); });
    await openLesson(); answerPractice(0);
    expect(screen.getByRole("alert")).toHaveTextContent("could not be saved");
    expect(within(section(0)).getByText(/Practice demonstrated/)).toBeInTheDocument();
  });
  it("restores exhausted practice, requires a correct counterexample and reopens a review cycle", async () => {
    await openLesson();
    let region = section(0);
    for (let attempt = 0; attempt < 2; attempt++) fireEvent.click(within(region).getByRole("button", { name: "Check P01.O1" }));
    fireEvent.click(within(region).getByRole("button", { name: "Use alternate P01.O1 practice" }));
    for (let attempt = 0; attempt < 2; attempt++) fireEvent.click(within(region).getByRole("button", { name: "Check P01.O1" }));
    fireEvent.click(within(region).getByRole("checkbox"));
    cleanup(); await openLesson(); region = section(0);
    expect(within(region).getByRole("checkbox")).toBeChecked();
    fireEvent.click(within(region).getByRole("button", { name: "Start new P01.O1 review cycle" }));
    expect(within(region).getByRole("button", { name: "Check P01.O1" })).toBeDisabled();
    fireEvent.change(within(region).getByRole("combobox"), { target: { value: "0" } });
    fireEvent.click(within(region).getByRole("button", { name: "Start new P01.O1 review cycle" }));
    expect(within(region).getByRole("button", { name: "Check P01.O1" })).toBeEnabled();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).practice[0].cycle).toBe(1);
  });
});
