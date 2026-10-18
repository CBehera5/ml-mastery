// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FunctionsDerivativesLesson } from "./functions-derivatives/lesson";
import { lessonProgressKey, useLessonProgress } from "./lesson-progress";

function Probe({ id }: { id: string }) {
  const { progress, setProgress, resetLessonProgress, storageError } = useLessonProgress(id, 2);
  return <><output aria-label={`${id} progress`}>{progress.map(Number).join("")}</output><output aria-label="storage error">{String(storageError)}</output><button onClick={() => setProgress([true, false])}>Complete first</button><button onClick={resetLessonProgress}>Reset this lesson</button></>;
}

beforeEach(() => localStorage.clear());
afterEach(()=>{cleanup();vi.restoreAllMocks();});

describe("independent lesson progress", () => {
  it("continues in memory when reads are denied",()=>{
    vi.spyOn(Storage.prototype,"getItem").mockImplementation(()=>{throw new Error("denied");});
    render(<Probe id="calculus"/>);
    expect(screen.getByLabelText("storage error")).toHaveTextContent("true");
    fireEvent.click(screen.getByRole("button",{name:"Complete first"}));
    expect(screen.getByLabelText("calculus progress")).toHaveTextContent("10");
  });
  it("preserves the last saved record when writes are denied",()=>{
    localStorage.setItem(lessonProgressKey("calculus"),"[false,true]");
    vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw new Error("denied");});
    render(<Probe id="calculus"/>);
    fireEvent.click(screen.getByRole("button",{name:"Complete first"}));
    expect(screen.getByLabelText("storage error")).toHaveTextContent("true");
    expect(localStorage.getItem(lessonProgressKey("calculus"))).toBe("[false,true]");
  });
  it.each(['{broken', '{"version":2}', '[true]'])("preserves unsupported raw data %s until explicit scoped reset", async raw => {
    localStorage.setItem(lessonProgressKey("calculus"), raw);
    localStorage.setItem("unrelated-mastery", "preserved");
    render(<Probe id="calculus" />);
    expect(screen.getByLabelText("storage error")).toHaveTextContent("true");
    fireEvent.click(screen.getByRole("button", {name:"Complete first"}));
    expect(localStorage.getItem(lessonProgressKey("calculus"))).toBe(raw);
    fireEvent.click(screen.getByRole("button", {name:"Reset this lesson"}));
    await waitFor(()=>expect(localStorage.getItem(lessonProgressKey("calculus"))).toBe("[false,false]"));
    expect(localStorage.getItem("unrelated-mastery")).toBe("preserved");
  });

  it("loads another lesson without copying the previous lesson's flags", async () => {
    localStorage.setItem(lessonProgressKey("first"), "[true,true]");
    localStorage.setItem(lessonProgressKey("second"), "[false,true]");
    const view=render(<Probe id="first" />);
    view.rerender(<Probe id="second" />);
    await waitFor(()=>expect(screen.getByLabelText("second progress")).toHaveTextContent("01"));
    expect(localStorage.getItem(lessonProgressKey("first"))).toBe("[true,true]");
    expect(localStorage.getItem(lessonProgressKey("second"))).toBe("[false,true]");
  });
  it("persists progress across remounts under the lesson id", async () => {
    const view = render(<Probe id="calculus" />);
    fireEvent.click(screen.getByRole("button", { name: "Complete first" }));
    await waitFor(() => expect(localStorage.getItem(lessonProgressKey("calculus"))).toBe("[true,false]"));
    view.unmount();
    render(<Probe id="calculus" />);
    await waitFor(() => expect(screen.getByLabelText("calculus progress")).toHaveTextContent("10"));
  });

  it("resets only the selected lesson", async () => {
    localStorage.setItem(lessonProgressKey("vectors"), "[true,true]");
    localStorage.setItem(lessonProgressKey("calculus"), "[true,false]");
    render(<Probe id="calculus" />);
    fireEvent.click(screen.getByRole("button", { name: "Reset this lesson" }));
    await waitFor(() => expect(screen.getByLabelText("calculus progress")).toHaveTextContent("00"));
    expect(localStorage.getItem(lessonProgressKey("vectors"))).toBe("[true,true]");
  });

  it("opens a later derivative topic without completing earlier topics", () => {
    render(<FunctionsDerivativesLesson />);
    fireEvent.click(screen.getByRole("button", { name: /ML bridge/ }));
    expect(screen.getByRole("heading", { name: /How does loss respond/ })).toBeInTheDocument();
  });
});
