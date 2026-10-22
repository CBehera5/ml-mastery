// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GradientCheckPlayground, RulesPlayground, SecantsPlayground, StepSizePlayground } from "./calc-labs";
import { RULE_CASES, central, dbgBuggy, dbgCorrect, dbgNumeric, ruleCase, secant, sqr, stepError } from "./calc-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Calculus lessons", () => {
  it("secants: x² slope is exactly 2x + h; 5 at h=1, 4.5 at h=0.5, 4.01 at h=0.01 (x=2)", () => {
    expect(secant(sqr, 2, 1)).toBe(5); expect(secant(sqr, 2, 0.5)).toBe(4.5); expect(secant(sqr, 2, 0.01)).toBeCloseTo(4.01, 9); expect(secant(sqr, 3, 0.01)).toBeCloseTo(6.01, 9);
  });
  it("rules: each rule agrees with a measured slope and each tempting answer does not", () => {
    for (const r of RULE_CASES) for (const x of [0.5, 1, 2, 3]) {
      expect(r.rule(x), `${r.id} @ ${x}`).toBeCloseTo(central(r.f, x), 3);
    }
    expect(ruleCase("chain").rule(2)).toBe(-8); expect(ruleCase("chain").tempting(2)).toBe(-4);
    expect(ruleCase("power").rule(2)).toBe(12); expect(ruleCase("product").rule(1)).toBeCloseTo(3 * Math.E, 12);
    for (const id of ["power", "product", "quotient", "chain", "exp"]) expect(Math.abs(ruleCase(id).tempting(2) - central(ruleCase(id).f, 2)), id).toBeGreaterThan(1);
    expect(Math.abs(ruleCase("log").tempting(2) - central(ruleCase("log").f, 2))).toBeGreaterThan(0.5);
  });
  it("step size: central error is smallest around h = 1e-5 to 1e-6, bigger at both ends", () => {
    expect(stepError(5)).toBeLessThan(1e-8); expect(stepError(1)).toBeGreaterThan(1e-3); expect(stepError(1)).toBeLessThan(1e-2); expect(stepError(14)).toBeGreaterThan(100 * stepError(5));
    const ks = Array.from({ length: 15 }, (_, i) => i + 1); const best = ks.reduce((a, b) => (stepError(b) < stepError(a) ? b : a));
    expect(best).toBeGreaterThanOrEqual(4); expect(best).toBeLessThanOrEqual(7);
  });
  it("debug: at w=2, x=2, y=6 the buggy gradient is −4, the true one −8, and they agree when x = 1", () => {
    expect(dbgCorrect(2, 2, 6)).toBe(-8); expect(dbgBuggy(2, 2, 6)).toBe(-4); expect(dbgNumeric(2, 2, 6)).toBeCloseTo(-8, 4);
    expect(dbgBuggy(3, 1, 6)).toBe(dbgCorrect(3, 1, 6));
  });
});

describe("the playgrounds", () => {
  it("secants: shrinking h to 0.05 or less calls onDone, and the readout shows the slope", () => {
    const done = vi.fn(); render(<SecantsPlayground onDone={done} />);
    expect(readout("Secant slope")).toBe("5"); expect(readout("Tangent slope 2x")).toBe("4");
    fireEvent.click(screen.getByRole("button", { name: "h = 0.5" })); expect(done).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "h = 0.01" })); expect(done).toHaveBeenCalled(); expect(readout("Secant slope")).toBe("4.01");
  });
  it("rules: choosing the rule answer on the chain function calls onDone; the tempting one says it is off", () => {
    const done = vi.fn(); render(<RulesPlayground onDone={done} />);
    expect(readout("Measured slope")).toBe("-8");
    fireEvent.click(screen.getByLabelText(/The tempting one/));
    expect(done).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText(/chain rule answer/)); expect(done).toHaveBeenCalledTimes(1);
  });
  it("step size: visiting both a too-big and a too-small step calls onDone", () => {
    const done = vi.fn(); render(<StepSizePlayground onDone={done} />);
    fireEvent.click(screen.getByRole("button", { name: "Too big" })); expect(done).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Too small" })); expect(done).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Textbook/ })); expect(readout("True slope e")).toBe("2.7182818285");
  });
  it("debug: running the check reports the buggy formula failing at x = 2 and passing by accident at x = 1", () => {
    const done = vi.fn(); render(<GradientCheckPlayground onDone={done} />);
    expect(readout("Measured slope")).toBe("-8"); expect(readout(/Buggy/)).toBe("-4"); expect(readout(/Fixed/)).toBe("-8");
    fireEvent.click(screen.getByRole("button", { name: "Run the gradient check" })); expect(done).toHaveBeenCalled();
    expect(document.body.textContent).toContain("Buggy formula fails the check");
    fireEvent.click(screen.getByRole("button", { name: "Set x = 1" })); fireEvent.click(screen.getByRole("button", { name: "Run the gradient check" }));
    expect(document.body.textContent).toContain("only by accident");
  });
});
