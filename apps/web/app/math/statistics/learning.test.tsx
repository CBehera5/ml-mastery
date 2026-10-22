// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {cleanup,fireEvent,render,screen,waitFor,within} from "@testing-library/react";
import {StatisticsAssessment,StatisticsLesson,StatisticsOverview} from "./learning";
import {StatisticsLab} from "./labs";
import {MASTERY,questions} from "./content";
import {emptyEvidence,STORAGE_KEY} from "./model";
beforeEach(()=>{localStorage.clear();vi.stubGlobal("requestAnimationFrame",(callback:()=>void)=>{callback();return 0;});});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
function fill(incorrectKey?:string) {
  const groups=screen.getAllByRole("group").filter(group => group.tagName === "FIELDSET");
  questions(0).forEach(({concept,exercise},index)=>{
    const correct=concept.key!==incorrectKey;
    if(exercise.kind==="numerical")fireEvent.change(within(groups[index]).getByRole("spinbutton"),{target:{value:correct?exercise.expected:999}});
    else fireEvent.click(within(groups[index]).getByLabelText(exercise.options.find(option=>correct?option.id===exercise.expectedOptionId:option.id!==exercise.expectedOptionId)!.label));
  });
}
describe("Statistics teaching and evidence",()=>{
  it("opens seven lessons and keeps completion separate from mastery",async()=>{
    render(<StatisticsOverview/>);await screen.findByText(/Independent mastery not yet earned/);
    expect(screen.getAllByRole("link",{name:/Explore understanding data/})).toHaveLength(1);
    expect(screen.getByText(/28 deterministic items/)).toHaveTextContent("23 correct");
  });
  it("records an objective, retains other module storage and survives reload",async()=>{
    localStorage.setItem("ml-math-lab:evidence:math.probability:v1","preserve");
    const view=render(<StatisticsLesson slug="data"/>);
    const first=screen.getByRole("region",{name:"Check: Populations, samples and observations"});
    fireEvent.change(within(first).getByRole("spinbutton"),{target:{value:50}});
    fireEvent.click(within(first).getByRole("button",{name:"Check answer"}));
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives["statistics.foundations.population"].completed).toBe(true));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).masteryEvidence).toHaveLength(0);
    expect(localStorage.getItem("ml-math-lab:evidence:math.probability:v1")).toBe("preserve");
    view.unmount();render(<StatisticsLesson slug="data"/>);await screen.findByText("Check your understanding — evidence recorded");
  });
  it("makes causal interpretation critical even at 27/28 and supports review/edit/retry",async()=>{
    render(<StatisticsAssessment/>);await screen.findByRole("button",{name:"Review all answers"});
    fill("confounding");fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));
    expect(screen.getByRole("button",{name:"Submit confirmed attempt"})).toBeDisabled();
    fireEvent.click(screen.getByRole("button",{name:"Edit answers"}));
    fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));
    expect(screen.getByRole("heading",{name:"Not yet mastered: 27/28"})).toBeInTheDocument();
    expect(screen.getByText(/overall threshold was met/)).toBeInTheDocument();
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).assessmentAttempts).toHaveLength(1));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[MASTERY]).toBeUndefined();
    fireEvent.click(screen.getByRole("button",{name:"Retry alternate variant"}));
    expect(screen.getByRole("status")).toHaveTextContent("v2");
    expect(screen.getByRole("button",{name:"Review all answers"})).toBeDisabled();
  });
  it("saves independent mastery but not unfinished answers",async()=>{
    const view=render(<StatisticsAssessment/>);await screen.findByRole("button",{name:"Review all answers"});fill();
    fireEvent.click(screen.getByRole("button",{name:"Review all answers"}));fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));
    await waitFor(()=>expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).objectives[MASTERY].mastered).toBe(true));
    view.unmount();render(<StatisticsAssessment/>);await screen.findByText("28/28");
    expect(screen.getByRole("status")).toHaveTextContent("Previously earned mastery: yes");expect(screen.getByRole("button",{name:"Review all answers"})).toBeDisabled();
  });
  it("preserves unsupported evidence and handles storage denial visibly",async()=>{
    const raw=JSON.stringify({...emptyEvidence(),curriculumVersion:"future"});localStorage.setItem(STORAGE_KEY,raw);
    const view=render(<StatisticsOverview/>);await screen.findByText(/saving is disabled/);expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    view.unmount();vi.spyOn(Storage.prototype,"getItem").mockImplementation(()=>{throw new Error("Denied");});render(<StatisticsOverview/>);await screen.findByText(/storage is unavailable/);vi.restoreAllMocks();
  });
  it("updates summaries, flags outliers, rejects missing data and explains zero spread",()=>{
    render(<StatisticsLab kind="summary"/>);expect(screen.getByRole("status")).toHaveTextContent("mean=2; median=2");
    fireEvent.click(screen.getByRole("checkbox",{name:"Add one outlier candidate"}));expect(screen.getByRole("status")).toHaveTextContent("mean=26.5; median=2.5");
    fireEvent.click(screen.getByRole("button",{name:"Constant data"}));expect(screen.getAllByText(/zero spread/)).toHaveLength(3);
    fireEvent.change(screen.getByLabelText("Dataset values"),{target:{value:"1,,3"}});fireEvent.click(screen.getByRole("button",{name:"Apply dataset"}));expect(screen.getByRole("alert")).toHaveTextContent("no missing entries");
  });
  it("forces prediction before revealing observational twins and repairs invalid causal conclusions",()=>{
    render(<StatisticsLab kind="relationships"/>);
    expect(screen.getByRole("button",{name:"Reveal intervention comparison"})).toBeDisabled();
    fireEvent.click(screen.getByRole("radio",{name:"Yes, because both have r=1."}));fireEvent.click(screen.getByRole("button",{name:"Reveal intervention comparison"}));
    expect(screen.getByText(/Repair: equal observational correlation/)).toBeInTheDocument();
    expect(screen.getByText(/Model A outcomes Y=\[0, 1\].*Model B outcomes Y=\[1, 1\]/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Assigned X for everyone"),{target:{value:0}});
    expect(screen.getByText(/Model B outcomes Y=\[0, 0\]/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Weather population filter"),{target:{value:"0"}});
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Pearson r=0");
    fireEvent.click(screen.getByRole("radio",{name:"The large correlation alone."}));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent("Not justified");
    fireEvent.click(screen.getByRole("radio",{name:"An appropriate causal study design and its assumptions, not prediction alone."}));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent("Supported reasoning");
  });
  it("demonstrates wrong-frame sampling and exact null-model interpretation",()=>{
    render(<StatisticsLab kind="sampling"/>);
    fireEvent.click(screen.getByRole("checkbox",{name:/Biased frame/}));
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("assumptions are broken");
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("mean of repeated sample means=10");
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("0.001953");
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("not P(H₀ true)");
  });
  it("exposes target copying and test-dependent preprocessing rather than rewarding high scores",()=>{
    render(<StatisticsLab kind="ml"/>);
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("accuracy=4/6");
    fireEvent.click(screen.getByRole("checkbox",{name:/forbidden post-outcome/}));
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("accuracy=6/6");
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("invalid evidence");
    fireEvent.click(screen.getByRole("checkbox",{name:/Incorrectly fit scaling/}));
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("Leaked reference");
  });
});
