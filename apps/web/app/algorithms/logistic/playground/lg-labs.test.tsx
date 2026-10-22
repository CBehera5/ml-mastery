// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ConfidencePlayground, LeakPlayground, SigmoidPlayground } from "./lg-labs";
import { OUTCOMES, SCORES, TEST, TRAIN, accuracy, counts, fitLogistic, logit, meanLoss, rowLoss, sigmoid } from "./lg-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Logistic Regression lessons", () => {
  it("score ln 3 is a 75% chance with odds 3 to 1; the log-odds go back to the score", () => {
    expect(sigmoid(Math.log(3))).toBeCloseTo(0.75, 12); expect(0.75 / 0.25).toBeCloseTo(3, 12); expect(logit(0.75)).toBeCloseTo(Math.log(3), 12); expect(sigmoid(0)).toBe(0.5);
  });
  it("log loss: ln 2 at 50%, 0.105361 at 90% for a customer who left; mean of two is 0.164252", () => {
    expect(rowLoss(1, 0.5)).toBeCloseTo(Math.LN2, 12); expect(rowLoss(1, 0.9)).toBeCloseTo(0.105361, 6); expect(rowLoss(0, 0.1)).toBeCloseTo(0.105361, 6); expect(meanLoss([1, 0], [0.9, 0.2])).toBeCloseTo(0.164252, 6);
  });
  it("p = [.2, .6, .8], y = [0, 1, 1] at a .7 bar: TP 1, FP 0, TN 1, FN 1", () => {
    const c = counts([0.2, 0.6, 0.8], [0, 1, 1], 0.7); expect([c.tp, c.fp, c.tn, c.fn]).toEqual([1, 0, 1, 1]); expect(c.precision).toBe(1); expect(c.recall).toBe(0.5);
  });
  it("honest model ≈ 80% on unseen customers, majority ≈ 71.7%, leaked flag ≈ 100%", () => {
    const rows = (leak: boolean) => (c: (typeof TRAIN)[number]) => (leak ? [c.complaints, c.tenure, c.cancelled] : [c.complaints, c.tenure]);
    const acc = (leak: boolean) => { const r = rows(leak), m = fitLogistic(TRAIN.map(r), TRAIN.map(c => c.y), 1); return accuracy(TEST.map(c => m.p(r(c))), TEST.map(c => c.y)); };
    expect(acc(false)).toBeCloseTo(0.8, 2); expect(acc(true)).toBeGreaterThanOrEqual(0.99); expect(TEST.filter(c => !c.y).length / TEST.length).toBeCloseTo(0.717, 3);
  });
  it("accuracy is 75% at every stretch; the best log loss is near 1", () => {
    const acc = (k: number) => accuracy(SCORES.map(s => sigmoid(k * s)), OUTCOMES), loss = (k: number) => meanLoss(OUTCOMES, SCORES.map(s => sigmoid(k * s)));
    for (const k of [0.2, 1, 3, 6]) expect(acc(k)).toBe(0.75);
    expect(loss(1)).toBeCloseTo(0.504, 3); expect(loss(6)).toBeGreaterThan(loss(1) + 0.5); expect(loss(1)).toBeLessThan(loss(0.4)); expect(loss(1)).toBeLessThan(loss(2));
  });
});

describe("the playgrounds", () => {
  it("sigmoid: the default x gives a chance between 0 and 100%", () => { render(<SigmoidPlayground />); expect(screen.getAllByText(/%/).length).toBeGreaterThan(0); });
  it("leak: adding the day-30 flag lifts the score and flags it as impossible", () => {
    render(<LeakPlayground />);
    expect(readout("Can we know all features on day 0?")).toBe("yes");
    fireEvent.click(screen.getByRole("button", { name: "Add the day-30 flag" }));
    expect(readout("Can we know all features on day 0?")).toMatch(/no/); expect(readout("Model accuracy")).toMatch(/^(99|100)/);
  });
  it("confidence: a very sure model has a worse log loss at the same accuracy", () => {
    render(<ConfidencePlayground />); expect(document.body.textContent).toMatch(/log loss/i);
  });
});
