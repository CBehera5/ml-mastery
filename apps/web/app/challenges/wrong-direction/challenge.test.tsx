// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WrongDirectionChallenge } from "./challenge";

afterEach(cleanup);

const runBroken = () => fireEvent.click(screen.getByRole("button", { name: "Run broken update" }));

describe("Wrong Direction Challenge", () => {
  it("shows the broken update increasing loss", () => {
    render(<WrongDirectionChallenge />);
    runBroken();
    const result = screen.getByLabelText("Broken result");
    expect(result).toHaveTextContent("14.7456");
    expect(result).toHaveTextContent("Loss increased");
    expect(result).toHaveTextContent("0.88, 1.82");
  });

  it("validates the learner's operator selection from computed output", () => {
    render(<WrongDirectionChallenge />);
    runBroken();
    fireEvent.click(screen.getByLabelText(/parameter \+ η/));
    fireEvent.click(screen.getByRole("button", { name: "Validate fix" }));
    expect(screen.getByRole("status")).toHaveTextContent("bug is still present");

    fireEvent.click(screen.getByLabelText(/parameter − η/));
    fireEvent.click(screen.getByRole("button", { name: "Validate fix" }));
    expect(screen.getByRole("status")).toHaveTextContent("Fix verified");
    expect(screen.getByRole("status")).toHaveTextContent("4.6656");
    expect(screen.getByText(/Subtracting it moves parameters downhill/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share structured feedback" })).toHaveAttribute("href", "/beta/feedback");
    expect(screen.getByText(/records interest, not a purchase/)).toBeInTheDocument();
  });

  it("reveals hints progressively", () => {
    render(<WrongDirectionChallenge />);
    fireEvent.click(screen.getByRole("button", { name: "Show a hint" }));
    expect(screen.getByText(/Hint 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Hint 2/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next hint" }));
    expect(screen.getByText(/Hint 2/)).toBeInTheDocument();
  });

  it("resets progress, selection, hints, and results", () => {
    render(<WrongDirectionChallenge />);
    runBroken();
    fireEvent.click(screen.getByLabelText(/parameter − η/));
    fireEvent.click(screen.getByRole("button", { name: "Validate fix" }));
    fireEvent.click(screen.getByRole("button", { name: "Show a hint" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset challenge" }));
    expect(screen.queryByLabelText("Broken result")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/Hint 1/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/parameter − η/)).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Validate fix" })).toBeDisabled();
  });

  it("keeps the diagnosis locked until the experiment is run", () => {
    render(<WrongDirectionChallenge />);
    expect(screen.getByRole("group", { name: "Choose the update operator" })).toBeDisabled();
    expect(within(screen.getByLabelText("Challenge progress")).queryAllByText("✓")).toHaveLength(0);
  });
});
