// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LimitsPlayground, MarginPlayground, RbfPlayground, ScalePlayground, SoftMarginPlayground } from "./sv-labs";
import { BLOBS, BLOBS_HELD, RING_TEST, RING_TRAIN, balanced, classC, distance, fitLinear, fitRbf, hinge, linAccuracy, rbf, rbfAccuracy, score, supports } from "./sv-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the SVM lessons", () => {
  it("w = (1, 0), x = (2, 3): score 2, distance 2; doubling w gives score 4, distance still 2; hinge .5 at score .5", () => {
    expect(score([1, 0], 0, [2, 3])).toBe(2); expect(distance([1, 0], 0, [2, 3])).toBe(2); expect(score([2, 0], 0, [2, 3])).toBe(4); expect(distance([2, 0], 0, [2, 3])).toBe(2); expect(hinge(1, 0.5)).toBe(0.5); expect(hinge(1, -0.5)).toBe(1.5);
  });
  it("hinge: positive and beyond the margin is 0; a wrong-side −1 customer at +0.5 costs 1.5", () => { expect(hinge(1, 2)).toBe(0); expect(hinge(-1, 0.5)).toBe(1.5); });
  it("a smaller C gives a wider margin with more customers on or inside it; every setting classifies these groups", () => {
    const small = fitLinear(BLOBS, 0.01, 6000), big = fitLinear(BLOBS, 10, 6000);
    expect(small.margin).toBeGreaterThan(big.margin + 1); expect(supports(small, BLOBS)).toBeGreaterThan(supports(big, BLOBS) + 5); expect(linAccuracy(small, BLOBS_HELD)).toBeGreaterThanOrEqual(0.95);
  });
  it("RBF: similarity at distance 1 is .367879 (gamma 1) and .018316 (gamma 4)", () => { expect(rbf(1, 1)).toBeCloseTo(0.367879, 6); expect(rbf(1, 4)).toBeCloseTo(0.018316, 6); expect(rbf(0, 10)).toBe(1); });
  it("on the ring, RBF separates what a straight line cannot", () => {
    const lin = fitLinear(RING_TRAIN, 1), k = fitRbf(RING_TRAIN, 1, 1);
    expect(linAccuracy(lin, RING_TEST)).toBeLessThan(0.75); expect(rbfAccuracy(k, RING_TRAIN)).toBe(1); expect(rbfAccuracy(k, RING_TEST)).toBeGreaterThanOrEqual(0.95);
  });
  it("training mean 1 vs all-rows mean 34; C .5 with weight 3 gives 1.5", () => { expect((0 + 2) / 2).toBe(1); expect((0 + 2 + 100) / 3).toBeCloseTo(34, 12); expect(classC(0.5, 3)).toBe(1.5); });
  it("three correct of six: accuracy .5; a lazy model gets .95 accuracy and .5 balanced", () => {
    expect(balanced(3, 3, 1, 2).accuracy).toBe(0.5); expect(balanced(3, 3, 1, 2).balanced).toBe(0.5); const lazy = balanced(5, 95, 0, 95); expect(lazy.accuracy).toBe(0.95); expect(lazy.balanced).toBe(0.5);
  });
});

describe("the playgrounds", () => {
  it("margin: the default customer scores 2 at distance 2", () => { render(<MarginPlayground />); expect(readout("Score")).toBe("2"); expect(readout("Distance from the line")).toBe("2"); });
  it("margin: doubling the first weight doubles the score and keeps the distance", () => {
    render(<MarginPlayground />); fireEvent.change(screen.getByLabelText(/Weight on complaints/), { target: { value: "2" } }); expect(readout("Score")).toBe("4"); expect(readout("Distance from the line")).toBe("2");
  });
  it("soft margin: shows a margin width and a count of customers on or inside it", () => { render(<SoftMarginPlayground />); expect(readout("Margin width")).toMatch(/\d/); expect(readout("Customers on or inside the margin")).toMatch(/ of 32$/); });
  it("rbf: shows the similarity at distance 1 for the chosen gamma", () => { render(<RbfPlayground />); expect(readout("Similarity at distance 1")).toBe("0.3679"); expect(readout("Straight line, on new customers")).toMatch(/%/); });
  it("scale: fitting on all rows moves the centre to 34 and the weighted penalty updates", () => {
    render(<ScalePlayground />); expect(readout("Centre used")).toBe("1"); expect(readout("Penalty C for the positive class")).toBe("1.5"); fireEvent.click(screen.getByRole("button", { name: "Fit on all rows" })); expect(readout("Centre used")).toBe("34"); expect(readout("Allowed?")).toMatch(/^no/);
  });
  it("limits: the defaults give 50%, and the rare-leaver case shows 95% accuracy but 50% balanced", () => {
    render(<LimitsPlayground />); expect(readout("Accuracy")).toBe("50%"); fireEvent.click(screen.getByRole("button", { name: "Try a rare-leaver case" })); expect(readout("Accuracy")).toBe("95%"); expect(readout("Balanced accuracy")).toBe("50%");
  });
});
