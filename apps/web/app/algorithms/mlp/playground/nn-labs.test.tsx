// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CapacityNnPlayground, DescentPlayground, NeuronPlayground, SafePlayground, WorthPlayground } from "./nn-labs";
import { descend, forward, gradOf, initWeights, lossOf, nParams, preferSimple, sgdStep, shapes } from "./nn-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Neural Networks lessons", () => {
  it("x = 2, w = 1, b = −1: z = 1, ReLU 1, logit 2, sigmoid(2) ≈ 0.8808; shapes for 4 rows, 2 features, 1 hidden neuron", () => {
    const f = forward(2, 1, -1, 2, 0, "relu"); expect(f.z).toBe(1); expect(f.h).toBe(1); expect(f.logit).toBe(2); expect(f.p).toBeCloseTo(0.8808, 4);
    expect(shapes(4, 2, 1)).toEqual({ X: [4, 2], W1: [2, 1], b1: [1], W2: [1, 1], b2: [1] });
  });
  it("w = 1, gradient 0.2, lr 0.1 gives 0.98; a small rate converges to 2 while a large one blows up", () => {
    expect(sgdStep(1, 0.2, 0.1)).toBeCloseTo(0.98, 12); expect(gradOf(0)).toBeCloseTo(-56 / 3, 12); expect(descend(0.05, 40)[40]).toBeCloseTo(2, 1); expect(lossOf(descend(0.3, 8)[8])).toBeGreaterThan(lossOf(descend(0.3, 1)[1]));
  });
  it("2 → 2 → 1 has 9 parameters and 2 → 4 → 1 has 17", () => { expect(nParams(2, 2)).toBe(9); expect(nParams(2, 4)).toBe(17); });
  it("the same seed gives the same starting weights; a different seed does not", () => { expect(initWeights(7, 4)).toEqual(initWeights(7, 4)); expect(initWeights(7, 4)).not.toEqual(initWeights(8, 4)); });
  it("equal log loss keeps the simpler model", () => { expect(preferSimple(0.42, 0.42, 0.02)).toBe("simple"); expect(preferSimple(0.42, 0.3, 0.02)).toBe("complex"); });
});

describe("the playgrounds", () => {
  it("neuron: the defaults give a hidden value of 1 and a chance of 88.1%", () => { render(<NeuronPlayground />); expect(readout("Hidden value")).toBe("1"); expect(readout("Chance")).toBe("88.1%"); });
  it("neuron: switching the bend off changes nothing at a positive z but the shapes are shown", () => { render(<NeuronPlayground />); fireEvent.click(screen.getByRole("button", { name: "No bend (linear)" })); expect(readout(/^Shapes for 4 rows/)).toMatch(/X 4×2/); });
  it("descent: the default learning rate is stable and one step from 1 with gradient 0.2 is 0.98", () => { render(<DescentPlayground />); expect(readout("One step: new weight")).toBe("0.98"); expect(readout("Learning rate stable?")).toMatch(/^yes/); });
  it("descent: a large learning rate is flagged", () => { render(<DescentPlayground />); fireEvent.change(screen.getByLabelText(/^Learning rate: /), { target: { value: "0.4" } }); expect(readout("Learning rate stable?")).toMatch(/^no/); });
  it("capacity: 2 hidden units give 9 numbers", () => { render(<CapacityNnPlayground />); expect(readout("Weights and biases")).toBe("2×2 + 2 + 2×1 + 1 = 9"); });
  it("safe: fitting the scaler on all rows moves the centre to 34 and is flagged", () => { render(<SafePlayground />); expect(readout("Scaler centre")).toBe("1"); fireEvent.click(screen.getByRole("button", { name: "Fit scaler on all rows" })); expect(readout("Scaler centre")).toBe("34"); expect(readout("Allowed?")).toMatch(/^no/); });
  it("worth: a tied log loss keeps the simpler model", () => { render(<WorthPlayground />); expect(readout("Choice by this rule")).toBe("the simpler model"); });
});
