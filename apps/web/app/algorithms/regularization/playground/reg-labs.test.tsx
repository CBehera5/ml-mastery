// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ElasticPlayground, InterpretPlayground, LassoPlayground, RidgePlayground, SafePlayground, WhyPlayground } from "./reg-labs";
import { YTRAIN, YVALID, ZTRAIN, ZVALID, elastic, l1, l2sq, maeOf, predict, resamples, ridge, soft } from "./reg-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Regularization lessons", () => {
  it("weights (1, −2): L1 = 3, squared L2 = 5; SSE 4 + α 2 × 5 = 14", () => { expect(l1([1, -2])).toBe(3); expect(l2sq([1, -2])).toBe(5); expect(4 + 2 * l2sq([1, -2])).toBe(14); });
  it("one-feature ridge: 1.6 with no penalty, 0.8 with α = 10; lasso: 1.1 at α = 1 and exactly 0 at α = 5", () => {
    expect(16 / 10).toBeCloseTo(1.6, 12); expect(16 / (10 + 10)).toBeCloseTo(0.8, 12); expect(soft(3.2, 1) / 2).toBeCloseTo(1.1, 12); expect(soft(3.2, 5)).toBe(0);
  });
  it("elastic net penalty for w = (1, 2), α = 1, q = 0.5 is 1.5 + 1.25 = 2.75", () => { expect(1 * 0.5 * 3 + (1 * 0.5 * 5) / 2).toBe(2.75); });
  it("scaler: mean of 8 and 12 is 10, not the 16.67 of all three; raw slope 6 ÷ 3 = 2 and intercept 10 − 2 × 4 = 2", () => {
    expect((8 + 12) / 2).toBe(10); expect(Number(((8 + 12 + 30) / 3).toFixed(2))).toBe(16.67); expect(6 / 3).toBe(2); expect(10 - 2 * 4).toBe(2); expect(10 + (6 * (7 - 4)) / 3).toBe(16);
  });
  it("ridge steadies the weight on area across resamples; the best ridge α on unseen houses is 1 and lasso zeroes weights", () => {
    const spread = (a: number) => { const w = resamples().map(idx => ridge(idx.map(k => ZTRAIN[k]), idx.map(k => YTRAIN[k]), a).w[0]); return Math.max(...w) - Math.min(...w); };
    expect(spread(0)).toBeGreaterThan(2 * spread(10));
    const valid = (a: number) => maeOf(predict(ridge(ZTRAIN, YTRAIN, a), ZVALID), YVALID), alphas = [0, 1, 2, 5, 10, 20, 80], best = alphas.reduce((a, b) => (valid(b) < valid(a) ? b : a));
    expect(best).toBe(1);
    expect(elastic(ZTRAIN, YTRAIN, 0.25, 0).w.filter(w => w === 0).length).toBe(2);
  });
});

describe("the playgrounds", () => {
  it("why: the penalty narrows the spread of the area weight", () => {
    render(<WhyPlayground />); const before = Number(readout("Weight on area, range across 6 samples"));
    fireEvent.click(screen.getByRole("button", { name: "Turn the penalty on" })); expect(Number(readout("Weight on area, range across 6 samples"))).toBeLessThan(before);
  });
  it("ridge: best α is reported and the strongest penalty raises unseen error", () => {
    render(<RidgePlayground />); expect(readout("Best α on unseen houses")).toBe("1");
    const before = Number(readout("Average miss, unseen houses").replace(/[^0-9.]/g, "")); fireEvent.click(screen.getByRole("button", { name: "Very strong" })); expect(Number(readout("Average miss, unseen houses").replace(/[^0-9.]/g, ""))).toBeGreaterThan(before);
  });
  it("lasso: the default drops two weights to exactly zero", () => { render(<LassoPlayground />); expect(readout("Weights exactly zero")).toBe("2 of 3"); fireEvent.click(screen.getByRole("button", { name: "No penalty" })); expect(readout("Weights exactly zero")).toBe("0 of 3"); });
  it("elastic: the worked example totals 2.75", () => { render(<ElasticPlayground />); expect(readout("Total penalty")).toBe("2.75"); fireEvent.click(screen.getByRole("button", { name: "All Lasso" })); expect(readout("Total penalty")).toBe("3"); });
  it("safe: the leaky scaler's mean differs from the honest one", () => {
    render(<SafePlayground />); const honest = readout("Scaler average (area)"); fireEvent.click(screen.getByRole("button", { name: /Fit the scaler on all houses/ })); expect(readout("Scaler average (area)")).not.toBe(honest);
  });
  it("interpret: both routes give 16 at x = 7", () => { render(<InterpretPlayground />); expect(readout("Price at x (scaled route)")).toBe("₹16 lakh"); expect(readout("Price at x (raw route)")).toBe("₹16 lakh"); expect(readout("Raw intercept")).toBe("₹2 lakh"); });
});
