// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NeuralNetworkXRay } from "./xray";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name, exact: true }));
const reach = () => {
  fireEvent.click(screen.getByRole("radio", { name: "More time", exact: true }));
  for (const name of ["Compare my reasoning", "See how 9 was calculated", "Add the distance contribution", "Add the baseline", "Try one weight change"]) click(name);
};
const choose = (name: string) => { fireEvent.click(within(screen.getByTestId("parameter-experiment")).getByRole("radio", { name, exact: true })); click("Check my prediction"); };

describe("isolated distance-weight experiment", () => {
  it.each([["Increase", "makes the estimate larger"], ["Decrease", "adds time rather than removing"], ["Not sure", "compare before with after"]])("responds to %s without revealing the result before Try", (choice, feedback) => {
    render(<NeuralNetworkXRay />); reach();
    expect(screen.getByRole("button", { name: "Check my prediction" })).toBeDisabled();
    expect(screen.queryByTestId("parameter-result")).not.toBeInTheDocument();
    choose(choice); expect(screen.getByTestId("parameter-announcement")).toHaveTextContent(feedback);
    expect(screen.queryByTestId("parameter-result")).not.toBeInTheDocument();
    click("Try 3 min/km");
    const result = screen.getByTestId("parameter-result");
    expect(result).toHaveTextContent("Before prediction9 minutesAfter trying 3 min/km12 minutes");
    expect(result).toHaveTextContent("Absolute error: 3 minutes before; 0 minutes after");
    expect(result).toHaveTextContent("extra 1 min/km adds 3 minutes");
    expect(result).toHaveTextContent("Matching one delivery does not establish model reliability");
    click("Try 3 min/km again"); expect(result).not.toHaveTextContent("Example restored:");
    const restore = screen.getByRole("button", { name: "Restore example to 2 min/km" }); restore.focus(); fireEvent.click(restore);
    expect(restore).toHaveFocus(); expect(result).toHaveTextContent("current prediction 9 minutes");
    expect(screen.getByTestId("parameter-announcement")).toHaveTextContent("Absolute error increased from 0 to 3 minutes");
    click("Try 3 min/km again"); expect(result).not.toHaveTextContent("Example restored:");
    click("Replay experiment"); expect(screen.queryByTestId("parameter-result")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Change the rule, not the trip" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Check my prediction" })).toBeDisabled();
  });

  it.each([false, true])("preserves live state and all write/event boundaries, invalid draft=%s", invalid => {
    render(<NeuralNetworkXRay />); click("Skip introduction — open full lab");
    fireEvent.change(screen.getByLabelText("Weight w1"), { target: { value: "2" } });
    click("Run forward pass"); click("Apply one update");
    if (invalid) fireEvent.change(screen.getByLabelText("Learning rate η", { exact: false }), { target: { value: "0" } });
    const snapshot = () => ({ controls: [...document.querySelectorAll('input:not([type=radio])')].map(n => (n as HTMLInputElement).value), prediction: screen.queryByTestId("prediction")?.textContent, loss: screen.queryByTestId("loss")?.textContent, guide: document.querySelector('.lesson-nav')?.textContent, history: document.querySelector('.history-list')?.textContent });
    const before = snapshot();
    const write = vi.spyOn(Storage.prototype, "setItem"), remove = vi.spyOn(Storage.prototype, "removeItem"), clear = vi.spyOn(Storage.prototype, "clear"), event = vi.spyOn(window, "dispatchEvent");
    click("Replay introduction without resetting the model"); reach(); choose("Increase");
    click("Try 3 min/km"); click("Restore example to 2 min/km"); click("Try 3 min/km again"); click("Replay experiment");
    expect(snapshot()).toEqual(before);
    click("Skip introduction — open full lab"); expect(snapshot()).toEqual(before);
    expect(write).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled(); expect(clear).not.toHaveBeenCalled(); expect(event).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    if (invalid) expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
