// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BayesPlayground, BinomialPlayground, ConditionalPlayground, EventsPlayground, GridPlayground, ThresholdPlayground } from "./prob-labs";
import { EVENTS2, STUDY, bayes, binomPmf, confusion, logLoss, mean, pEvent, pairsWhere, rng, studyTotals, variance } from "./prob-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getAllByText(name).find((n) => n.tagName === "DT")!.nextElementSibling!.textContent;

describe("every number quoted in the Probability lessons", () => {
  it("events: P(even) = 1/2, P(six) = 1/6, {5,6} = 1/3, complement of {1,2} = 4/6", () => { expect(pEvent([2, 4, 6])).toBe(0.5); expect(pEvent([6])).toBeCloseTo(1 / 6, 12); expect(pEvent([5, 6])).toBeCloseTo(1 / 3, 12); expect(1 - pEvent([1, 2])).toBeCloseTo(4 / 6, 12); });
  it("two dice: 36 pairs; sum 7 = 6; at least one six = 11 (= 36 − 25); both even = 9 = (1/2)(1/2); doubles = 6", () => {
    const n = (k: string) => pairsWhere(EVENTS2[k].test).length;
    expect(n("sum7")).toBe(6); expect(n("six")).toBe(11); expect(36 - 5 * 5).toBe(11); expect(n("even")).toBe(9); expect(9 / 36).toBe(0.5 * 0.5); expect(n("double")).toBe(6);
  });
  it("conditional: 200 students; P(pass)=0.45, P(pass|studied)=0.75, P(pass|not)=0.25", () => {
    const t = studyTotals(); expect(t).toEqual({ studied: 80, rest: 120, total: 200, pass: 90 });
    expect(t.pass / t.total).toBe(0.45); expect(STUDY.studiedPass / t.studied).toBe(0.75); expect(STUDY.restPass / t.rest).toBe(0.25);
  });
  it("bayes: 1% disease → 90 sick positives vs 891 healthy ones → 9.17%; 20% → 71.4%", () => {
    const a = bayes(0.01, 0.9, 0.09), b = bayes(0.2, 0.9, 0.09);
    expect(a.sick).toBe(100); expect(a.tp).toBeCloseTo(90, 9); expect(a.fp).toBeCloseTo(891, 9); expect(a.posterior).toBeCloseTo(90 / 981, 12); expect(a.posterior).toBeCloseTo(0.0917431, 6);
    expect(b.tp).toBeCloseTo(1800, 9); expect(b.fp).toBeCloseTo(720, 9); expect(b.posterior).toBeCloseTo(0.7142857, 6);
  });
  it("binomial: pmf(2,.5) = .25 .5 .25; 10 flips at .5 → mean 5, variance 2.5; at .3 → mean 3; sums to 1", () => {
    expect(binomPmf(2, 0.5)).toEqual([0.25, 0.5, 0.25]); const d = binomPmf(10, 0.5);
    expect(mean(d)).toBeCloseTo(5, 12); expect(variance(d)).toBeCloseTo(2.5, 12); expect(mean(binomPmf(10, 0.3))).toBeCloseTo(3, 12); expect(d.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
  });
  it("threshold: 0.5 → 4/1/1/4, precision .8, recall .8; 0.8 → 3/0/2/5; 0.3 → 5/3/0/2 (precision .625)", () => {
    expect(confusion(0.5)).toMatchObject({ tp: 4, fp: 1, fn: 1, tn: 4, precision: 0.8, recall: 0.8 });
    expect(confusion(0.8)).toMatchObject({ tp: 3, fp: 0, fn: 2, tn: 5, precision: 1, recall: 0.6 });
    expect(confusion(0.3)).toMatchObject({ tp: 5, fp: 3, fn: 0, tn: 2, precision: 0.625, recall: 1 }); expect(logLoss()).toBeGreaterThan(0);
  });
  it("the seeded generator repeats", () => { const a = rng(7), b = rng(7); expect([a(), a()]).toEqual([b(), b()]); });
});

describe("the playgrounds", () => {
  it("events: toggling faces updates P(event); rolling reports the share", () => {
    const done = vi.fn(); render(<EventsPlayground onDone={done} />); expect(readout("P(event)")).toBe("50%");
    fireEvent.click(screen.getByRole("button", { name: "2" })); expect(readout("P(event)")).toBe("33.3%"); expect(done).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Roll 1000" })); expect(readout("Rolled so far")).toBe("1000"); expect(readout("Share that landed in the event")).toMatch(/%$/);
  });
  it("grid: 11/36 for at least one six; switching the event changes the count", () => {
    render(<GridPlayground />); fireEvent.click(screen.getByRole("button", { name: "at least one six" })); expect(readout("Favourable pairs")).toBe("11");
    fireEvent.click(screen.getByRole("button", { name: "the sum is 7" })); expect(readout("Favourable pairs")).toBe("6");
  });
  it("conditional: the denominator changes with the condition", () => {
    const done = vi.fn(); render(<ConditionalPlayground onDone={done} />); expect(readout("Students in view (the denominator)")).toBe("200");
    fireEvent.click(screen.getByRole("button", { name: "Given: studied" })); expect(readout("Students in view (the denominator)")).toBe("80"); expect(readout("P(pass | studied)")).toBe("60/80 = 75%"); expect(done).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Given: did not study" })); expect(readout("P(pass | did not study)")).toBe("30/120 = 25%");
  });
  it("bayes: 1% prevalence gives 9.2%; the common-disease preset gives 71.4%", () => {
    render(<BayesPlayground />); expect(readout("Sick and positive")).toBe("90"); expect(readout("Healthy and positive")).toBe("891"); expect(readout("P(sick | positive)")).toBe("9.2%");
    fireEvent.click(screen.getByRole("button", { name: /Common disease/ })); expect(readout("P(sick | positive)")).toBe("71.4%");
  });
  it("distribution: mean 5 and variance 2.5; sampling shows a sample mean", () => {
    render(<BinomialPlayground />); expect(readout("Mean n·p")).toBe("5"); expect(readout("Variance n·p·(1−p)")).toBe("2.5"); expect(readout("Probabilities add to")).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Draw 200 samples" })); expect(Number(readout("Sample mean"))).toBeGreaterThan(4); expect(Number(readout("Sample mean"))).toBeLessThan(6);
  });
  it("threshold: 80% precision and recall at 0.5; cautious threshold trades recall for precision", () => {
    render(<ThresholdPlayground />); expect(readout("Precision")).toBe("80%"); expect(readout("Recall")).toBe("80%");
    fireEvent.click(screen.getByRole("button", { name: /cautious/ })); expect(readout("Precision")).toBe("100%"); expect(readout("Recall")).toBe("60%");
    fireEvent.click(screen.getByRole("button", { name: /Catch more/ })); expect(readout("Recall")).toBe("100%"); expect(readout("Precision")).toBe("63%");
  });
});
