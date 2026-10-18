// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fixture from "../../../../../packages/math-contracts/fixtures/dot-product.v1.json";
import { dotProductTrace, type DotProductInput } from "../../../../../packages/math-runtime/src";
import { VectorsDotProductLesson } from "./vectors-dot-product";

afterEach(cleanup);

const completeStageAndNext = (action: () => void) => {
  action();
  fireEvent.click(screen.getByRole("button", { name: "Next stage" }));
};

describe("Vectors and Dot Products lesson", () => {
  it("renders the house-score problem and verified baseline", () => {
    render(<VectorsDotProductLesson />);
    expect(screen.getByRole("heading", { name: /Vectors turn many features/ })).toBeInTheDocument();
    expect(screen.getByText("x = [2, 3, 4]")).toBeInTheDocument();
  });

  it("reactively calculates contributions through the runtime", () => {
    render(<VectorsDotProductLesson />);
    completeStageAndNext(() => fireEvent.click(screen.getByRole("button", { name: /identify the two vectors/ })));
    expect(screen.getByTestId("dot-product")).toHaveTextContent("28");
    fireEvent.change(screen.getByLabelText("Normalized house size feature"), { target: { value: "4" } });
    expect(screen.getByTestId("dot-product")).toHaveTextContent("38");
    expect(screen.getByText("4 × 5 = 20")).toBeInTheDocument();
  });

  it("requires demonstrated actions and verifies the ordering fix", () => {
    render(<VectorsDotProductLesson />);
    completeStageAndNext(() => fireEvent.click(screen.getByRole("button", { name: /identify the two vectors/ })));
    completeStageAndNext(() => fireEvent.change(screen.getByLabelText("Bedrooms weight"), { target: { value: "3" } }));
    completeStageAndNext(() => fireEvent.click(screen.getByRole("button", { name: "2 × 5 = 10" })));
    completeStageAndNext(() => fireEvent.click(screen.getByRole("button", { name: /Copy NumPy exercise/ })));
    expect(screen.getByText("31")).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("region", { name: "Existing five-stage house lab" })).getByLabelText(/Restore the documented feature order/));
    fireEvent.click(screen.getByRole("button", { name: "Verify fix" }));
    expect(within(screen.getByRole("region", { name: "Existing five-stage house lab" })).getByRole("status")).toHaveTextContent("Fix verified");
    expect(screen.getByRole("heading", { name: "One vector, four representations." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Next: Matrices/ })).toHaveAttribute("href", "/math/matrices-multiplication");
  });

  it("matches every Python-generated dot-product fixture", () => {
    fixture.cases.forEach((testCase) => expect(dotProductTrace(testCase.input as DotProductInput)).toEqual(testCase.trace));
  });
});
