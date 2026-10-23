// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AveragePlayground, BagPlayground, ImportancePlayground, OobPlayground, VotePlayground } from "./rf-labs";
import { CHELD, FOREST, TRAIN_PTS, VALID_PTS, bagStats, bootstrap, classAccuracy, fitForest, forestMse, hardVote, meanProba, meanUniqueShare, oobMse, oobPredict, permutationDrop, treeMse } from "./rf-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Random Forests lessons", () => {
  it("bag [A, A, C, D]: four draws, three different houses, B out-of-bag", () => { const s = bagStats([0, 0, 2, 3], 4); expect(s.counts).toEqual([2, 0, 1, 1]); expect(s.unique).toBe(3); expect(s.oob).toEqual([1]); });
  it("a bag holds about two thirds of the houses", () => { expect(meanUniqueShare(8, 300)).toBeGreaterThan(0.6); expect(meanUniqueShare(8, 300)).toBeLessThan(0.72); expect(bootstrap(8, 41)).toHaveLength(8); });
  it("trees 2, 4, 6 average 4; against an actual 8 the errors are 6, 4 and an improvement of 2", () => { expect((2 + 4 + 6) / 3).toBe(4); expect(Math.abs(2 - 8)).toBe(6); expect(Math.abs(4 - 8)).toBe(4); });
  it("chances .4, .4, .9 average to 17/30 and the forest says leaves while a show of hands says stays", () => { expect(meanProba([0.4, 0.4, 0.9])).toBeCloseTo(17 / 30, 12); expect(hardVote([0.4, 0.4, 0.9])).toBe(0); });
  it("averaging helps: 25 trees beat the typical single tree on unseen houses (~2.17 vs ~3.8)", () => {
    const f = fitForest(TRAIN_PTS, 25), fm = forestMse(f, VALID_PTS), singles = f.trees.map((_, i) => treeMse(f, i, VALID_PTS)), avg = singles.reduce((a, b) => a + b, 0) / singles.length;
    expect(fm).toBeCloseTo(2.17, 1); expect(avg).toBeGreaterThan(fm + 1); expect(forestMse(fitForest(TRAIN_PTS, 1), VALID_PTS)).toBeGreaterThan(fm + 1);
  });
  it("out-of-bag: only trees that skipped a house vote, and some houses have no answer with one tree", () => {
    const f = fitForest(TRAIN_PTS, 25), o = oobMse(f, TRAIN_PTS); expect(o.rows + o.missing).toBe(24); expect(oobMse(fitForest(TRAIN_PTS, 1), TRAIN_PTS).missing).toBeGreaterThan(0);
    const one = oobPredict(f, TRAIN_PTS, 7); expect(one.n).toBe(f.trees.filter((_, t) => !f.bags[t].includes(7)).length);
  });
  it("permutation: complaints matters most, tenure some, and the random number can be slightly negative", () => {
    expect(classAccuracy(FOREST, CHELD)).toBeCloseTo(0.7125, 3); expect(permutationDrop(0).drop).toBeGreaterThan(0.15); expect(permutationDrop(1).drop).toBeGreaterThan(0.03); expect(permutationDrop(2).drop).toBeLessThan(0);
  });
});

describe("the playgrounds", () => {
  it("bag: each tree shows its draws and left-out houses", () => { render(<BagPlayground />); expect(readout("Draws")).toBe("8"); expect(Number(readout("Different houses seen"))).toBeLessThanOrEqual(8); });
  it("average: more trees lower the forest error", () => {
    render(<AveragePlayground />); const before = Number(readout("Forest error on unseen houses")); fireEvent.change(screen.getByLabelText(/Number of trees/), { target: { value: "1" } });
    expect(Number(readout("Forest error on unseen houses"))).toBeGreaterThan(before);
  });
  it("vote: the defaults average to 57% and disagree with a show of hands", () => { render(<VotePlayground />); expect(readout("Average chance of leaving")).toBe("57%"); expect(readout("Forest says")).toBe("leaves"); expect(readout("A show of hands says")).toBe("stays"); });
  it("oob: reports an out-of-bag error and the houses without an answer", () => { render(<OobPlayground />); expect(readout("Out-of-bag error")).toMatch(/\(24 rows\)/); expect(readout("Houses with no out-of-bag tree")).toBe("0"); });
  it("importance: complaints is the most used column", () => { render(<ImportancePlayground />); expect(Number(readout("Drop in accuracy (points)"))).toBeGreaterThan(15); });
});
