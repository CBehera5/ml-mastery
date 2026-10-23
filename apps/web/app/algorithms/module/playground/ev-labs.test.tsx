// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CapacityPlayground, ConfusionPlayground, ErrorPlayground, HonestPlayground, MomentPlayground, ProbabilityPlayground } from "./ev-labs";
import { CAPACITY, FOLD_A, FOLD_B, RESAMPLES, TRAIN, VALID, brier, eligible, logLoss, mae, mean, metrics, r2, reduction, sdPop } from "./ev-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Evaluation lessons", () => {
  it("day 0 allows only past columns; the day-60 cancellation flag is blocked until day 60", () => { expect(eligible(0).map(f => f.name)).not.toContain("cancellation flag"); expect(eligible(60).map(f => f.name)).toContain("cancellation flag"); });
  it("baseline 5 and candidate 4 is a 20% reduction; predictions [3, 3] for [1, 3] have R² = −1", () => { expect(reduction(5, 4)).toBeCloseTo(0.2, 12); expect(r2([3, 3], [1, 3])).toBe(-1); expect(mae([3, 3], [1, 3])).toBe(1); });
  it("100 items, one real case: 99% accuracy, recall 0; TP 2 FP 1 TN 1 FN 1: precision, recall, F1 = 2/3", () => {
    const lazy = metrics(0, 0, 99, 1); expect(lazy.accuracy).toBe(0.99); expect(lazy.recall).toBe(0); const m = metrics(2, 1, 1, 1); expect(m.precision).toBeCloseTo(2 / 3, 12); expect(m.recall).toBeCloseTo(2 / 3, 12); expect(m.f1).toBeCloseTo(2 / 3, 12);
  });
  it("[.8, .2]: Brier .04, log loss .22314355; [.6, .4]: Brier .16, log loss .51082562", () => {
    expect(brier([0.8, 0.2], [1, 0])).toBeCloseTo(0.04, 12); expect(logLoss([0.8, 0.2], [1, 0])).toBeCloseTo(0.22314355, 8); expect(brier([0.6, 0.4], [1, 0])).toBeCloseTo(0.16, 12); expect(logLoss([0.6, 0.4], [1, 0])).toBeCloseTo(0.51082562, 8);
  });
  it("capacity pairs (8,9), (3,4), (1,12): the middle wins on development; errors 2, 4, 6 have mean 4 and spread √(8/3)", () => {
    expect(CAPACITY.map(c => [c.train, c.dev])).toEqual([[8, 9], [3, 4], [1, 12]]); expect(mean(RESAMPLES)).toBe(4); expect(sdPop(RESAMPLES)).toBeCloseTo(1.632993, 6);
  });
  it("centres: 5 for training, 31/3 with validation, 3 for fold A and 7 for fold B", () => { expect(mean(TRAIN)).toBe(5); expect(mean([...TRAIN, ...VALID])).toBeCloseTo(31 / 3, 12); expect(mean(FOLD_A)).toBe(3); expect(mean(FOLD_B)).toBe(7); });
});

describe("the playgrounds", () => {
  it("moment: day 0 blocks the future columns", () => { render(<MomentPlayground />); expect(Number(readout("Blocked as future information"))).toBeGreaterThan(0); fireEvent.change(screen.getByLabelText(/Prediction day/), { target: { value: "60" } }); expect(readout("Blocked as future information")).toBe("0"); });
  it("error: defaults give R² −1 and a 20% reduction", () => { render(<ErrorPlayground />); expect(readout("R²")).toMatch(/^-1/); expect(readout("Error reduction, baseline → candidate")).toBe("20%"); });
  it("confusion: the lazy case shows 99% accuracy and 0% recall", () => { render(<ConfusionPlayground />); expect(readout("Precision")).toBe("66.7%"); fireEvent.click(screen.getByRole("button", { name: "Try 100 items with one real case" })); expect(readout("Accuracy")).toBe("99%"); expect(readout("Recall")).toBe("0%"); });
  it("probabilities: the defaults give Brier .04", () => { render(<ProbabilityPlayground />); expect(readout("Brier score (lower is better)")).toBe("0.04"); expect(readout("Ranking")).toBe("correct"); });
  it("capacity: the flexible model fits training best but the moderate one wins on unseen houses", () => { render(<CapacityPlayground />); expect(readout("Best on unseen houses")).toBe("moderate"); });
  it("honest: fitting on training plus validation is flagged", () => { render(<HonestPlayground />); expect(readout("Allowed?")).toBe("yes"); fireEvent.change(screen.getByLabelText(/Fit the centre on/), { target: { value: "2" } }); expect(readout("Allowed?")).toMatch(/^no/); });
});
