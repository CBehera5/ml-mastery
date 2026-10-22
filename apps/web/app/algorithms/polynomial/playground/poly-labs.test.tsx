// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ColumnsPlayground, CurvePlayground, DegreePlayground, LimitsPlayground } from "./poly-labs";
import { DEGREES, NARROW, TRAIN, TRUE_CURVE, VALID, columns, expand2, fit, handCurve, mae } from "./poly-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Polynomial lessons", () => {
  it("weights 1, 2, 3 give 17 at area 2; raising the first weight to 4 gives 21", () => { expect(handCurve(1, 2, 3)(2)).toBe(17); expect(handCurve(1, 4, 3)(2)).toBe(21); });
  it("columns: 2 features → 5 at degree 2 and 9 at degree 3; 10 features at degree 3 → 285; [2, 3] expands to [2, 3, 4, 6, 9]", () => {
    expect([columns(2, 2), columns(2, 3), columns(10, 3)]).toEqual([5, 9, 285]); expect(expand2(2, 3)).toEqual([2, 3, 4, 6, 9]);
  });
  it("degree 8 is better on training than unseen houses; degree 2 has the lowest unseen error; the penalty calms degree 8", () => {
    const unseen = DEGREES.map(d => mae(fit(TRAIN, d), VALID)); expect(DEGREES[unseen.indexOf(Math.min(...unseen))]).toBe(2);
    expect(mae(fit(TRAIN, 8), TRAIN)).toBeCloseTo(0.914, 2); expect(mae(fit(TRAIN, 8), VALID)).toBeCloseTo(2.082, 2); expect(mae(fit(TRAIN, 2), VALID)).toBeCloseTo(1.531, 2);
    expect(mae(fit(TRAIN, 8, 0.1), VALID)).toBeLessThan(mae(fit(TRAIN, 8), VALID));
  });
  it("outside the training range degree 5 explodes and degree 2 stays near the pattern", () => {
    expect(Math.abs(fit(NARROW, 5)(6))).toBeGreaterThan(1000); expect(Math.abs(fit(NARROW, 2)(3.8) - TRUE_CURVE(3.8))).toBeLessThan(5);
    expect(Math.max(...NARROW.map(h => h.x))).toBeLessThanOrEqual(3);
  });
});

describe("the playgrounds", () => {
  it("curve: the worked example reads 17 at area 2", () => { render(<CurvePlayground />); fireEvent.click(screen.getByRole("button", { name: "The worked example" })); expect(readout("Price at area 2")).toBe("₹17 lakh"); });
  it("columns: ten features at degree 3 reads 285", () => { render(<ColumnsPlayground />); expect(readout("Columns")).toBe("5"); fireEvent.click(screen.getByRole("button", { name: "Ten features, degree 3" })); expect(readout("Columns")).toBe("285"); });
  it("degree: degree 8 shows a gap that the penalty narrows", () => {
    render(<DegreePlayground />); const before = Number(readout("Average miss, unseen houses").replace(/[^0-9.]/g, ""));
    fireEvent.click(screen.getByRole("button", { name: "Degree 8 with a penalty" })); expect(Number(readout("Average miss, unseen houses").replace(/[^0-9.]/g, ""))).toBeLessThan(before);
  });
  it("limits: the default query is flagged as extrapolation and an in-range preset clears it", () => {
    render(<LimitsPlayground />); expect(readout("Inside the training range?")).toBe("no, extrapolating");
    fireEvent.click(screen.getByRole("button", { name: "Inside the range" })); expect(readout("Inside the training range?")).toBe("yes");
  });
});
