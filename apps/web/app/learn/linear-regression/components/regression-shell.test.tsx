// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { REGRESSION_LESSONS } from "../curriculum";
import { RegressionShell } from "./regression-shell";

afterEach(cleanup);

describe("linear regression lesson shell", () => {
  it("keeps navigation open and completion claims separate from route visits", () => {
    render(<RegressionShell lesson={REGRESSION_LESSONS[3]} />);
    expect(screen.getByRole("link", { name: "Skip to lesson content" })).toHaveAttribute("href", "#regression-lesson-content");
    expect(document.getElementById("regression-lesson-content")).toHaveAttribute("tabindex", "-1");
    const lessonNav = screen.getByRole("navigation", { name: /linear regression lessons/i });
    expect(lessonNav.querySelectorAll("a")).toHaveLength(9);
    expect(within(lessonNav).getByRole("link", { name: /gradient descent/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Not counted as completion")).toBeInTheDocument();
    expect(screen.getByText(/require observable learner evidence/i)).toBeInTheDocument();
    expect(within(lessonNav).getByRole("link", { name: /multiple features/i })).toHaveAttribute("href", "/learn/linear-regression/multiple-features");
  });
});
