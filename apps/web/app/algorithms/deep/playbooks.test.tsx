// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PLAYBOOKS } from "./playbooks";
import { PlaybookPage, PLAYBOOK_NAMES } from "../playbook/playbook-page";
import { niceTicks } from "../../math/teaching/deep-figure";
afterEach(cleanup);

describe("algorithm playbooks", () => {
  it("has one playbook for every algorithm page", () => expect(Object.keys(PLAYBOOKS).sort()).toEqual(Object.keys(PLAYBOOK_NAMES).sort()));
  for (const [slug, lesson] of Object.entries(PLAYBOOKS)) {
    it(`${slug}: seven parts with steps, runnable code, a picture, a decision table and a check`, () => {
      expect(lesson.sections).toHaveLength(7);
      const blocks = lesson.sections.flatMap((s) => s.blocks);
      expect(blocks.filter((b) => b.kind === "steps").length).toBeGreaterThanOrEqual(2);
      expect(blocks.filter((b) => b.kind === "code").length).toBeGreaterThanOrEqual(3);
      expect(blocks.filter((b) => b.kind === "figure").length).toBeGreaterThanOrEqual(1);
      expect(blocks.filter((b) => b.kind === "table").length).toBeGreaterThanOrEqual(2);
      expect(blocks.some((b) => b.kind === "check")).toBe(true);
      expect(lesson.minutes).toBeGreaterThanOrEqual(10);
    });
  }
  it("renders a playbook page with its picture described for screen readers", () => {
    render(<PlaybookPage slug="linear-regression" />);
    expect(screen.getByRole("heading", { level: 1, name: /Linear Regression: how to build it/ })).toBeTruthy();
    expect(screen.getAllByRole("img").some((i) => /fitted straight line/.test(i.getAttribute("aria-label") ?? ""))).toBe(true);
    expect(screen.getByText("Check yourself")).toBeTruthy();
  });
  it("chooses round axis ticks", () => {
    expect(niceTicks(0, 100)).toEqual([0, 20, 40, 60, 80, 100]);
    expect(niceTicks(0.2, 0.9)[0]).toBeCloseTo(0.2);
  });
});
