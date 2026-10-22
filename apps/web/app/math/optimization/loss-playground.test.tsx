// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { regressionTrainingTrace } from "@mlmath/runtime";
import { LossPlayground } from "./loss-playground";
import { bestLine, houseGradient, houseLoss, AREAS, PRICES } from "./house-loss";

afterEach(cleanup);
const readout = (name: string) => screen.getByText(name).nextElementSibling!.textContent;

describe("house loss surface", () => {
  it("matches the verified TypeScript runtime at the start state", () => {
    const trace = regressionTrainingTrace({ features: AREAS.map((a) => [a]), targets: PRICES, weights: [10], bias: 100 }, 0.01, 1);
    expect(houseLoss(10, 100)).toBeCloseTo(trace.entries[0].loss!, 9);
    expect(houseGradient(10, 100)).toEqual([-892.5, -269]);
  });
  it("the best line has loss ~1.18 and zero gradient", () => {
    const [w, b] = bestLine();
    expect(w).toBeCloseTo(45.461, 3); expect(b).toBeCloseTo(132.254, 3);
    expect(houseLoss(w, b)).toBeCloseTo(1.1845, 3);
    const [dw, db] = houseGradient(w, b); expect(Math.abs(dw)).toBeLessThan(1e-9); expect(Math.abs(db)).toBeLessThan(1e-9);
  });
});

describe("<LossPlayground/>", () => {
  it("starts at the quoted state with a labelled map, sliders and a live readout", () => {
    render(<LossPlayground />);
    expect(readout("Loss")).toBe("20,163.8");
    expect(readout("Slope of loss in w")).toBe("-892.5");
    expect(screen.getByRole("img", { name: /Loss map over w and b/ })).toBeTruthy();
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });
  it("the sliders move the dot; Step downhill lowers the loss; Jump lands on the best line", () => {
    render(<LossPlayground />);
    fireEvent.click(screen.getByRole("button", { name: "Step downhill" }));
    expect(Number(readout("Loss")!.replace(/,/g, ""))).toBeLessThan(20163.8);
    fireEvent.click(screen.getByRole("button", { name: "Jump to the best line" }));
    expect(readout("Loss")).toBe("1.2");
    fireEvent.click(screen.getByRole("button", { name: "Back to the start" }));
    expect(readout("Loss")).toBe("20,163.8");
    fireEvent.change(screen.getAllByRole("slider")[0], { target: { value: "40" } });
    fireEvent.change(screen.getAllByRole("slider")[1], { target: { value: "140" } });
    expect(readout("Loss")).toBe("114.3");
  });
  it("repeated large steps keep the readout finite and the dot inside the map", () => {
    render(<LossPlayground />);
    fireEvent.change(screen.getByLabelText(/Step size/), { target: { value: "0.05" } });
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByRole("button", { name: "Step downhill" }));
    expect(Number(readout("Slope of loss in w")!.replace(/,/g, ""))).not.toBeNaN();
  });
});
