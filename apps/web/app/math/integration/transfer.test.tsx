// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {cleanup,fireEvent,render,screen,within} from "@testing-library/react";
import {afterEach,beforeEach,expect,it} from "vitest";
import {MathematicsTransfer} from "./transfer";
import {INTEGRATION_KEY,modelingScenario,transferChecks} from "./content";
import {emptyIntegration,loadIntegration,recordTransfer} from "./model";
beforeEach(()=>localStorage.clear());
afterEach(cleanup);
it("uses verified traces and rejects unsupported inputs",()=>{
  const trace=modelingScenario();
  expect(trace.evaluation.rows[0].prediction).toBe(230);
  expect(trace.update.after.metrics.mse).toBeCloseTo(249.64);
  expect(trace.residualSummary.variance).toBe(300);
  expect(trace.check.passed).toBe(true);
  expect(()=>modelingScenario(NaN)).toThrow();
  expect(()=>modelingScenario(4)).toThrow();
});
it("completes both deterministic variants without assessment or mastery evidence",()=>{
  for(const variant of [0,1] as const){
    let evidence=emptyIntegration();
    for(const check of transferChecks(variant))evidence=recordTransfer(evidence,check.key,"2026-10-16T00:00:00.000Z");
    evidence=recordTransfer(evidence,"reflection","2026-10-16T00:00:01.000Z");
    expect(evidence.lessons["math.integration.transfer"].state).toBe("completed");
    expect(evidence.masteryEvidence).toEqual([]);
    expect(evidence.assessmentAttempts).toEqual([]);
    expect(loadIntegration(JSON.stringify(evidence))).toEqual(evidence);
  }
  expect(()=>recordTransfer(emptyIntegration(),"unknown","now")).toThrow();
  expect(()=>loadIntegration('{"curriculumVersion":"future"}')).toThrow();
});
it("provides feedback, changes controls, restores practice and preserves subject evidence",()=>{
  localStorage.setItem("existing-subject-mastery","unchanged");
  const view=render(<MathematicsTransfer/>);
  fireEvent.change(screen.getByRole("slider",{name:/Floor area/}),{target:{value:"3"}});
  expect(screen.getByText(/Prediction 330/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Record limited-claim reflection"}));
  for(const check of transferChecks(0)){
    const region=within(screen.getByRole("region",{name:`Transfer check: ${check.key}`}));
    if(check.exercise.kind==="numerical")fireEvent.change(region.getByRole("spinbutton"),{target:{value:String(check.exercise.expected)}});
    else {const exercise=check.exercise;fireEvent.click(region.getByRole("radio",{name:exercise.options.find(option=>option.id===exercise.expectedOptionId)!.label}));}
    fireEvent.click(region.getByRole("button",{name:"Check transfer answer"}));
    expect(region.getByRole("status")).toHaveTextContent("Correct.");
  }
  expect(screen.getByText(/Integration practice state: completed/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Reset experiment only"}));
  expect(screen.getByText(/Integration practice state: completed/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Try alternate reference checks"}));
  view.unmount();
  render(<MathematicsTransfer/>);
  expect(screen.getByText(/Integration practice state: completed/)).toBeInTheDocument();
  expect(localStorage.getItem("existing-subject-mastery")).toBe("unchanged");
  expect(loadIntegration(localStorage.getItem(INTEGRATION_KEY)).masteryEvidence).toEqual([]);
});
it.each(['{broken','{"curriculumVersion":"future"}'])("does not overwrite invalid or future evidence %s",raw=>{
  localStorage.setItem(INTEGRATION_KEY,raw);
  render(<MathematicsTransfer/>);
  expect(screen.getByText(/Existing stored data is preserved; saving is disabled/)).toBeInTheDocument();
  fireEvent.change(screen.getByRole("slider",{name:/Floor area/}),{target:{value:"3"}});
  fireEvent.click(screen.getByRole("button",{name:"Record limited-claim reflection"}));
  expect(localStorage.getItem(INTEGRATION_KEY)).toBe(raw);
});
it("limits each reference to two checks and explains a causal misconception",()=>{
  render(<MathematicsTransfer/>);
  const region=within(screen.getByRole("region",{name:"Transfer check: causation"}));
  fireEvent.click(region.getByRole("radio",{name:"Yes: a coefficient proves causation."}));
  fireEvent.click(region.getByRole("button",{name:"Check transfer answer"}));
  expect(region.getByRole("status")).toHaveTextContent("not a real-world causal intervention");
  fireEvent.click(region.getByRole("button",{name:"Check transfer answer"}));
  expect(region.getByRole("button",{name:"Check transfer answer"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Try alternate reference checks"}));
  fireEvent.click(region.getByRole("radio",{name:"No: association or model sensitivity alone does not identify a causal effect."}));
  expect(region.getByRole("button",{name:"Check transfer answer"})).toBeEnabled();
});
