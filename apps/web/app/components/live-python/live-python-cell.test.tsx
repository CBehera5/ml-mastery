// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LivePythonCell } from "./live-python-cell";
import { LossCurve } from "./loss-curve";
import type { PythonRuntime } from "./client";
import type { RunRequest, RunResult } from "./engine";

afterEach(cleanup);
const result = (over: Partial<RunResult> = {}): RunResult => ({ stdout: "hello\n", error: null, values: {}, checks: null, ...over });
const fake = (impl: (r: RunRequest) => RunResult | Promise<RunResult>): PythonRuntime & { run: ReturnType<typeof vi.fn> } => ({ run: vi.fn(async (r: RunRequest) => impl(r)) });

describe("LivePythonCell", () => {
  it("runs the editor's current code and shows output, labelled for assistive tech", async () => {
    const runtime = fake(() => result());
    render(<LivePythonCell title="Demo" starter="print('hi')" runtime={runtime} />);
    fireEvent.change(screen.getByLabelText("Python code (editable)"), { target: { value: "print('edited')" } });
    fireEvent.click(screen.getByRole("button", { name: "▶ Run code" }));
    await waitFor(() => expect(screen.getByLabelText("Program output")).toHaveTextContent("hello"));
    expect(runtime.run).toHaveBeenCalledWith({ code: "print('edited')", expose: undefined, checks: undefined });
    expect(screen.getByRole("status")).toHaveTextContent("Ran without errors.");
  });

  it("runs on Ctrl+Enter without trapping the Tab key", async () => {
    const runtime = fake(() => result());
    render(<LivePythonCell title="Demo" starter="x=1" runtime={runtime} />);
    const editor = screen.getByLabelText("Python code (editable)");
    expect(fireEvent.keyDown(editor, { key: "Tab" })).toBe(true); // not prevented → focus can leave
    fireEvent.keyDown(editor, { key: "Enter", ctrlKey: true });
    await waitFor(() => expect(runtime.run).toHaveBeenCalledTimes(1));
  });

  it("shows a Python error in the status region and keeps the learner's code", async () => {
    render(<LivePythonCell title="Demo" starter="oops" runtime={fake(() => result({ stdout: "", error: "NameError: name 'oops' is not defined (line 1)" }))} />);
    fireEvent.click(screen.getByRole("button", { name: "▶ Run code" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("NameError: name 'oops' is not defined (line 1)"));
    expect(screen.getByLabelText("Python code (editable)")).toHaveValue("oops");
  });

  it("explains runtime failures (timeouts, no worker) instead of hanging", async () => {
    const runtime: PythonRuntime = { run: vi.fn().mockRejectedValue(new Error("Your code ran for more than 8 seconds, so Python was stopped.")) };
    render(<LivePythonCell title="Demo" starter="while True: pass" runtime={runtime} />);
    fireEvent.click(screen.getByRole("button", { name: "▶ Run code" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("ran for more than 8 seconds"));
    expect(screen.getByRole("button", { name: "▶ Run code" })).toBeEnabled();
  });

  it("disables controls while running and ignores a second run", async () => {
    let release!: (r: RunResult) => void;
    const runtime = fake(() => new Promise<RunResult>((resolve) => { release = resolve; }));
    render(<LivePythonCell title="Demo" starter="x=1" runtime={runtime} />);
    fireEvent.click(screen.getByRole("button", { name: "▶ Run code" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "▶ Run code" })).toBeDisabled());
    expect(screen.getByRole("status")).toHaveTextContent(/Starting Python/);
    fireEvent.click(screen.getByRole("button", { name: "▶ Run code" }));
    release(result());
    await waitFor(() => expect(screen.getByRole("button", { name: "▶ Run code" })).toBeEnabled());
    expect(runtime.run).toHaveBeenCalledTimes(1);
  });

  it("reports check results with hints only for failures, and fires onAllChecksPassed only when all pass", async () => {
    const onAll = vi.fn();
    const outcomes: RunResult[] = [
      result({ checks: [{ name: "A", passed: true, hint: "" }, { name: "B", passed: false, hint: "Try subtracting." }] }),
      result({ checks: [{ name: "A", passed: true, hint: "" }, { name: "B", passed: true, hint: "" }] }),
    ];
    const runtime = fake(() => outcomes.shift()!);
    render(<LivePythonCell title="Demo" starter="x=1" checks="results=[]" runtime={runtime} onAllChecksPassed={onAll} />);
    fireEvent.click(screen.getByRole("button", { name: "✓ Check my code" }));
    await waitFor(() => expect(screen.getByLabelText("Check results")).toBeInTheDocument());
    expect(screen.getByText("Try subtracting.")).toBeInTheDocument();
    expect(onAll).not.toHaveBeenCalled();
    expect(runtime.run.mock.calls[0][0].checks).toBe("results=[]");
    fireEvent.click(screen.getByRole("button", { name: "✓ Check my code" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("All 2 checks passed."));
    expect(onAll).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Try subtracting.")).not.toBeInTheDocument();
  });

  it("applies quick experiments to the code and runs them; reset restores the starter; solution is opt-in", async () => {
    const runtime = fake(() => result());
    render(<LivePythonCell title="Demo" starter="lr = 0.01" solution="lr = 0.01  # done" presets={[{ label: "big", apply: (c) => c.replace("0.01", "0.1") }]} runtime={runtime} />);
    fireEvent.click(screen.getByRole("button", { name: "big" }));
    await waitFor(() => expect(runtime.run).toHaveBeenCalledWith(expect.objectContaining({ code: "lr = 0.1" })));
    expect(screen.getByLabelText("Python code (editable)")).toHaveValue("lr = 0.1");
    fireEvent.click(screen.getByRole("button", { name: "Reset to starter" }));
    expect(screen.getByLabelText("Python code (editable)")).toHaveValue("lr = 0.01");
    const details = screen.getByText(/Stuck\? Show a worked solution/).closest("details")!;
    expect(details).not.toHaveAttribute("open");
    fireEvent.click(within(details).getByRole("button", { name: "Copy solution into the editor" }));
    expect(screen.getByLabelText("Python code (editable)")).toHaveValue("lr = 0.01  # done");
  });

  it("states that it does not touch saved progress", () => {
    localStorage.setItem("probe", "kept");
    render(<LivePythonCell title="Demo" starter="x=1" runtime={fake(() => result())} />);
    expect(screen.getByText(/nothing here changes your saved progress/i)).toBeInTheDocument();
    expect(localStorage.getItem("probe")).toBe("kept");
  });
});

describe("LossCurve", () => {
  it("gives a text equivalent of the chart, including when the loss rose", () => {
    render(<LossCurve values={[100, 40, 60, 150]} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", expect.stringContaining("at least one step made the loss go up"));
    render(<LossCurve values={[100, 50, 25]} title="Smooth" />);
    expect(screen.getAllByRole("img")[1]).toHaveAttribute("aria-label", "Smooth: starts at 100, ends at 25 after 2 steps; every step lowered the loss.");
  });
  it("falls back gracefully for missing or non-numeric data and disables log scale for non-positive values", () => {
    render(<LossCurve values={undefined} />);
    expect(screen.getByText("Run the code to draw the loss curve.")).toBeInTheDocument();
    cleanup();
    render(<LossCurve values={[0, 1, 2]} />);
    expect(screen.getByRole("checkbox", { name: /Log scale/ })).toBeDisabled();
  });
});
