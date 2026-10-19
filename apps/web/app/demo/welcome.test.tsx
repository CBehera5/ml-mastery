// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NeuralNetworkXRay } from "./xray";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const skip = () => fireEvent.click(screen.getByRole("button", { name: "Skip introduction — open full lab" }));
const replay = () => fireEvent.click(screen.getByRole("button", { name: "Replay introduction without resetting the model" }));
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } });

describe("X-Ray welcome boundary", () => {
  it.each([[/More time/, /3 minutes shorter/], [/Less time/, /farther from what happened/], [/Not sure/, /without knowing any ML terminology/]])("explains %s without exposing controls first", (choice, message) => {
    render(<NeuralNetworkXRay />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("This delivery took 12 minutes");
    expect(screen.queryByRole("button", { name: /Run forward pass/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    const action = screen.getByRole("button", { name: "Compare my reasoning" });
    expect(action).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: choice }));
    action.focus(); fireEvent.click(action);
    expect(screen.getByRole("status")).toHaveTextContent(message);
    expect(screen.getByRole("button", { name: "See how 9 was calculated" })).toHaveFocus();
  });

  it("progressively explains the trusted reference without new writes or guide awards", () => {
    render(<NeuralNetworkXRay />);
    // Existing demo_started analytics on mount is intentionally preserved.
    const write = vi.spyOn(Storage.prototype, "setItem");
    const remove = vi.spyOn(Storage.prototype, "removeItem");
    const event = vi.spyOn(window, "dispatchEvent");
    fireEvent.click(screen.getByRole("radio", { name: "Not sure" }));
    fireEvent.click(screen.getByRole("button", { name: "Compare my reasoning" }));
    fireEvent.click(screen.getByRole("button", { name: "See how 9 was calculated" }));
    expect(screen.getByRole("status")).toHaveTextContent("2 items × 1 min/item = 2 minutes");
    expect(screen.getByRole("status")).not.toHaveTextContent("3 km ×");
    fireEvent.click(screen.getByRole("button", { name: "Add the distance contribution" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 km × 2 min/km = 6 minutes");
    expect(screen.getByRole("status")).not.toHaveTextContent("added once");
    fireEvent.click(screen.getByRole("button", { name: "Add the baseline" }));
    expect(screen.getByRole("status")).toHaveTextContent("2 + 6 + 1 = 9 minutes");
    expect(screen.getByRole("status")).toHaveTextContent("Matching one trip does not establish a reliable model");
    fireEvent.click(screen.getByRole("button", { name: "Open the full lab" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByText("0 of 5 complete")).toBeInTheDocument();
    replay(); skip();
    expect(write).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled(); expect(event).not.toHaveBeenCalled();
  });

  it("retains model, history, selection, confirmed guide action and draft across replay/skip", () => {
    render(<NeuralNetworkXRay />); skip();
    change("Weight w1", "2");
    fireEvent.click(screen.getByRole("button", { name: /Run forward pass/ }));
    fireEvent.click(screen.getByRole("button", { name: "Apply one update" }));
    const before = [screen.getByTestId("prediction").textContent, screen.getByTestId("loss").textContent, (screen.getByLabelText("Weight w1") as HTMLInputElement).value];
    const next = screen.getByRole("button", { name: "Next" }); expect(next).toBeEnabled();
    replay(); expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
    expect(screen.getByText(/reference example, not a replacement/)).toBeInTheDocument();
    skip();
    expect([screen.getByTestId("prediction").textContent, screen.getByTestId("loss").textContent, (screen.getByLabelText("Weight w1") as HTMLInputElement).value]).toEqual(before);
    expect(screen.getByRole("button", { name: /Step 1/ })).toHaveClass("selected");
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    change("Weight w1", "3"); replay(); skip();
    expect(screen.getByLabelText("Weight w1")).toHaveValue(3);
    expect(screen.getByText(/preview is synchronized/)).toBeInTheDocument();
  });

  it("preserves an invalid draft and warning rather than resetting it on replay", () => {
    render(<NeuralNetworkXRay />); skip(); change("Learning rate η", "0");
    expect(screen.getByRole("alert")).toBeInTheDocument();
    replay(); skip();
    expect(screen.getByLabelText("Learning rate η", { exact: false })).toHaveValue(0);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByTestId("prediction")).not.toBeInTheDocument();
  });
});
