// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AccuracyPlayground, CenterPlayground, CorrelationPlayground, DataPlayground, HistogramPlayground, SamplingPlayground, SpreadPlayground } from "./stat-labs";
import { BASE, PX, PY, SCORES30, TIGHT, WIDE, accuracyInterval, correlation, histogram, mean, median, quartiles, sampleMeans, slope, std, standardError, variance, withExtra } from "./stat-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getAllByText(name).find((n) => n.tagName === "DT")!.nextElementSibling!.textContent;
const slide = (label: string | RegExp, value: number) => fireEvent.change(screen.getByLabelText(label), { target: { value: String(value) } });

describe("every number quoted in the Statistics lessons", () => {
  it("centre: the base eight sum to 410; mean 73.33 and median 52 with a ₹250 lakh villa; 70 gives 53.33", () => {
    expect(BASE.reduce((a, b) => a + b, 0)).toBe(410); expect(mean(withExtra(250))).toBeCloseTo(660 / 9, 12); expect(median(withExtra(250))).toBe(52); expect(median(withExtra(70))).toBe(52); expect(mean(withExtra(70))).toBeCloseTo(480 / 9, 12); expect(median([1, 2, 3, 4])).toBe(2.5);
  });
  it("spread: tight variance 40/7 and sd 2.39; sample variance 40/6; wide sd 11.95", () => {
    expect(mean(TIGHT)).toBe(50); expect(mean(WIDE)).toBe(50); expect(variance(TIGHT)).toBeCloseTo(40 / 7, 12); expect(variance(TIGHT, true)).toBeCloseTo(40 / 6, 12); expect(std(TIGHT)).toBeCloseTo(2.3905, 4); expect(std(WIDE)).toBeCloseTo(11.9523, 4);
  });
  it("distributions: quartiles 56, 65.5, 75, IQR 19, no outliers; width-10 bins hold 1,2,6,9,7,3,2", () => {
    expect(quartiles(SCORES30)).toEqual({ q1: 56, q2: 65.5, q3: 75 }); expect(quartiles([1, 2, 3, 4, 5, 6, 7])).toEqual({ q1: 2, q2: 4, q3: 6 });
    expect(histogram(SCORES30, 10, 30)).toEqual([1, 2, 6, 9, 7, 3, 2]); for (const w of [2, 4, 5, 25, 40]) expect(histogram(SCORES30, w, 30).reduce((a, b) => a + b, 0)).toBe(30);
    expect(SCORES30.every((x) => x >= 56 - 28.5 && x <= 75 + 28.5)).toBe(true);
  });
  it("relationships: r is 1, −1 and −1/√5 for the examples; the base data is r ≈ 0.999 and a strange point lowers it", () => {
    expect(correlation([1, 2, 3, 4], [3, 5, 7, 9])).toBeCloseTo(1, 12); expect(correlation([1, 2, 3, 4], [9, 7, 5, 3])).toBeCloseTo(-1, 12); expect(correlation([1, 2, 3, 4], [2, 1, 2, 1])).toBeCloseTo(-1 / Math.sqrt(5), 12); expect(slope([1, 2, 3, 4], [3, 5, 7, 9])).toBeCloseTo(2, 12);
    expect(correlation(PX, PY)).toBeGreaterThan(0.998); expect(correlation([...PX, 1], [...PY, 120])).toBeLessThan(correlation(PX, PY) - 0.1);
  });
  it("sampling: SE 6 at n=25 and 3 at n=100; simulated spread follows; means centre on 70", () => {
    expect(standardError(30, 25)).toBe(6); expect(standardError(30, 100)).toBe(3);
    const m = sampleMeans(25, 2000), sd = std(m, true); expect(mean(m)).toBeGreaterThan(68.5); expect(mean(m)).toBeLessThan(71.5); expect(sd).toBeGreaterThan(5.2); expect(sd).toBeLessThan(6.8); expect(std(sampleMeans(100, 2000), true)).toBeLessThan(sd);
  });
  it("ML: 80 of 100 → 0.7216 to 0.8784; 1280 of 1600 → half-width 0.0196; clipped at 1", () => {
    const [lo, hi] = accuracyInterval(80, 100); expect(lo).toBeCloseTo(0.7216, 4); expect(hi).toBeCloseTo(0.8784, 4); const [a, b] = accuracyInterval(1280, 1600); expect((b - a) / 2).toBeCloseTo(0.0196, 4); expect(accuracyInterval(100, 100)).toEqual([1, 1]);
  });
});

describe("the playgrounds", () => {
  it("data: clicking a row or a column explains the difference; classification is checked", () => {
    const done = vi.fn(); render(<DataPlayground onDone={done} />); expect(readout("Observations (rows)")).toBe("8"); expect(readout("Numerical")).toBe("3");
    fireEvent.click(screen.getByRole("button", { name: "City" })); expect(document.body.textContent).toContain("is one variable"); expect(done).toHaveBeenCalled();
    const radios = screen.getAllByRole("radio"); fireEvent.click(radios[4]); expect(document.body.textContent).toContain("✗"); fireEvent.click(radios[5]); expect(document.body.textContent).toContain("✓");
  });
  it("centre: mean moves with the outlier, median does not", () => {
    const done = vi.fn(); render(<CenterPlayground onDone={done} />); expect(readout("Median")).toBe("52");
    fireEvent.click(screen.getByRole("button", { name: /luxury villa/ })); expect(readout("Mean")).toBe("73.33"); expect(readout("Median")).toBe("52"); expect(done).toHaveBeenCalled();
  });
  it("spread: tight sd 2.39; wide sd 11.95; sample variant divides by n − 1", () => {
    render(<SpreadPlayground />); expect(readout("Standard deviation")).toBe("2.39"); expect(readout("Variance")).toBe("5.71");
    fireEvent.click(screen.getByRole("button", { name: "Wide neighbourhood" })); expect(readout("Standard deviation")).toBe("11.95"); expect(readout("Range")).toBe("40");
    fireEvent.click(screen.getByRole("button", { name: /dividing by n − 1/ })); expect(readout("Variance")).toBe("166.67");
  });
  it("histogram: width 10 gives 7 bins and the five-number summary", () => {
    render(<HistogramPlayground />); expect(readout("Bins")).toBe("7"); expect(readout("Min · Q1 · Median · Q3 · Max")).toBe("35 · 56 · 65.5 · 75 · 98"); expect(readout("IQR")).toBe("19"); expect(readout("Possible outliers")).toBe("none");
    fireEvent.click(screen.getByRole("button", { name: /Too narrow/ })); expect(readout("Bins")).toBe("35"); fireEvent.click(screen.getByRole("button", { name: /Too wide/ })); expect(readout("Bins")).toBe("2");
  });
  it("correlation: r is very high, a strange point lowers it, removing it restores it", () => {
    render(<CorrelationPlayground />); const r0 = Number(readout("Correlation r"));
    fireEvent.click(screen.getByRole("button", { name: /strange point/ })); const r1 = Number(readout("Correlation r")); expect(r1).toBeLessThan(r0 - 0.1);
    fireEvent.click(screen.getByRole("button", { name: "Remove the extra point" })); expect(readout("Points")).toBe("10"); expect(Number(readout("Correlation r"))).toBeGreaterThanOrEqual(0.998);
  });
  it("sampling: drawing samples reports a mean near 70 and a spread near the standard error", () => {
    const done = vi.fn(); render(<SamplingPlayground onDone={done} />); expect(readout("Standard error σ/√n")).toBe("6");
    fireEvent.click(screen.getByRole("button", { name: "Draw 300 samples" })); expect(done).toHaveBeenCalled();
    expect(Math.abs(Number(readout("Mean of the sample means")) - 70)).toBeLessThan(2.5); expect(Math.abs(Number(readout("Spread of the sample means")) - 6)).toBeLessThan(1.5);
    slide(/Sample size n/, 100); expect(readout("Standard error σ/√n")).toBe("3");
  });
  it("accuracy: 80 of 100 gives ±7.8 points; more test data narrows it", () => {
    render(<AccuracyPlayground />); expect(readout("95% interval")).toBe("72.2% to 87.8%"); expect(readout("Standard error")).toBe("4%");
    fireEvent.click(screen.getByRole("button", { name: "1600 test examples" })); expect(readout("95% interval")).toBe("78% to 82%");
  });
});
