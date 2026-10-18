// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MathFoundationsPage from "./page";

describe("Math Foundations hub", () => {
  it("presents implemented subjects as independent entry points", () => {
    render(<MathFoundationsPage />);
    expect(screen.getByRole("heading", { name: /mathematics you need/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Open subject/i })).toHaveLength(7);
    expect(screen.getByText("Probability")).toBeInTheDocument();
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Optimization")).toBeInTheDocument();
    expect(screen.queryByText("Not yet available")).not.toBeInTheDocument();
  });
});
