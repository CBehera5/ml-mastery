// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render as rtlRender, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { awardMastery, createEmptyEvidence, evidenceStorageKey, markLessonState, recordProjectMilestone } from "../../../learn/foundation/evidence";
import { ProjectLesson } from "./project-lesson";
import { DEFAULT_CONFIG, PROJECT_ID, PROJECT_OBJECTIVES, PROJECT_SESSION_KEY, projectExercises, runProject } from "./project-model";
const key=evidenceStorageKey("linear-regression");
beforeEach(()=>localStorage.clear());
afterEach(()=>{cleanup();vi.restoreAllMocks()});
// Legacy workflow assertions inspect all stages; focused navigation is tested separately.
function render(ui:Parameters<typeof rtlRender>[0]){const result=rtlRender(ui);fireEvent.click(screen.getByRole("button",{name:"Show all stages"}));return result}
function fillStage(index:number){
 const exercises=projectExercises(runProject(DEFAULT_CONFIG),"area-age")[index];
 exercises.forEach(check=>{const field=screen.getByRole("group",{name:check.prompt});if(check.kind==="numerical")fireEvent.change(within(field).getByRole("spinbutton"),{target:{value:check.expected.toFixed(2)}});else if(check.kind==="conceptual")fireEvent.click(within(field).getByRole("radio",{name:check.options.find(option=>option.id===check.expectedOptionId)!.label}))});
 fireEvent.click(screen.getByRole("button",{name:`Check stage ${index+1}`}));
}
function reachEvaluation(){fillStage(0);fireEvent.click(screen.getByRole("button",{name:"Inspect H03"}));fireEvent.click(screen.getByRole("button",{name:"Inspect H04"}));fillStage(1);fillStage(2);fireEvent.click(screen.getByRole("button",{name:"Run training"}));fireEvent.click(screen.getByRole("button",{name:"Inspect next update"}));fillStage(3);fireEvent.click(screen.getByRole("button",{name:"Evaluate held-out rows"}));fillStage(4)}
describe("guided applied project",()=>{
 it("requires evidence for six stages, saves a report, restores progress and preserves earlier evidence without granting mastery",async()=>{
  const now="2026-10-15T00:00:00Z";
  let previous=markLessonState(createEmptyEvidence("linear-regression.v1"),"linear-regression.implementation","completed",[],now);
  previous=recordProjectMilestone(previous,{projectId:"another-project",milestoneId:"existing",completed:true,updatedAt:now});
  previous=awardMastery(previous,{id:"old-mastery",objectiveId:"old-objective",sourceType:"assessment",sourceId:"old-assessment",level:2,awardedAt:now});
  localStorage.setItem(key,JSON.stringify(previous));localStorage.setItem("ml-math-lab:topic:derivatives:v1","unchanged");
  const view=render(<ProjectLesson/>);
  expect(screen.getByRole("button",{name:"Run training"})).toBeDisabled();
  expect(screen.getByRole("button",{name:"Check stage 6"})).toBeDisabled();
  expect(screen.queryByRole("table",{name:"Held-out prediction details"})).not.toBeInTheDocument();
  reachEvaluation();
  expect(screen.getByRole("table",{name:"Runtime evaluation — actual current run"})).toHaveTextContent("33.73");
  expect(screen.queryByRole("heading",{name:"Your project summary"})).not.toBeInTheDocument();
  fillStage(5);
  await waitFor(()=>expect(screen.getByRole("heading",{name:"Your project summary"})).toBeInTheDocument());
  await waitFor(()=>expect(JSON.parse(localStorage.getItem(key)!).lessons["linear-regression.project"].state).toBe("completed"));
  const stored=JSON.parse(localStorage.getItem(key)!);
  expect(stored.masteryEvidence).toEqual(previous.masteryEvidence);expect(stored.objectives["old-objective"]).toEqual(previous.objectives["old-objective"]);
  PROJECT_OBJECTIVES.forEach(id=>expect(stored.objectives[id]).toMatchObject({completed:true,mastered:false}));
  expect(stored.projectMilestones.filter((m:{projectId:string})=>m.projectId===PROJECT_ID)).toHaveLength(6);
  expect(stored.projectMilestones).toContainEqual(previous.projectMilestones[0]);expect(stored.lessons["linear-regression.implementation"]).toEqual(previous.lessons["linear-regression.implementation"]);
  expect(localStorage.getItem("ml-math-lab:topic:derivatives:v1")).toBe("unchanged");
  const report=screen.getByRole("link",{name:"Download your project summary"});expect(decodeURIComponent(report.getAttribute("href")!)).toContain("Test: MAE 33.73 ₹ lakh");
  view.unmount();render(<ProjectLesson/>);await waitFor(()=>expect(screen.getByRole("heading",{name:"Your project summary"})).toBeInTheDocument());
 });
 it("gives useful incorrect-response feedback without completing a stage",()=>{
  render(<ProjectLesson/>);
  const exercise=projectExercises(null,"area-age")[0][0];
  if(exercise.kind!=="conceptual")throw new Error("expected conceptual check");
  const field=screen.getByRole("group",{name:exercise.prompt});fireEvent.click(within(field).getByRole("radio",{name:"Whether a home belongs to an expensive category"}));fireEvent.click(screen.getByRole("button",{name:"Check stage 1"}));
  expect(within(field).getByRole("status")).toHaveTextContent(/Price is the numeric target/);
  fireEvent.click(within(field).getByRole("radio",{name:"A numeric sale price in ₹ lakh from pre-sale features"}));expect(within(field).queryByRole("status")).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(key)!).projectMilestones).toEqual([]);expect(screen.getByRole("button",{name:"Check stage 2"})).toBeDisabled();
 });
 it("requires exploration of both comparison rows and inspection of an actual update",()=>{
  render(<ProjectLesson/>);fillStage(0);
  fireEvent.click(screen.getByRole("button",{name:"Inspect H03"}));expect(screen.getByRole("button",{name:"Check stage 2"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Inspect H04"}));fillStage(1);fillStage(2);fireEvent.click(screen.getByRole("button",{name:"Run training"}));
  expect(screen.getByRole("button",{name:"Check stage 4"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Inspect next update"}));
  expect(screen.getByRole("button",{name:"Check stage 4"})).toBeEnabled();
  const history=screen.getByRole("table",{name:"Project training history — verified runtime states"});expect(within(history).getAllByRole("row")[2]).toHaveAttribute("aria-current","step");
 });
 it("invalidates current downstream checks when the feature set changes and warns about test reuse",()=>{
  render(<ProjectLesson/>);reachEvaluation();
  const milestonesBefore=JSON.parse(localStorage.getItem(key)!).projectMilestones;
  fireEvent.change(screen.getByRole("combobox",{name:"Model inputs"}),{target:{value:"area"}});
  const saved=JSON.parse(localStorage.getItem(PROJECT_SESSION_KEY)!);expect(saved.hasRun).toBe(false);expect(saved.evaluated).toBe(false);expect(saved.testExposed).toBe(true);
  expect(screen.getByText(/Test outcomes have already been viewed/)).toBeInTheDocument();
  expect(screen.queryByRole("table",{name:"Held-out prediction details"})).not.toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Check stage 6"})).toBeDisabled();expect(JSON.parse(localStorage.getItem(key)!).projectMilestones).toEqual(milestonesBefore);
 });
 it("restores partial progress and safely recovers malformed project state",()=>{
  localStorage.setItem(PROJECT_SESSION_KEY,'{"version":999}');const view=render(<ProjectLesson/>);fillStage(0);fireEvent.click(screen.getByRole("button",{name:"Inspect H03"}));view.unmount();render(<ProjectLesson/>);
  expect(screen.getByRole("button",{name:"Inspect H03"})).toHaveAttribute("aria-pressed","true");expect(screen.getByRole("button",{name:"Check stage 2"})).toBeDisabled();expect(screen.getByRole("button",{name:"Run training"})).toBeDisabled();
 });
 it("exposes stage navigation, data alternatives, provenance and the notebook download",()=>{
  render(<ProjectLesson/>);expect(within(screen.getByRole("navigation",{name:"Project stages"})).getAllByRole("link")).toHaveLength(6);
  const table=screen.getByRole("table",{name:/Synthetic housing dataset/});expect(within(table).getAllByRole("row")).toHaveLength(13);expect(within(table).getAllByText("Held out")).toHaveLength(4);
  expect(screen.getByRole("img",{name:/Training properties: price versus floor area/})).toBeInTheDocument();
  expect(screen.getByRole("link",{name:"Download the reference project notebook"})).toHaveAttribute("href","/notebooks/linear-regression-housing-bridge.ipynb");
  expect(screen.getByRole("link",{name:"Download the synthetic dataset and provenance"})).toHaveAttribute("href","/data/linear-regression-housing-bridge.v1.json");
  expect(screen.getByText(/No real properties, transactions/)).toBeInTheDocument();
 });
 it("reports unavailable storage honestly while leaving practice usable",()=>{
  vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw new Error("storage unavailable")});render(<ProjectLesson/>);
  expect(screen.getByRole("alert")).toHaveTextContent("progress cannot be saved reliably");expect(screen.getByRole("button",{name:"Check stage 1"})).toBeEnabled();
 });
});

it("focuses the current project stage without changing earned evidence",async()=>{
 rtlRender(<ProjectLesson/>);
 await waitFor(()=>expect(screen.getByRole("button",{name:"Check stage 1"})).toBeEnabled());
 expect(screen.queryByRole("button",{name:"Check stage 6"})).not.toBeInTheDocument();
 const before=localStorage.getItem(key);
 fireEvent.click(screen.getByRole("link",{name:"6. Explain the result"}));
 expect(screen.getByRole("button",{name:"Check stage 6"})).toBeDisabled();
 expect(document.activeElement).toBe(screen.getByRole("heading",{name:"Explain the result"}));
 expect(screen.queryByRole("button",{name:"Check stage 1"})).not.toBeInTheDocument();
 expect(localStorage.getItem(key)).toBe(before);
 fireEvent.click(screen.getByRole("button",{name:"Show all stages"}));
 expect(screen.getByRole("button",{name:"Check stage 1"})).toBeInTheDocument();
});
