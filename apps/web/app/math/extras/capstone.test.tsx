// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TrainingStepPlayground } from "./capstone";
import { modelingScenario } from "../integration/content";

afterEach(cleanup);
const readout = (name: string) => screen.getAllByText(name).find((n) => n.tagName === "DT")!.nextElementSibling!.textContent;

describe("the Integration capstone numbers", () => {
  it("2 × 100 − 2 × 10 + 50 = 230; residual −20; loss 400; gradient [−80, −400], bias −40; one step → 234.2 and 249.64", () => {
    const s = modelingScenario(2, 10, 100, 50, 0.001), r = s.evaluation.rows[0];
    expect(r.prediction).toBe(230); expect(r.residual).toBe(-20); expect(r.residual ** 2).toBe(400);
    expect(s.update.gradient.weightGradients).toEqual([-80, -400]); expect(s.update.gradient.biasGradient).toBe(-40);
    expect(s.update.updatedParameters.weights[0]).toBeCloseTo(100.08, 9); expect(s.update.updatedParameters.weights[1]).toBeCloseTo(-1.6, 9); expect(s.update.updatedParameters.bias).toBeCloseTo(50.04, 9);
    expect(s.update.after.rows[0].prediction).toBeCloseTo(234.2, 9); expect(s.update.after.metrics.mse).toBeCloseTo(249.64, 9); expect(s.check.passed).toBe(true);
  });
});
describe("the capstone playground", () => {
  it("walks the five stages and reports the numbers", () => {
    const done = vi.fn(); render(<TrainingStepPlayground onDone={done} />);
    expect(readout("Prediction")).toBe("230"); expect(readout("Residual")).toBe("-20"); expect(readout("Loss")).toBe("400"); expect(readout("Loss after one step")).toBe("249.64");
    fireEvent.click(screen.getByRole("button", { name: "3 · Slope of the miss" })); expect(done).toHaveBeenCalled(); expect(document.body.textContent).toContain("area weight -80");
    fireEvent.click(screen.getByRole("button", { name: "5 · Check the result" })); expect(document.body.textContent).toContain("agrees");
    fireEvent.change(screen.getByLabelText(/Area weight/), { target: { value: "110" } }); expect(readout("Prediction")).toBe("250"); expect(readout("Loss")).toBe("0");
  });
});
