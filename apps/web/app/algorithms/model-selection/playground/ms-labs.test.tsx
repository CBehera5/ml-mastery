// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CostPlayground, DecidePlayground, FairPlayground, NestedPlayground, ReliancePlayground, SearchPlayground } from "./ms-labs";
import { PS, YS, cheapestBar, choose, expectedBest, fits, kfold, nestedFits, reduction, tally, totalCost } from "./ms-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Model Selection lessons", () => {
  it("12 → 9 is a 25% reduction", () => { expect(reduction(12, 9)).toBeCloseTo(0.25, 12); });
  it("3 C values × 2 gammas × 3 folds = 18 fits; the best of more candidates looks better by luck alone", () => { expect(fits(3, 2, 3)).toBe(18); expect(expectedBest(1)).toBeLessThan(0.3); expect(expectedBest(18)).toBeGreaterThan(expectedBest(2) + 0.8); });
  it("nested: 3 outer, 2 inner, 4 candidates = 27 fits; 10 rows in 3 folds are 4, 3, 3 and cover every row once", () => { expect(nestedFits(3, 2, 4)).toBe(27); expect(kfold(10, 3).map(f => f.length)).toEqual([4, 3, 3]); expect(kfold(10, 3).flat().sort((a, b) => a - b)).toEqual([...Array(10).keys()]); });
  it("10 misses at 10 and 2 false alarms at 1 cost 102; costly misses lower the cheapest bar", () => { expect(totalCost(2, 10, 1, 10)).toBe(102); expect(cheapestBar(1, 10)).toBeLessThan(cheapestBar(10, 1)); expect(PS).toHaveLength(YS.length); expect(tally(0.5).tp + tally(0.5).fp + tally(0.5).tn + tally(0.5).fn).toBe(20); });
  it("a 0.01 lead inside a 0.02 tolerance keeps the simple model", () => { expect(choose(0.82, 0.83, 0.02)).toBe("simple"); expect(choose(0.82, 0.9, 0.02)).toBe("complex"); });
});

describe("the playgrounds", () => {
  it("fair: the defaults are fair and show 25%", () => { render(<FairPlayground />); expect(readout("Error reduction vs the baseline")).toBe("25%"); expect(readout("Comparison")).toBe("fair"); });
  it("fair: using different homes makes it unfair and says what is missing", () => { render(<FairPlayground />); fireEvent.change(screen.getByLabelText(/Same validation homes/), { target: { value: "0" } }); expect(readout("Comparison")).toBe("not fair"); expect(readout("What is missing")).toBe("same homes"); });
  it("search: 3 × 2 × 3 = 18 fits", () => { render(<SearchPlayground />); expect(readout("Fits to run (before the refit)")).toBe("18"); });
  it("nested: the defaults need 27 fits with 4 candidates", () => { render(<NestedPlayground />); expect(readout(/Fits in total/)).toBe("27"); });
  it("cost: the defaults show a total cost and a cheapest bar", () => { render(<CostPlayground />); expect(Number(readout("Total cost at this bar"))).toBeGreaterThanOrEqual(0); expect(readout("Cheapest bar")).toMatch(/%/); });
  it("reliance: 0.80 → 0.68 is a drop of 0.12", () => { render(<ReliancePlayground />); expect(readout("Drop in score")).toBe("0.12"); });
  it("decide: a 0.01 lead keeps the small tree and the record is complete", () => { render(<DecidePlayground />); expect(readout("Choice by this rule")).toBe("the small tree"); expect(readout("Reproducible?")).toMatch(/^yes/); });
});
