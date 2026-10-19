// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fixture from "../../../../packages/math-contracts/fixtures/linear-neuron.v1.json";
import { linearNeuronTrace, type LinearNeuronInput } from "../../../../packages/math-runtime/src";
import { NeuralNetworkXRay } from "./xray";

const change = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
afterEach(cleanup);

function renderLab() {
  render(<NeuralNetworkXRay />);
  fireEvent.click(screen.getByRole("button", { name: "Skip introduction — open full lab" }));
}

describe("Neural Network X-Ray", () => {
  it("renders the reference scenario", () => {
    renderLab();
    expect(screen.getByTestId("prediction")).toHaveTextContent("9");
    expect(screen.getByTestId("loss")).toHaveTextContent("9");
    expect(screen.getByLabelText("Input x1")).toHaveValue(2);
    expect(screen.getByLabelText("Weight w2")).toHaveValue(2);
  });

  it("edits a weight and recalculates prediction and loss", () => {
    renderLab();
    change("Weight w1", "2");
    expect(screen.getByText(/Values changed/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Run forward pass/ }));
    expect(screen.getByTestId("prediction")).toHaveTextContent("11");
    expect(screen.getByTestId("loss")).toHaveTextContent("1");
  });

  it("applies one gradient update", () => {
    renderLab();
    fireEvent.click(screen.getByRole("button", { name: "Apply one update" }));
    expect(screen.getByLabelText("Weight w1")).toHaveValue(1.12);
    expect(screen.getByLabelText("Weight w2")).toHaveValue(2.18);
    expect(screen.getByTestId("prediction")).toHaveTextContent("9.84");
    expect(screen.getByTestId("loss")).toHaveTextContent("4.6656");
    expect(screen.getByRole("tabpanel", { name: "Parameter update calculations" })).toHaveTextContent("1.12");
  });

  it("resets parameters and history", () => {
    renderLab();
    fireEvent.click(screen.getByRole("button", { name: "Apply one update" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByLabelText("Weight w1")).toHaveValue(1);
    expect(screen.getByTestId("prediction")).toHaveTextContent("9");
    expect(screen.getByText("No updates recorded yet.")).toBeInTheDocument();
  });

  it("trains for multiple steps and records before/after loss", () => {
    renderLab();
    change("Training steps (max 100)", "3");
    fireEvent.click(screen.getByRole("button", { name: "Train model" }));
    expect(screen.getByText("Step 3")).toBeInTheDocument();
    expect(within(screen.getByLabelText("Loss before and after each update")).getAllByText(/→/)).toHaveLength(3);
    expect(screen.getByTestId("loss")).not.toHaveTextContent(/^9$/);
  });

  it("displays forward and backward calculation-trace values", () => {
    renderLab();
    const forward = screen.getByRole("tabpanel", { name: "Forward pass calculations" });
    expect(within(forward).getByText("L = 9")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Backward pass" }));
    const backward = screen.getByRole("tabpanel", { name: "Backward pass calculations" });
    expect(backward).toHaveTextContent("∂L/∂w1 = -12");
    expect(backward).toHaveTextContent("∂L/∂b = -6");
  });

  it("handles invalid input without replacing the current trace", () => {
    renderLab();
    change(/Learning rate η/, "0");
    fireEvent.click(screen.getByRole("button", { name: /Run forward pass/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("greater than 0");
    expect(screen.queryByTestId("prediction")).not.toBeInTheDocument();
  });

  it("warns when training diverges", () => {
    renderLab();
    change(/Learning rate η/, "1");
    change("Training steps (max 100)", "2");
    fireEvent.click(screen.getByRole("button", { name: "Train model" }));
    expect(screen.getByText(/Training diverged/)).toBeInTheDocument();
    expect(screen.getByText("Step 1").closest(".history-row")).toHaveClass("increase");
  });

  it("retains mathematical parity with every Python fixture", () => {
    for (const testCase of fixture.cases) {
      const actual = linearNeuronTrace(testCase.input as LinearNeuronInput);
      expect(actual.forward.prediction).toBeCloseTo(testCase.trace.forward.prediction, 9);
      expect(actual.forward.loss).toBeCloseTo(testCase.trace.forward.loss, 9);
      expect(actual.backward.weightGradients).toEqual(testCase.trace.backward.weightGradients);
      expect(actual.update.loss).toBeCloseTo(testCase.trace.update.loss, 9);
    }
  });

  it("unlocks lesson navigation only after the required learner action", () => {
    renderLab();
    const next = screen.getByRole("button", { name: "Next" });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Run forward pass/ }));
    expect(screen.getByText("Step complete")).toBeInTheDocument();
    expect(next).toBeEnabled();
    fireEvent.click(next);
    expect(screen.getByRole("heading", { name: "Weights control influence" })).toBeInTheDocument();
    expect(next).toBeDisabled();
    change("Weight w1", "1.5");
    fireEvent.click(screen.getByRole("button", { name: /Run forward pass/ }));
    expect(next).toBeEnabled();
  });

  it("shows gradient direction when a connection is selected in backward mode", () => {
    renderLab();
    fireEvent.click(screen.getByRole("tab", { name: /Backward gradients/ }));
    fireEvent.click(screen.getByRole("button", { name: /Select connection 1/ }));
    expect(screen.getByText(/Gradient -12/)).toBeInTheDocument();
    expect(screen.getByText(/move weight up/)).toBeInTheDocument();
  });

  it("keeps valid edits reactive and hides the trace for an invalid draft", () => {
    renderLab();
    change("Input x1", "3");
    expect(screen.getByTestId("prediction")).toHaveTextContent("10");
    expect(screen.getByText(/preview is synchronized/)).toBeInTheDocument();
    change(/Learning rate η/, "");
    expect(screen.getByText(/last valid calculation is hidden/i)).toBeInTheDocument();
    expect(screen.queryByTestId("prediction")).not.toBeInTheDocument();
  });

  it("highlights and explains the selected training-history step", () => {
    renderLab();
    fireEvent.click(screen.getByRole("button", { name: "Apply one update" }));
    const row = screen.getByRole("button", { name: /Step 1/ });
    expect(row).toHaveClass("selected");
    expect(screen.getByText(/Loss decreased/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear history" }));
    expect(screen.getByText("No updates recorded yet.")).toBeInTheDocument();
  });
});
