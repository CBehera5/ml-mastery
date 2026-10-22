// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import LinearRegressionOverview from "./page";

afterEach(cleanup);

describe("linear regression overview", () => {
  it("presents the full pathway as independently accessible lessons", () => {
    render(<LinearRegressionOverview />);
    expect(screen.getByRole("heading", { name: /understand linear regression/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /open lesson/i })).toHaveLength(9);
    expect(screen.getByRole("link", { name: /start lesson 1/i })).toHaveAttribute("href", "/learn/linear-regression/why");
  });

  it("links existing foundations without making them route gates", () => {
    render(<LinearRegressionOverview />);
    expect(screen.getByText("Recommended, not locked")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /functions and graphs/i })).toHaveAttribute("href", "/math/functions-derivatives");
    expect(screen.getByRole("link", { name: /derivatives and gradients/i })).toHaveAttribute("href", "/math/derivatives");
    expect(screen.getByRole("heading", { name: "Completion and mastery are separate." })).toBeInTheDocument();
    expect(screen.getByText(/Nine lessons, from first estimate to independent practice/)).toBeInTheDocument();
    expect(screen.queryByText(/mastery remains unavailable/i)).not.toBeInTheDocument();
  });
});
