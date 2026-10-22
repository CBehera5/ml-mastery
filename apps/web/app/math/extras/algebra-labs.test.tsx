// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { VariablesPlayground, FunctionsPlayground, GraphsPlayground, PowersPlayground, LogarithmsPlayground, TransformationsPlayground } from "./algebra-labs";
import { bill, compound, crossoverDay, doublings, fare, growth, lin, solveLinear, sq } from "./algebra-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Algebra lessons", () => {
  it("variables: 120 + 35n = 330 gives n = 6; 2x + 3 = 11 gives 4", () => {
    expect(bill(6)).toBe(330); expect(solveLinear(35, 120, 330)).toBe(6); expect(solveLinear(2, 3, 11)).toBe(4); expect(bill(5)).toBe(295); expect(bill(7)).toBe(365);
    expect(solveLinear(35, 120, 400)).toBe(8); expect(solveLinear(35, 120, 250)).toBeCloseTo(3.714, 3);
  });
  it("functions: f(2.5) = 8, f(0) = 3, f(1..3) = 5, 7, 9", () => { expect(fare(2.5)).toBe(8); expect(fare(0)).toBe(3); expect([1, 2, 3].map(fare)).toEqual([5, 7, 9]); });
  it("powers: day 5 is 60 vs 320; day 10 is 110 vs 10,240; crossover day 2; e", () => {
    expect([growth.linear(5), growth.doubling(5)]).toEqual([60, 320]); expect([growth.linear(10), growth.doubling(10)]).toEqual([110, 10240]);
    expect(growth.linear(1)).toBe(growth.doubling(1)); expect(crossoverDay()).toBe(2);
    expect(compound(1)).toBe(2); expect(compound(12)).toBeCloseTo(2.613035, 6); expect(compound(1000)).toBeCloseTo(2.716924, 6); expect(compound(1e6)).toBeCloseTo(Math.E, 5);
  });
  it("logarithms: 8 -> 3, 1000 -> 9.9658, 1e6 -> 19.9316, log10(1000) = 3", () => {
    expect(doublings(8)).toBe(3); expect(doublings(1000)).toBeCloseTo(9.9658, 4); expect(doublings(1e6)).toBeCloseTo(19.9316, 4); expect(Math.log10(1000)).toBeCloseTo(3, 12);
  });
  it("transformations: f(g(2)) = 25, g(f(2)) = 9", () => { expect(sq(lin(2))).toBe(25); expect(lin(sq(2))).toBe(9); });
  it("graphs: slope between (1,5) and (3,9) is 2, intercept 3, 11 at x = 4", () => { const a = (9 - 5) / (3 - 1); expect(a).toBe(2); expect(5 - a * 1).toBe(3); expect((11 - 3) / a).toBe(4); });
});

describe("the playgrounds", () => {
  it("variables: n = 6 balances; others say how far off", () => {
    render(<VariablesPlayground />);
    expect(readout("Difference")).toBe("−₹140");
    fireEvent.click(screen.getByRole("button", { name: "Show me the answer" })); expect(readout("Difference")).toBe("0");
    expect(screen.getAllByText(/Balanced/).length).toBeGreaterThan(0);
  });
  it("functions: refuses a negative distance", () => {
    render(<FunctionsPlayground />);
    expect(readout("Output f(d)")).toBe("₹8"); fireEvent.click(screen.getByRole("button", { name: "−1 km" }));
    expect(readout("Output f(d)")).toBe("no quote"); expect(readout("In the domain?")).toBe("no");
  });
  it("graphs: reads the quoted rule and the crossing point", () => {
    render(<GraphsPlayground />); expect(readout("Rule")).toBe("y = 2x + 3"); expect(readout("Crosses y = 0 at")).toBe("x = -1.5");
  });
  it("powers: shows 60 vs 320 on day 5 and e-ish for n = 12", () => {
    render(<PowersPlayground />); expect(readout("Plan A (adds)")).toBe("60 GB"); expect(readout("Plan B (doubles)")).toBe("320 GB"); expect(readout("(1 + 1/n)ⁿ")).toBe("2.613035");
    fireEvent.click(screen.getByRole("button", { name: "Jump to day 10" })); expect(readout("Plan B (doubles)")).toBe("10,240 GB");
  });
  it("logarithms: 1,000 needs 9.9658 doublings", () => {
    render(<LogarithmsPlayground />); expect(readout("Doublings needed (log₂)")).toBe("6.6439"); fireEvent.click(screen.getByRole("button", { name: "1,000" })); expect(readout("Doublings needed (log₂)")).toBe("9.9658");
    fireEvent.click(screen.getByRole("button", { name: "1,000,000" })); expect(readout("Doublings needed (log₂)")).toBe("19.9316");
  });
  it("transformations: shows 25 vs 9", () => { render(<TransformationsPlayground />); expect(readout("f(g(2)) vs g(f(2))")).toBe("25 vs 9"); });
});
