// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ComparePlayground, LeakTransformPlayground, LogLossPlayground, SequentialPlayground, SquaredPlayground, StopPlayground } from "./gb-labs";
import { TRAIN_PTS, VALID_PTS, bestStage, boost, boostMse, centre, compare, logStep, squaredStep } from "./gb-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Gradient Boosting lessons", () => {
  it("start 3, step 0.1, trees 2 then 1: guesses 3.2 then 3.3; the leftover for a price of 5 goes 2 → 1.8", () => {
    const F1 = 3 + 0.1 * 2, F2 = F1 + 0.1 * 1; expect(F1).toBeCloseTo(3.2, 12); expect(F2).toBeCloseTo(3.3, 12); expect(5 - F1).toBeCloseTo(1.8, 12); expect((3 + 2 + 1) / 3).toBe(2);
  });
  it("squared error 4 → 3.24, half-squared 2 → 1.62, a leaf with leftovers 2 and 4 proposes 3", () => {
    const s = squaredStep(5, 3, 2, 0.1); expect(s.errBefore).toBe(4); expect(s.errAfter).toBeCloseTo(3.24, 12); expect(s.halfBefore).toBe(2); expect(s.halfAfter).toBeCloseTo(1.62, 12); expect((2 + 4) / 2).toBe(3);
  });
  it("log loss: gradient .5, uncertainty .25, leaf correction 2, new score .2, new chance .549834", () => {
    const s = logStep(1, 0, 0.1); expect(s.gradient).toBe(0.5); expect(s.hessian).toBe(0.25); expect(s.leaf).toBe(2); expect(s.Fnew).toBeCloseTo(0.2, 12); expect(s.pNew).toBeCloseTo(0.549834, 6);
  });
  it("stopping: with fast steps the unseen error is lowest at stage 4, a budget of 8 keeps 4, and training error keeps falling", () => {
    const b = boost(TRAIN_PTS, 30, 0.5, 2); expect(bestStage(b, VALID_PTS, 8).stage).toBe(4); expect(bestStage(b, VALID_PTS, 2).stage).toBe(2);
    expect(boostMse(b, TRAIN_PTS, 30)).toBeLessThan(boostMse(b, TRAIN_PTS, 4)); expect(boostMse(b, VALID_PTS, 30)).toBeGreaterThan(boostMse(b, VALID_PTS, 4) + 0.5);
  });
  it("a slow step size needs many more stages to reach the same error", () => {
    expect(bestStage(boost(TRAIN_PTS, 30, 0.1, 2), VALID_PTS, 30).stage).toBeGreaterThan(15);
  });
  it("training mean 1 vs global mean 34; the validation value centres to 99 properly and 66 with leakage", () => {
    expect(centre([100], [0, 2]).mean).toBe(1); expect(centre([100], [0, 2, 100]).mean).toBe(34); expect(centre([100], [0, 2]).shifted[0]).toBe(99); expect(centre([100], [0, 2, 100]).shifted[0]).toBe(66);
  });
  it("forest MAE 1.5 and booster 0.5 on [5, 8]; and on the real data neither method always wins", () => {
    const mae = (p: number[], a: number[]) => p.reduce((s, x, i) => s + Math.abs(x - a[i]), 0) / a.length; expect(mae([4, 6], [5, 8])).toBe(1.5); expect(mae([5, 7], [5, 8])).toBe(0.5);
    const calm = compare(30, 0.1), wild = compare(60, 0.5); expect(calm.boosting).toBeLessThan(calm.forest); expect(wild.boosting).toBeGreaterThan(wild.forest);
  });
});

describe("the playgrounds", () => {
  it("sequential: each correction lowers the training miss", () => {
    render(<SequentialPlayground />); const now = Number(readout("Average squared miss now")), start = Number(readout("Average squared miss at the start")); expect(now).toBeLessThan(start);
  });
  it("squared: defaults show 4 → 3.24", () => { render(<SquaredPlayground />); expect(readout("Squared error, before → after")).toBe("4 → 3.24"); expect(readout("Half-squared error, before → after")).toBe("2 → 1.62"); });
  it("log loss: the default customer gets a correction of 2 and a new chance of 55%", () => { render(<LogLossPlayground />); expect(readout("Leaf correction")).toBe("2"); expect(readout("New score → chance")).toBe("0.2 → 55%"); });
  it("stop: a budget of 8 keeps stage 4", () => { render(<StopPlayground />); expect(readout("Stage to keep")).toBe("4"); });
  it("leak: fitting on all rows moves the centre to 34 and is flagged", () => {
    render(<LeakTransformPlayground />); expect(readout("Centre used")).toBe("1"); fireEvent.click(screen.getByRole("button", { name: "Fit on all rows" })); expect(readout("Centre used")).toBe("34"); expect(readout("Allowed?")).toMatch(/^no/);
  });
  it("compare: shows both methods and a winner", () => { render(<ComparePlayground />); expect(readout("Better here")).toMatch(/boosting|forest|even/); });
});
