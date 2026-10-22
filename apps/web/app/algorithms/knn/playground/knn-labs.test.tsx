// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NeighborsPlayground, ScalePlayground } from "./knn-labs";
import { CUSTOMERS, rank, standardise, toZ, vote, type Point } from "./knn-math";

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

describe("the playgrounds", () => {
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
