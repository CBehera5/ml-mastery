// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {cleanup,fireEvent,render,screen,waitFor,within} from "@testing-library/react";
import {OptimizationAssessment,OptimizationLesson,OptimizationOverview} from "./learning";
import {OptimizationLab} from "./labs";
import {MASTERY,questions} from "./content";
import {emptyEvidence,STORAGE_KEY} from "./model";
beforeEach(()=>{localStorage.clear();vi.stubGlobal("requestAnimationFrame",(callback:()=>void)=>{callback();return 0;});});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
function fill(incorrectKey?:string) {
  const groups=screen.getAllByRole("group").filter(group => group.tagName === "FIELDSET");
  questions(0).forEach(({concept,exercise},index)=>{
    const correct=concept.key!==incorrectKey;
    if(exercise.kind==="numerical")fireEvent.change(within(groups[index]).getByRole("spinbutton"),{target:{value:correct?exercise.expected:999}});
    else fireEvent.click(within(groups[index]).getByLabelText(exercise.options.find(option=>correct?option.id===exercise.expectedOptionId:option.id!==exercise.expectedOptionId)!.label));
  });
}
describe("Optimization learning and acceptance boundaries",()=>{
  it("offers six independently accessible lessons without completion-based mastery",async()=>{
    render(<OptimizationOverview/>);await screen.findByText(/Independent mastery not yet earned/);
    expect(screen.getByText(/24 deterministic items/)).toHaveTextContent("20 correct");
    expect(screen.getAllByRole("link",{name:/Losses, objectives and gradients/})).toHaveLength(2);
  });
  it("records practice independently, persists it and never overwrites Statistics",async()=>{
    localStorage.setItem("ml-math-lab:evidence:math.statistics:v1","preserve");
    const view=render(<OptimizationLesson slug="objectives"/>);
    const check=screen.getByRole("region",{name:"Check: What an objective measures"});
    fireEvent.click(within(check).getByRole("radio",{name:"Squared target units."}));
    fireEvent.click(within(check).getByRole("button",{name:"Check answer"}));
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives["optimization.foundations.loss-units"].completed).toBe(true));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toHaveLength(0);
    expect(localStorage.getItem("ml-math-lab:evidence:math.statistics:v1")).toBe("preserve");
    view.unmount();render(<OptimizationLesson slug="objectives"/>);await screen.findByText("Check your understanding — evidence recorded");
  });
  it("rejects a convergence misconception at 23/24 and requires explicit review consent",async()=>{
    render(<OptimizationAssessment/>);await screen.findByRole("button",{name:"Review all answers"});
    fill("convergence");fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));
    expect(screen.getByRole("button",{name:"Submit confirmed attempt"})).toBeDisabled();
    fireEvent.click(screen.getByRole("button",{name:"Edit answers"}));
    fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));expect(screen.getByRole("checkbox")).not.toBeChecked();
    fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));
    expect(screen.getByRole("heading",{name:"Not yet mastered: 23/24"})).toBeInTheDocument();
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).assessmentAttempts).toHaveLength(1));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[MASTERY]).toBeUndefined();
    fireEvent.click(screen.getByRole("button",{name:"Retry alternate variant"}));expect(screen.getByRole("status")).toHaveTextContent("v2");
    expect(screen.getByRole("button",{name:"Review all answers"})).toBeDisabled();
  });
  it("restores passing mastery/history but not unfinished answers",async()=>{
    const view=render(<OptimizationAssessment/>);await screen.findByRole("button",{name:"Review all answers"});fill();
    fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[MASTERY].mastered).toBe(true));
    view.unmount();render(<OptimizationAssessment/>);await screen.findByText("24/24");
    expect(screen.getByRole("status")).toHaveTextContent("Previously earned mastery: yes");expect(screen.getByRole("button",{name:"Review all answers"})).toBeDisabled();
  });
  it("preserves future records and reports blocked storage without silently migrating",async()=>{
    const raw=JSON.stringify({...emptyEvidence(),curriculumVersion:"future"});localStorage.setItem(STORAGE_KEY,raw);
    const view=render(<OptimizationOverview/>);await screen.findByText(/saving is disabled/);expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    view.unmount();vi.spyOn(Storage.prototype,"getItem").mockImplementation(()=>{throw new Error("Denied");});
    render(<OptimizationOverview/>);await screen.findByText(/storage is unavailable/);
  });
  it("shows saddle and finite-difference evidence with accessible numerical maps",()=>{
    render(<OptimizationLab kind="landscape"/>);
    expect(screen.getByRole("img")).toHaveAccessibleName(/Sampled objective heat map/);
    fireEvent.change(screen.getByLabelText("Objective"),{target:{value:"saddle"}});
    fireEvent.change(screen.getByRole("slider",{name:/Coordinate a/}),{target:{value:0}});
    expect(screen.getByRole("status")).toHaveTextContent("objective=0; gradient=[0, 0]");
    fireEvent.change(screen.getByRole("slider",{name:/Coordinate b/}),{target:{value:1}});
    expect(screen.getByRole("status")).toHaveTextContent("objective=-1");
  });
  it("supports paused-by-default manual history, rate comparison and invalid-input recovery",()=>{
    const interval=vi.spyOn(window,"setInterval");
    render(<OptimizationLab kind="training"/>);expect(interval).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button",{name:"Next state"}));
    expect(screen.getByRole("status")).toHaveTextContent("state 1: point [1.4, 0]");
    fireEvent.click(screen.getByRole("button",{name:"Reset history view"}));
    expect(screen.getByRole("status")).toHaveTextContent("Viewing state 0");
    fireEvent.change(screen.getByLabelText(/Learning rate \(finite/),{target:{value:"NaN"}});
    expect(screen.getByRole("alert")).toHaveTextContent("finite");
    fireEvent.click(screen.getByRole("button",{name:"Rate 1"}));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("table",{name:"Selected-rate history: initial state 0, then simultaneous updates"})).toHaveTextContent("iterations_completed");
    expect(interval).not.toHaveBeenCalled();
  });
  it("reports numerical guard stops without replacing unavailable losses with zero",()=>{
    render(<OptimizationLab kind="training"/>);
    fireEvent.change(screen.getByLabelText("Training objective"),{target:{value:"anisotropic"}});
    fireEvent.change(screen.getByRole("slider",{name:/Starting b/}),{target:{value:1}});
    expect(screen.getByRole("status")).toHaveTextContent("diverged; reason: numerical_limit_exceeded");
    expect(screen.getByRole("table",{name:"Selected-rate history: initial state 0, then simultaneous updates"})).toHaveTextContent("unavailable");
  });
  it("separates penalties from data fit and repairs guaranteed-generalization claims",()=>{
    render(<OptimizationLab kind="regularization"/>);
    expect(screen.getByRole("button",{name:"Inspect penalty comparison"})).toBeDisabled();
    fireEvent.click(screen.getByRole("radio",{name:"Yes, smaller always means better."}));
    fireEvent.click(screen.getByRole("button",{name:"Inspect penalty comparison"}));
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("Repair:");
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("data term=4, penalty=1, total=5");
    expect(screen.getAllByRole("table")).toHaveLength(2);
  });
  it("reuses original Regression and reduced-motion playback rather than replacing it",()=>{
    vi.stubGlobal("matchMedia",vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
    render(<OptimizationLab kind="comparison"/>);
    expect(screen.getByText(/Training feature mean=/)).toHaveTextContent("Existing gradient checks: raw pass, scaled pass");
    const details=screen.getByText(/Open the preserved house-price GradientLab/).closest("details")!;
    fireEvent.click(within(details).getByText(/Open the preserved house-price GradientLab/));details.open=true;
    fireEvent.click(within(details).getByRole("button",{name:"Play"}));
    expect(within(details).getByRole("button",{name:"Play"})).toBeInTheDocument();
    expect(within(details).queryByRole("button",{name:"Pause"})).not.toBeInTheDocument();
  });
});
