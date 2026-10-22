// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ProbabilityAssessment, ProbabilityLesson, ProbabilityOverview } from "./learning";
import { ProbabilityLab } from "./labs";
import { ASSESSMENT, MASTERY, questions } from "./content";
import { emptyEvidence, STORAGE_KEY } from "./model";
beforeEach(()=>{localStorage.clear();vi.stubGlobal("requestAnimationFrame",(callback:()=>void)=>{callback();return 0;});});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
function fill(correct: boolean) {
  const groups=screen.getAllByRole("group").filter(group => group.tagName === "FIELDSET");
  questions(0).forEach(({exercise},index)=>{
    if(exercise.kind==="numerical")fireEvent.change(within(groups[index]).getByRole("spinbutton"),{target:{value:correct?exercise.expected:999}});
    else fireEvent.click(within(groups[index]).getByLabelText(exercise.options.find(option=>correct?option.id===exercise.expectedOptionId:option.id!==exercise.expectedOptionId)!.label));
  });
}
describe("Probability learning experience",()=>{
  it("opens six independent lessons without implying mastery",async()=>{
    render(<ProbabilityOverview/>);
    expect(screen.getByRole("heading",{name:"Probability for machine learning"})).toBeInTheDocument();
    await screen.findByText(/Independent mastery not yet earned/);
    expect(screen.getAllByRole("link",{name:/Explore understanding probability/})).toHaveLength(1);
  });
  it("records a practice objective but not mastery and retains other module keys",async()=>{
    localStorage.setItem("legacy-algebra","preserve");
    render(<ProbabilityLesson slug="understanding"/>);
    const checks=screen.getAllByRole("region",{name:/Check:/});
    fireEvent.change(within(checks[0]).getByRole("spinbutton"),{target:{value:3}});
    fireEvent.click(within(checks[0]).getByRole("button",{name:"Check answer"}));
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives["probability.foundations.sample-space"].completed).toBe(true));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toHaveLength(0);
    expect(localStorage.getItem("legacy-algebra")).toBe("preserve");
    expect(screen.getByRole("button",{name:"Record experiment reflection"})).toBeDisabled();
    fireEvent.click(screen.getByRole("button",{name:"Independent population"}));
    fireEvent.click(screen.getByRole("button",{name:"Record experiment reflection"}));
    await screen.findByText(/Saved\. Answer the four checks/);
  });
  it("requires review and explicit confirmation; records failed attempts and alternate retry",async()=>{
    render(<ProbabilityAssessment/>);
    await screen.findByRole("button",{name:"Review all answers"});
    expect(screen.getByRole("button",{name:"Review all answers"})).toBeDisabled();
    fill(false);fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));
    expect(screen.getByRole("button",{name:"Submit confirmed attempt"})).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));
    expect(screen.getByRole("heading",{name:"Not yet mastered: 0/24"})).toBeInTheDocument();
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).assessmentAttempts[0].assessmentId).toBe(ASSESSMENT));
    fireEvent.click(screen.getByRole("button",{name:"Retry alternate variant"}));
    expect(screen.getByRole("status")).toHaveTextContent("v2");
    expect(screen.getByRole("button",{name:"Review all answers"})).toBeDisabled();
  });
  it("awards only independent passing mastery and restores saved history on reload",async()=>{
    const view=render(<ProbabilityAssessment/>);await screen.findByRole("button",{name:"Review all answers"});
    fill(true);fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));
    fireEvent.click(screen.getByRole("button",{name:"Edit answers"}));
    fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[MASTERY].mastered).toBe(true));
    view.unmount();render(<ProbabilityAssessment/>);
    await screen.findByText("24/24");
    expect(screen.getByRole("status")).toHaveTextContent("Previously earned mastery: yes");
    expect(screen.getByRole("button",{name:"Review all answers"})).toBeDisabled();
  });
  it("preserves future storage without silently migrating or overwriting it",async()=>{
    const raw=JSON.stringify({...emptyEvidence(),curriculumVersion:"future"});
    localStorage.setItem(STORAGE_KEY,raw);render(<ProbabilityOverview/>);
    await screen.findByText(/saving is disabled/);expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it("provides empty-condition and Bayes textual alternatives and native controls",()=>{
    const view=render(<ProbabilityLab kind="events"/>);
    fireEvent.click(screen.getByRole("button",{name:"Empty B population"}));
    expect(screen.getByRole("status")).toHaveTextContent("undefined — no B cases");
    view.unmount();render(<ProbabilityLab kind="bayes"/>);
    expect(screen.getByRole("status")).toHaveTextContent("90/1080 = 0.083333");
    fireEvent.change(screen.getByRole("slider",{name:/Prior prevalence/}),{target:{value:50}});
    expect(screen.getByRole("status")).toHaveTextContent("4500/5000 = 0.9");
  });
  it("responds to distribution and threshold controls without training a model",()=>{
    const view=render(<ProbabilityLab kind="distributions"/>);
    expect(screen.getAllByRole("table")).toHaveLength(2);
    fireEvent.change(screen.getByRole("slider",{name:/Normal standard/}),{target:{value:.1}});
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("3.989423");
    view.unmount();render(<ProbabilityLab kind="threshold"/>);
    fireEvent.change(screen.getByRole("slider",{name:/Decision threshold/}),{target:{value:100}});
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("false negatives 3");
    fireEvent.change(screen.getByRole("slider",{name:/Predicted positive/}),{target:{value:0}});
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("infinite");
    expect(screen.getAllByRole("status")[2]).toHaveTextContent("0.714286");
    fireEvent.change(screen.getByRole("slider",{name:/Prior spam/}),{target:{value:0}});
    expect(screen.getAllByRole("status")[2]).toHaveTextContent("Normalized P(spam given both clues)=0");
    fireEvent.change(screen.getByRole("slider",{name:/Actual positives among/}),{target:{value:30}});
    expect(screen.getAllByRole("status")[3]).toHaveTextContent("differs from its predicted frequency");
  });
});
