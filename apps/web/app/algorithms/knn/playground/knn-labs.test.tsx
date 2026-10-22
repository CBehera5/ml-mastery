// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ChooseKPlayground, K_CHOICES, LimitsPlayground, NeighborsPlayground, ScalePlayground } from "./knn-labs";
import { CUSTOMERS, NOISY_TRAIN, NOISY_VALID, RARE_TEST, RARE_TRAIN, accuracyOn, confusion, rank, standardise, toZ, vote, type Point } from "./knn-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getByText(name).nextElementSibling!.textContent;
const raw = CUSTOMERS.map<Point>(c => [c.bill, c.contacts]), hundreds = CUSTOMERS.map<Point>(c => [c.bill / 100, c.contacts]);

describe("every number quoted in the KNN playground lessons", () => {
  it("close call at ₹750 and 0 contacts: k = 1 churns (N); k = 3 stays (N, E, C); k = 5 churns", () => {
    const ranked = rank(CUSTOMERS, hundreds, [7.5, 0]);
    expect(ranked.slice(0, 5).map(i => i.customer.id)).toEqual(["N", "E", "C", "K", "H"]);
    expect([1, 3, 5, 7].map(k => vote(ranked, k).prediction)).toEqual([1, 0, 1, 0]);
  });
  it("raw ₹ units give M, C, F; standardised units give L, J, M for ₹450 and 5 contacts", () => {
    expect(vote(rank(CUSTOMERS, raw, [450, 5]), 3).chosen.map(i => i.customer.id)).toEqual(["M", "C", "F"]);
    const sc = standardise(CUSTOMERS), z = CUSTOMERS.map<Point>(c => toZ(sc, c.bill, c.contacts));
    const scaled = vote(rank(CUSTOMERS, z, toZ(sc, 450, 5)), 3);
    expect(scaled.chosen.map(i => i.customer.id)).toEqual(["L", "J", "M"]); expect(scaled.prediction).toBe(1);
  });
});

describe("lessons 3 and 4 quote real numbers", () => {
  it("k = 1 is 92% on seen and 57.5% on unseen customers; the best unseen k is 3 at 69%", () => {
    expect(accuracyOn(NOISY_TRAIN, NOISY_TRAIN, 1)).toBeCloseTo(0.9167, 3); expect(accuracyOn(NOISY_TRAIN, NOISY_VALID, 1)).toBeCloseTo(0.575, 3);
    const unseen = K_CHOICES.map(k => accuracyOn(NOISY_TRAIN, NOISY_VALID, k)), best = Math.max(...unseen);
    expect(K_CHOICES[unseen.indexOf(best)]).toBe(3); expect(best).toBeCloseTo(0.6875, 3);
  });
  it("14 of 80 left; k = 5 catches 11; always-stays is 82.5% accurate with zero recall", () => {
    expect(RARE_TEST.filter(r => r[2]).length).toBe(14); expect(RARE_TEST.length).toBe(80);
    expect(confusion(RARE_TRAIN, RARE_TEST, 5)).toMatchObject({ tp: 11, fn: 3, fp: 0, tn: 66 });
    expect(confusion(RARE_TRAIN, RARE_TEST, "always-stay")).toMatchObject({ accuracy: 0.825, recall: 0 });
  });
});

describe("the playgrounds", () => {
  it("choose k: the gap closes as k grows and the shortcut finds the best k", () => {
    render(<ChooseKPlayground />);
    expect(readout("Right on seen customers")).toBe("92%"); expect(readout("Right on unseen customers")).toBe("57%");
    fireEvent.click(screen.getByRole("button", { name: "Best on unseen customers" }));
    expect(readout("Right on unseen customers")).toBe("69%");
  });
  it("limits: the baseline finds no leavers; k = 5 finds 11", () => {
    render(<LimitsPlayground />);
    expect(readout("Recall of leavers")).toBe("79%"); expect(readout("Missed leavers")).toBe("3");
    fireEvent.click(screen.getByRole("button", { name: /Predict .stays. for everyone/ }));
    expect(readout("Recall of leavers")).toBe("0%"); expect(readout("Accuracy")).toBe("82.5%");
  });
  it("neighbors: the readout follows k and the presets", () => {
    render(<NeighborsPlayground />);
    expect(readout("Nearest, in order")).toMatch(/^N \(/); expect(readout("Prediction")).toBe("will stay");
    fireEvent.change(screen.getByLabelText(/Neighbors k/), { target: { value: "1" } });
    expect(readout("Prediction")).toBe("will churn");
    fireEvent.click(screen.getByRole("button", { name: "Clearly a leaver" }));
    expect(readout("Votes")).toMatch(/churn/);
  });
  it("scale: the ruler changes the neighbors and the toggle redraws", () => {
    render(<ScalePlayground />);
    expect(readout("Raw neighbors (k = 3)")).toBe("M, C, F"); expect(readout("Standardised neighbors")).toBe("L, J, M");
    expect(readout("Predictions")).toMatch(/the ruler changed the answer/);
    fireEvent.click(screen.getByRole("button", { name: "Standardise both features" }));
    expect(screen.getByRole("button", { name: "Show raw units" })).toBeTruthy();
  });
});
