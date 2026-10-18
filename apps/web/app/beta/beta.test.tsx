// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readSessionEvents } from "../lib/analytics";
import { FeedbackForm } from "./feedback/feedback-form";
import { BetaWelcome } from "./welcome";

beforeEach(() => window.sessionStorage.clear());
afterEach(cleanup);

describe("private beta flow", () => {
  it("introduces the complete path with direct route navigation", () => {
    render(<BetaWelcome />);
    expect(screen.getByRole("heading", { name: /See the math/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start the Neural Network X-Ray/ })).toHaveAttribute("href", "/demo");
    fireEvent.click(screen.getByText("Browse topics", { selector: "summary" }));
    expect(screen.getByRole("link", { name: "Math foundations" })).toHaveAttribute("href", "/math");
    expect(screen.getByRole("link", { name: /Open the challenge/ })).toHaveAttribute("href", "/challenges/wrong-direction");
    expect(screen.getByRole("link", { name: /Preview feedback/ })).toHaveAttribute("href", "/beta/feedback");
    expect(readSessionEvents().some(({ event }) => event === "beta_started")).toBe(true);
  });

  it("renders the anonymous structured questionnaire", () => {
    render(<FeedbackForm />);
    expect(screen.getByRole("group", { name: /ML experience/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/easy was the experience/)).toBeRequired();
    expect(screen.getByText(/complete learning kit at \$39/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(readSessionEvents().some(({ event }) => event === "feedback_opened")).toBe(true);
  });

  it("keeps an unconfigured local feedback submission on-device", () => {
    render(<FeedbackForm />);
    const form = screen.getByRole("button", { name: /Submit beta feedback/ }).closest("form");
    fireEvent.submit(form!);
    expect(screen.getByRole("status")).toHaveTextContent("not connected in this local preview");
  });
});
