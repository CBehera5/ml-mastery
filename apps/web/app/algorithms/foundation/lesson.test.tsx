// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { EV01Lesson } from "./lesson";
import Overview from "../page";
import { PRACTICE } from "./contracts";
import { decode, STORAGE_KEY } from "./progress";

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
async function open() { render(<EV01Lesson />); await waitFor(() => expect(screen.getByRole("group", { name: "EV01 interactive work and local practice" })).toBeEnabled()); }
function answer(index: number) {
  const region = within(screen.getByRole("region", { name: `EV01.O${index + 1}` }));
  const family = PRACTICE[index * 2];
  family.atoms.forEach((atom, atomIndex) => {
    const accepted = family.accepted[0][atomIndex];
    if (atom.kind === "choice" && accepted.kind === "choice") fireEvent.click(region.getByRole("radio", { name: atom.options.find(item => item.id === accepted.optionId)!.label }));
    if (atom.kind === "slots" && accepted.kind === "slots") atom.slots.forEach(slot => fireEvent.change(region.getByRole("combobox", { name: slot.label }), { target: { value: accepted.entries.find(item => item.slotId === slot.id)!.optionId } }));
  });
  fireEvent.click(region.getByRole("button", { name: `Check EV01.O${index + 1}` }));
}
it("completes lesson without mastery, preserves earlier subjects and restores safely", async () => {
  const keys = ["ml-math-lab:evidence:math.statistics:v1", "ml-math-lab:evidence:linear-regression:v1", "ml-math-lab:python:essentials:v2", "ml-math-lab:python:numpy:v1", "ml-math-lab:python:pandas:v1", "ml-math-lab:python:visualization:v1", "ml-math-lab:python:preparation:v1", "ml-math-lab:python:sklearn:v1"];
  keys.forEach(key => localStorage.setItem(key, "unchanged-earlier-evidence"));
  const writes = vi.spyOn(Storage.prototype, "setItem");
  await open();
  for (let index = 0; index < 4; index++) answer(index);
  expect(screen.queryByText(/^EV01 lesson completed/)).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox", { name: "Candidate feature" }), { target: { value: "future" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Predict combined validity" }), { target: { value: "valid" } });
  fireEvent.click(screen.getByRole("button", { name: "Reveal boundary analysis" }));
  expect(screen.getByRole("region", { name: "Boundary result" })).toHaveTextContent("Actual combined validity: invalid");
  fireEvent.change(screen.getByRole("combobox", { name: "Explain the observed boundary" }), { target: { value: "feature-future" } });
  expect(screen.getByText(/^EV01 lesson completed/)).toBeInTheDocument();
  keys.forEach(key => expect(localStorage.getItem(key)).toBe("unchanged-earlier-evidence"));
  expect(writes.mock.calls.every(([key]) => key === STORAGE_KEY)).toBe(true);
  expect(decode(localStorage.getItem(STORAGE_KEY))).not.toHaveProperty("mastery");
  cleanup(); await open();
  expect(screen.getByText(/^EV01 lesson completed/)).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /EV mastery|Evaluation assessment/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("checkbox", { name: /Confirm resetting only EV01/ }));
  fireEvent.click(screen.getByRole("button", { name: "Reset EV01 lesson progress" }));
  expect(screen.getByText(/^EV01 practice in progress/)).toBeInTheDocument();
  keys.forEach(key => expect(localStorage.getItem(key)).toBe("unchanged-earlier-evidence"));
});
it("requires prediction, clears stale result after controls change and provides exact text alternatives", async () => {
  await open();
  fireEvent.click(screen.getByRole("button", { name: "Reveal boundary analysis" }));
  expect(screen.getByText("Choose a prediction before revealing.")).toBeInTheDocument();
  expect(screen.queryByRole("combobox", { name: "Explain the observed boundary" })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox", { name: "Split plan" }), { target: { value: "overlap" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Predict combined validity" }), { target: { value: "invalid" } });
  fireEvent.click(screen.getByRole("button", { name: "Reveal boundary analysis" }));
  expect(screen.getByRole("region", { name: "Boundary result" })).toHaveTextContent("Overlapping row IDs: r4");
  expect(screen.getByRole("combobox", { name: "Predict combined validity" })).toBeDisabled();
  fireEvent.change(screen.getByRole("combobox", { name: "Candidate feature" }), { target: { value: "future" } });
  expect(screen.queryByText("Boundary violation found")).not.toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: "Predict combined validity" })).toHaveValue("");
  expect(screen.getByRole("list", { name: "Prediction timeline" })).toBeInTheDocument();
});
it("preserves a foreign/corrupt record and warns rather than silently overwriting", async () => {
  localStorage.setItem(STORAGE_KEY, "unsupported-original");
  await open(); answer(0);
  expect(screen.getByRole("alert")).toHaveTextContent("memory only");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("unsupported-original");
});
it("presents current algorithm paths and preserves the separate original EV01 prototype", () => {
  render(<Overview />);
  expect(screen.getByRole("link", { name: "Start Linear Regression →" })).toHaveAttribute("href", "/algorithms/linear-regression/why");
  expect(screen.getByRole("link", { name: "Open Logistic Regression" })).toHaveAttribute("href", "/algorithms/logistic");
  expect(screen.getByRole("link", { name: "Open K-Nearest Neighbors" })).toHaveAttribute("href", "/algorithms/knn");
  fireEvent.click(screen.getByText("Earlier evaluation practice and records"));
  expect(screen.getByRole("link", { name: "original EV01 prototype" })).toHaveAttribute("href", "/algorithms/evaluation/ev01");
  expect(screen.queryByRole("link", { name: /EV mastery/ })).not.toBeInTheDocument();
});
it("keeps focus on objective feedback when the checked variant becomes exhausted", async () => {
  await open();
  answer(1);
  const region = within(screen.getByRole("region", { name: "EV01.O2" }));
  fireEvent.click(region.getByRole("button", { name: "Check EV01.O2" }));
  expect(region.getByRole("button", { name: "Check EV01.O2" })).toBeDisabled();
  await waitFor(() => expect(region.getByRole("status", { name: "EV01.O2 feedback" })).toHaveFocus());
  expect(region.getByRole("status", { name: "EV01.O2 feedback" })).toHaveTextContent("Correct.");
});
it("keeps keyboard context through alternate practice and remediation recovery", async () => {
  await open();
  const region = within(screen.getByRole("region", { name: "EV01.O2" }));
  for (let variant = 0; variant < 2; variant++) {
    fireEvent.click(region.getByRole("radio", { name: "Available at prediction time" }));
    fireEvent.click(region.getByRole("radio", { name: "Any strongly correlated feature is permitted, including future information." }));
    fireEvent.click(region.getByRole("button", { name: "Check EV01.O2" }));
    fireEvent.click(region.getByRole("button", { name: "Check EV01.O2" }));
    await waitFor(() => expect(region.getByRole("status", { name: "EV01.O2 feedback" })).toHaveFocus());
    if (variant === 0) {
      fireEvent.click(region.getByRole("button", { name: "Alternate EV01.O2 practice" }));
      await waitFor(() => expect(region.getByRole("heading", { name: "EV01.O2 — critical decision AND reason" })).toHaveFocus());
    }
  }
  fireEvent.click(region.getByRole("checkbox", { name: "I reviewed this contrast." }));
  fireEvent.change(region.getByRole("combobox"), { target: { value: "time" } });
  fireEvent.click(region.getByRole("button", { name: "Open new EV01.O2 review cycle" }));
  await waitFor(() => expect(region.getByRole("heading", { name: "EV01.O2 — critical decision AND reason" })).toHaveFocus());
  expect(region.getByRole("button", { name: "Check EV01.O2" })).toBeEnabled();
});
it("returns focus to the lesson status after a confirmed scoped reset", async () => {
  await open();
  answer(0);
  fireEvent.click(screen.getByRole("checkbox", { name: /Confirm resetting only EV01/ }));
  fireEvent.click(screen.getByRole("button", { name: "Reset EV01 lesson progress" }));
  await waitFor(() => expect(screen.getByRole("status", { name: "EV01 lesson status" })).toHaveFocus());
  expect(screen.getByRole("status", { name: "EV01 lesson status" })).toHaveTextContent("Module mastery is unavailable");
  expect(within(screen.getByRole("region", { name: "EV01.O1" })).getByRole("status", { name: "EV01.O1 feedback" })).toBeEmptyDOMElement();
});
