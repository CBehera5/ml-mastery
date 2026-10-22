// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { UpdatesPlayground, StabilityPlayground, GeometryPlayground, RegularizationPlayground, ResponsiblePlayground } from "./optimization-labs";
import { behaviour, bowl, closedForm1, descend1, descendBowl, loss1, ridgeFit, ridgeLoss, stableLimit } from "./descent";
import { TRAIN_X, TRAIN_Y, VAL_X, VAL_Y, polyFit, polyMse } from "./poly";

afterEach(cleanup);
const readout = (name: string) => screen.getByText(name).nextElementSibling!.textContent;

describe("every number quoted in the Optimization lessons", () => {
  it("updates: w 1 -> 1.4, loss 4 -> 2.56, closed form matches the loop", () => {
    const p = descend1(1, 0.1, 1);
    expect(p[1]).toBeCloseTo(1.4, 12); expect(loss1(1)).toBe(4); expect(loss1(p[1])).toBeCloseTo(2.56, 12);
    for (const [w0, lr, k] of [[1, 0.1, 5], [6, 0.3, 9], [-2, 0.45, 12]] as const) expect(descend1(w0, lr, k)[k]).toBeCloseTo(closedForm1(w0, lr, k), 9);
    expect(descend1(1, 0.5, 1)[1]).toBe(3);
    expect(descend1(1, 0.1, 5)[5]).toBeCloseTo(2.34464, 4);
  });
  it("stability: rate 1 bounces 1,5,1; rate 1.1 grows to 5.4 and loss 5.76", () => {
    expect(descend1(1, 1, 4)).toEqual([1, 5, 1, 5, 1]);
    const g = descend1(1, 1.1, 3); expect(g[1]).toBeCloseTo(5.4, 12); expect(g[2]).toBeCloseTo(0.12, 12); expect(Math.abs(g[3] - 3)).toBeCloseTo(3.456, 9); expect(loss1(g[1])).toBeCloseTo(5.76, 12);
    expect([behaviour(0.1), behaviour(1), behaviour(1.1)]).toEqual(["converging", "oscillating", "diverging"]);
  });
  it("geometry: k=10 gradient (-4, 20), step at 0.05 lands b on 0, 0.1 flips b", () => {
    const p = descendBowl(1, 1, 10, 0.05, 1)[1]; expect(p[0]).toBeCloseTo(1.2, 12); expect(p[1]).toBeCloseTo(0, 12);
    expect(descendBowl(1, 1, 10, 0.1, 1)[1][1]).toBeCloseTo(-1, 12);
    expect(bowl(1, 1, 10)).toBe(14); expect(stableLimit(10)).toBeCloseTo(0.1, 12);
    expect(Math.abs(descendBowl(1, 1, 10, 0.12, 30)[30][1])).toBeGreaterThan(1);
  });
  it("regularization: slope 45.46 -> 28.29 at lambda 1; misses 1.2 -> 486.9; penalty 800.5", () => {
    expect(ridgeFit(0)[0]).toBeCloseTo(45.461, 3); expect(ridgeFit(1)[0]).toBeCloseTo(28.293, 3);
    expect(ridgeLoss(0).mse).toBeCloseTo(1.1845, 3); expect(ridgeLoss(1).mse).toBeCloseTo(486.91, 2); expect(ridgeLoss(1).penalty).toBeCloseTo(800.51, 2);
  });
  it("responsible: degree 1 train 0.0702 val 0.0171; degree 5 train 0 val 0.2992", () => {
    const e = (d: number) => { const c = polyFit(TRAIN_X, TRAIN_Y, d); return [polyMse(c, TRAIN_X, TRAIN_Y), polyMse(c, VAL_X, VAL_Y)]; };
    expect(e(1)[0]).toBeCloseTo(0.0702, 4); expect(e(1)[1]).toBeCloseTo(0.0171, 4);
    expect(e(5)[0]).toBeLessThan(1e-9); expect(e(5)[1]).toBeCloseTo(0.2992, 4);
    expect([1, 2, 3, 4, 5].map((d) => e(d)[1]).indexOf(Math.min(...[1, 2, 3, 4, 5].map((d) => e(d)[1])))).toBe(0);
  });
});

describe("the playgrounds", () => {
  it("updates: one step reads the quoted numbers; more steps keep lowering the loss", () => {
    render(<UpdatesPlayground />);
    expect(readout("w now")).toBe("1.4"); expect(readout("Loss now")).toBe("2.56");
    fireEvent.click(screen.getByRole("button", { name: "One more step" })); expect(Number(readout("Loss now"))).toBeLessThan(2.56);
  });
  it("stability: names the behaviour for each preset", () => {
    render(<StabilityPlayground />);
    expect(readout("Behaviour")).toBe("oscillating");
    fireEvent.click(screen.getByRole("button", { name: "Rate 1.1" })); expect(readout("Behaviour")).toBe("diverging");
    fireEvent.click(screen.getByRole("button", { name: "Rate 0.1" })); expect(readout("Behaviour")).toBe("converging");
  });
  it("geometry: shows the gradient (-4, 20) and the safe limit; the safe-step button lowers the rate under it", () => {
    render(<GeometryPlayground />);
    expect(readout("Gradient at start")).toBe("(-4, 20)"); expect(readout("Safe step limit")).toBe("0.1");
    fireEvent.click(screen.getByRole("button", { name: /safe step/i })); expect(screen.getByText(/is inside that limit/)).toBeTruthy();
  });
  it("regularization: slope falls as lambda rises, and reset restores plain least squares", () => {
    render(<RegularizationPlayground />);
    const before = Number(readout("Slope w"));
    fireEvent.click(screen.getByRole("button", { name: /No penalty/ })); expect(Number(readout("Slope w"))).toBeGreaterThan(before); expect(readout("Slope w")).toBe("45.46");
  });
  it("responsible: validation prefers degree 1 while training error prefers 5", () => {
    render(<ResponsiblePlayground />);
    expect(readout("Validation prefers")).toBe("degree 1");
    fireEvent.click(screen.getByRole("button", { name: /validation prefers/i })); expect(readout("Held-back error")).toBe("0.0171");
  });
});
