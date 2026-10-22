// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MathFoundationsPage from "./page";

describe("Math Foundations hub", () => {
  it("presents implemented subjects as independent entry points", () => {
    render(<MathFoundationsPage />);
    expect(screen.getByRole("heading", { name: /make the mathematics\s*mean something/i })).toBeInTheDocument();
    for (const [name, href] of [
      ["Open algebra & functions", "/math/algebra-functions"],
      ["Open linear algebra", "/math/linear-algebra"],
      ["Open calculus", "/math/derivatives"],
      ["Open probability", "/math/probability"],
      ["Open statistics", "/math/statistics"],
      ["Open optimization", "/math/optimization"],
      ["Open Math integration practice →", "/math/integration"],
    ]) expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    expect(screen.getByText("Probability")).toBeInTheDocument();
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Optimization")).toBeInTheDocument();
    expect(screen.queryByText("Not yet available")).not.toBeInTheDocument();
  });
});
