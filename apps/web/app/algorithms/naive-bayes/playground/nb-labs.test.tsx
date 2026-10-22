// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ConfidencePlayground, DensityPlayground, EvidencePlayground, SmoothingPlayground } from "./nb-labs";
import { ALPHAS, GOOD_COUNTS, NEEDS_COUNTS, TOKENS, brier, gaussian, gaussianPosterior, logLoss, posterior, smoothed, wrongLeanPNeeds } from "./nb-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Naive Bayes lessons", () => {
  it("prior .6 with likelihoods .5 and .25 gives scores .30 and .10 and a 75% chance of Good", () => {
    const r = posterior(0.6, 0.5, 0.25); expect(r.good).toBeCloseTo(0.3, 12); expect(r.needs).toBeCloseTo(0.1, 12); expect(r.pGood).toBeCloseTo(0.75, 12);
    expect(posterior(0.1, 0.5, 0.25).pGood).toBeCloseTo(0.05 / 0.275, 12); expect(posterior(0.6, 0.4, 0.4).pGood).toBeCloseTo(0.6, 12);
  });
  it("smoothing: [2,0] with alpha 1 gives [3/4, 1/4]; with alpha 0 the unseen word is 0; alpha 1 gives 2/3 Good", () => {
    expect(smoothed([2, 0], 1)).toEqual([0.75, 0.25]); expect(smoothed(NEEDS_COUNTS, 0)[3]).toBe(0);
    const dep = TOKENS.indexOf("deprecated"); expect(posterior(0.5, smoothed(GOOD_COUNTS, 1)[dep], smoothed(NEEDS_COUNTS, 1)[dep]).pGood).toBeCloseTo(2 / 3, 12);
    expect(posterior(0.5, smoothed(GOOD_COUNTS, 0)[dep], smoothed(NEEDS_COUNTS, 0)[dep]).pGood).toBe(1);
    expect(ALPHAS).toEqual([0, 0.5, 1, 2]);
  });
  it("gaussian: peak 0.398942 for variance 1 and 3.989423 for variance 0.01; four copies lift 59% to 82%", () => {
    expect(gaussian(0, 0, 1)).toBeCloseTo(0.398942, 6); expect(gaussian(0, 0, 0.01)).toBeCloseTo(3.989423, 6);
    const G = { mean: -0.5, variance: 1 }, N = { mean: 1, variance: 1 };
    expect(gaussianPosterior(0, 1, G, N).pGood).toBeCloseTo(0.5926, 3); expect(gaussianPosterior(0, 4, G, N).pGood).toBeCloseTo(0.8174, 3);
  });
  it("confidence: one copy gives the truth 10%; log loss 2.31 at one copy and 17.6 at eight; Brier stays below 1", () => {
    expect(wrongLeanPNeeds(1)).toBeCloseTo(0.0998, 3); expect(logLoss(wrongLeanPNeeds(1))).toBeCloseTo(2.305, 2); expect(logLoss(wrongLeanPNeeds(8))).toBeCloseTo(17.6, 1); expect(brier(wrongLeanPNeeds(8), 1)).toBeLessThan(1);
  });
});

describe("the playgrounds", () => {
  it("evidence: the worked example reads 75% and the rare-class preset lowers it", () => {
    render(<EvidencePlayground />); expect(readout("Chance the page is Good")).toBe("75%");
    fireEvent.click(screen.getByRole("button", { name: "Good pages are rare" })); expect(readout("Chance the page is Good")).toBe("18.2%");
  });
  it("smoothing: no smoothing shows 0% and a certain Good verdict", () => {
    render(<SmoothingPlayground />); expect(readout("Chance of “deprecated” in Needs Improvement")).toBe("7.1%");
    fireEvent.click(screen.getByRole("button", { name: "No smoothing" })); expect(readout("Chance of “deprecated” in Needs Improvement")).toBe("0%"); expect(readout("Page containing only “deprecated” is Good")).toBe("100%");
  });
  it("density and confidence: copies change the posterior and the log loss", () => {
    const { unmount } = render(<DensityPlayground />); const before = readout("Chance the page is Good");
    fireEvent.click(screen.getByRole("button", { name: "Count it four times" })); expect(readout("Chance the page is Good")).not.toBe(before); unmount();
    render(<ConfidencePlayground />); expect(readout("Log loss")).toBe("2.31"); fireEvent.click(screen.getByRole("button", { name: "Four times" })); expect(Number(readout("Log loss"))).toBeGreaterThan(8);
  });
});
