// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AlignPlayground, DepthPlayground, GiniPlayground, PartitionPlayground, RulePlayground, SplitPlayground } from "./dt-labs";
import { TARGETS, TRAIN_PTS, TOWN_A, TOWN_B, VALID_PTS, aligned, bestCut, bestSplit, covers, gini, giniGain, grow, heldAccuracy, misaligned, mse, shareOf, splitAt, sse, stump2 } from "./dt-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Decision Trees lessons", () => {
  it("cuts at 2 and 5: groups average 3, 7, 9; area 4 → 7, area 2 → 3, area 6 → 9", () => {
    const s = (a: number) => stump2(2, 5, a); expect(s(4).leaves.map(v => Number(v.toFixed(6)))).toEqual([3, 7, 9]); expect(s(4).prediction).toBeCloseTo(7, 9); expect(s(2).prediction).toBeCloseTo(3, 9); expect(s(6).prediction).toBeCloseTo(9, 9); expect(stump2(2, 5, 50).prediction).toBeCloseTo(9, 9);
  });
  it("[2, 4]: mean 3, SSE 2; [1,1,5,5] splits from 16 to 0; [1,3,5,7] from 20 to 4", () => {
    expect(sse([2, 4])).toBe(2); expect(sse([1, 1, 5, 5])).toBe(16); expect(splitAt([1, 1, 5, 5], 2).reduction).toBe(16); expect(sse([1, 3, 5, 7])).toBe(20); expect(splitAt([1, 3, 5, 7], 2).child).toBe(4); expect(splitAt([1, 3, 5, 7], 2).reduction).toBe(16);
  });
  it("eight prices: total error 76, best cut after house 4 removes 72", () => { expect(sse([...TARGETS])).toBe(76); expect(bestSplit([...TARGETS])).toBe(4); expect(splitAt([...TARGETS], 4).reduction).toBe(72); });
  it("Gini: [2,2] = .5, pure = 0, gains .5 and 2/9", () => {
    expect(gini([2, 2])).toBe(0.5); expect(gini([2, 0])).toBe(0); expect(giniGain([2, 0], [0, 2]).gain).toBeCloseTo(0.5, 12); expect(giniGain([3, 0], [1, 2]).parentGini).toBeCloseTo(4 / 9, 12); expect(giniGain([3, 0], [1, 2]).gain).toBeCloseTo(2 / 9, 12);
  });
  it("depth: one cut 1.440 train / 1.993 unseen; training error keeps falling while unseen error gets worse", () => {
    const t = grow(TRAIN_PTS, 1, 1); expect(mse(t, TRAIN_PTS)).toBeCloseTo(1.44, 2); expect(mse(t, VALID_PTS)).toBeCloseTo(1.993, 3);
    const deep = grow(TRAIN_PTS, 5, 1); expect(mse(deep, TRAIN_PTS)).toBeLessThan(mse(t, TRAIN_PTS)); expect(mse(deep, VALID_PTS)).toBeGreaterThan(mse(t, VALID_PTS) + 0.5);
  });
  it("matched rows: cut ₹640, fits all, 87.5% on new customers; scrambled rows do worse", () => {
    const a = aligned(), m = misaligned(), fa = bestCut(a.bills, a.labels), fm = bestCut(m.bills, m.labels);
    expect(fa.cut).toBe(640); expect(fa.trainAccuracy).toBe(1); expect(heldAccuracy(640)).toBe(0.875); expect(fm.trainAccuracy).toBe(0.5); expect(heldAccuracy(fm.cut)).toBeLessThan(0.875);
  });
  it("rule area ≤ 2 AND age > 10 covers 3 of 20 (15%) in town A and none in town B; area importance 0.8", () => {
    expect(covers(TOWN_A, 2, 10).length).toBe(3); expect(3 / TOWN_A.length).toBe(0.15); expect(covers(TOWN_B, 2, 10).length).toBe(0); expect(shareOf({ area: 8, age: 2 }, "area")).toBeCloseTo(0.8, 12);
  });
});

describe("the playgrounds", () => {
  it("partition: the default query lands in the middle group at 7", () => { render(<PartitionPlayground />); expect(readout("Group average = prediction")).toMatch(/^7 /); });
  it("split: the best-cut button jumps to house 4 and shows 72 removed", () => {
    render(<SplitPlayground />); fireEvent.click(screen.getByRole("button", { name: "Jump to the best cut" })); expect(readout("Error removed")).toBe("72");
  });
  it("gini: defaults give a gain of 0.222", () => { render(<GiniPlayground />); expect(readout("Gain")).toBe("0.222"); });
  it("depth: depth 1 shows 1.99 on unseen houses", () => { render(<DepthPlayground />); expect(readout("Error on unseen houses")).toBe("1.99"); expect(readout("Depth with the lowest unseen error")).toBe("1"); });
  it("align: sorting the bills only drops training accuracy to 50%", () => {
    render(<AlignPlayground />); expect(readout("Best bill cut found")).toBe("₹640"); fireEvent.click(screen.getByRole("button", { name: "Sort the bills but not the labels" })); expect(readout("Accuracy on the rows it trained on")).toBe("50%");
  });
  it("rule: town A covers 3 of 20, town B none", () => {
    render(<RulePlayground />); expect(readout("Houses the rule covers")).toBe("3 of 20 (15%)"); fireEvent.click(screen.getByRole("button", { name: "Try it on town B" })); expect(readout("Houses the rule covers")).toBe("0 of 20 (0%)");
  });
});
