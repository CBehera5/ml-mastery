// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, recordProjectMilestone } from "../../../learn/foundation/evidence";
import { MasteryLesson } from "./mastery-lesson";
import { AGGREGATE_OBJECTIVE, ASSESSMENT_ID, assessmentQuestions, commitAssessment, gradeAssessment, MASTERY_DRAFT_KEY, newDraft, type Responses } from "./assessment";
const key=evidenceStorageKey("linear-regression");
beforeEach(()=>localStorage.clear());afterEach(()=>{cleanup();vi.restoreAllMocks()});
function fill(variant="v01",wrongKey?:string){for(const q of assessmentQuestions(variant)){
 const field=screen.getByRole("group",{name:new RegExp(`^${q.key.toUpperCase()} ·`)}),e=q.exercise;
 if(e.kind==="numerical")fireEvent.change(within(field).getByRole("spinbutton"),{target:{value:String(q.key===wrongKey?999:e.expected)}});
 else if(e.kind==="constrained-code")for(const slot of e.slots)fireEvent.change(within(field).getByRole("combobox",{name:`${q.key.toUpperCase()} — ${slot.id}`}),{target:{value:e.expectedSlots[slot.id]}});
 else fireEvent.click(within(field).getByRole("radio",{name:e.options.find(option=>option.id===e.expectedOptionId)!.label}));
}}
function confirmSubmit(){fireEvent.click(screen.getByRole("button",{name:"Review responses before submitting"}));fireEvent.click(screen.getByRole("checkbox",{name:/I’m ready to submit/}));fireEvent.click(screen.getByRole("button",{name:"Submit assessment"}));}
describe("independent mastery learner experience",()=>{
 it("hides scoring and explanations until review plus explicit submission confirmation",()=>{
  render(<MasteryLesson/>);fill("v01","q06");
  expect(screen.getByRole("progressbar")).toHaveAttribute("value","24");expect(screen.queryByText(/Square each residual before averaging:/)).not.toBeInTheDocument();expect(screen.queryByRole("table",{name:"Performance by competency"})).not.toBeInTheDocument();
  fireEvent.submit(screen.getByRole("button",{name:"Review responses before submitting"}).closest("form")!);
  expect(screen.getByRole("heading",{name:"Review your responses"})).toHaveFocus();expect(screen.getByRole("button",{name:"Submit assessment"})).toBeDisabled();expect(screen.queryByText(/Square each residual before averaging:/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Submit assessment"}));expect(JSON.parse(localStorage.getItem(key)!).assessmentAttempts).toEqual([]);
  fireEvent.click(screen.getByRole("checkbox",{name:/I’m ready to submit/}));fireEvent.click(screen.getByRole("button",{name:"Submit assessment"}));
  expect(screen.getByRole("heading",{name:"Review the objectives before another attempt"})).toHaveFocus();expect(screen.getByText(/Square each residual before averaging:/)).toBeInTheDocument();
  expect(screen.getByRole("link",{name:"Review the relevant lesson →"})).toHaveAttribute("href","/algorithms/linear-regression/errors");expect(JSON.parse(localStorage.getItem(key)!).masteryEvidence).toEqual([]);
 });
 it("awards objective-level mastery only on success, restores the result and retries on the next variant",async()=>{
  let previous=markLessonState(createEmptyEvidence("linear-regression.v1"),"linear-regression.project","completed",[],"2026-10-15T00:00:00Z");previous=recordProjectMilestone(previous,{projectId:"old-project",milestoneId:"done",completed:true,updatedAt:"2026-10-15T00:00:00Z"});localStorage.setItem(key,JSON.stringify(previous));localStorage.setItem("ml-math-lab:topic:derivatives:v1",JSON.stringify({completed:["why"],mastered:true,bestScore:5}));
  const view=render(<MasteryLesson/>);fill();confirmSubmit();
  expect(screen.getByRole("heading",{name:"Mastery criteria met"})).toBeInTheDocument();
  const stored=JSON.parse(localStorage.getItem(key)!);expect(stored.assessmentAttempts).toHaveLength(1);expect(stored.objectives[AGGREGATE_OBJECTIVE].mastered).toBe(true);expect(stored.masteryEvidence).toHaveLength(25);expect(stored.projectMilestones).toEqual(previous.projectMilestones);expect(stored.lessons["linear-regression.project"]).toEqual(previous.lessons["linear-regression.project"]);expect(localStorage.getItem("ml-math-lab:topic:derivatives:v1")).toContain('"mastered":true');
  view.unmount();render(<MasteryLesson/>);await waitFor(()=>expect(screen.getByRole("heading",{name:"Mastery criteria met"})).toBeInTheDocument());expect(JSON.parse(localStorage.getItem(key)!).assessmentAttempts).toHaveLength(1);
  fireEvent.click(screen.getByRole("button",{name:"Start next variant"}));expect(screen.getByText(/Current variant: v02/)).toBeInTheDocument();expect(screen.getByRole("progressbar")).toHaveAttribute("value","0");expect(screen.queryByRole("table",{name:"Performance by competency"})).not.toBeInTheDocument();
  confirmSubmit();const failed=JSON.parse(localStorage.getItem(key)!);expect(failed.assessmentAttempts).toHaveLength(2);expect(failed.masteryEvidence).toEqual(stored.masteryEvidence);expect(failed.objectives[AGGREGATE_OBJECTIVE]).toEqual(stored.objectives[AGGREGATE_OBJECTIVE]);
 });
 it("focuses an edited question and does not persist submission consent across reload",()=>{
  const view=render(<MasteryLesson/>);fireEvent.click(screen.getByRole("button",{name:"Review responses before submitting"}));fireEvent.click(screen.getByRole("button",{name:"Edit Q04"}));expect(screen.getByRole("group",{name:/^Q04 ·/})).toHaveFocus();
  fireEvent.click(screen.getByRole("button",{name:"Review responses before submitting"}));fireEvent.click(screen.getByRole("checkbox",{name:/I’m ready to submit/}));view.unmount();render(<MasteryLesson/>);expect(screen.getByRole("button",{name:"Review responses before submitting"})).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Review responses before submitting"}));expect(screen.getByRole("button",{name:"Submit assessment"})).toBeDisabled();
 });
 it("restores bounded partial code drafts without discarding other progress",()=>{
  const view=render(<MasteryLesson/>);fireEvent.change(screen.getByRole("combobox",{name:"Q20 — weight"}),{target:{value:"w - rate * dw"}});view.unmount();render(<MasteryLesson/>);expect(screen.getByRole("combobox",{name:"Q20 — weight"})).toHaveValue("w - rate * dw");expect(screen.getByRole("combobox",{name:"Q20 — bias"})).toHaveValue("");expect(screen.getByRole("progressbar")).toHaveAttribute("value","0");
 });
 it("migrates missing/unsupported drafts to the next variant while preserving existing v1 learning evidence",()=>{
  const result=gradeAssessment("v01",{}),stored=commitAssessment(createEmptyEvidence("linear-regression.v1"),result,"legacy-current","2026-10-15T00:00:00Z");localStorage.setItem(key,JSON.stringify(stored));localStorage.setItem(MASTERY_DRAFT_KEY,JSON.stringify({...newDraft(),version:99}));render(<MasteryLesson/>);expect(screen.getByText(/Current variant: v02/)).toBeInTheDocument();expect(JSON.parse(localStorage.getItem(key)!).assessmentAttempts).toEqual(stored.assessmentAttempts);
 });
 it("does not trust a submitted display without a matching canonical objective result",()=>{
  const questions=assessmentQuestions("v01"),answers:Responses={};for(const q of questions){const e=q.exercise;answers[q.key]=e.kind==="numerical"?{kind:e.kind,value:e.expected}:e.kind==="constrained-code"?{kind:e.kind,slots:e.expectedSlots}:{kind:e.kind,optionId:e.expectedOptionId}}
  const correct=gradeAssessment("v01",answers);const stored=commitAssessment(createEmptyEvidence("linear-regression.v1"),correct,"recorded","2026-10-15T00:00:00Z");
  // Keep the same score while replacing a critical pass with a different objective failure.
  delete answers.q06;delete answers.q02;const bad=gradeAssessment("v01",answers);const canonical={...stored,assessmentAttempts:[{...stored.assessmentAttempts[0],score:bad.score,objectiveIds:bad.passedObjectiveIds.map(id=>id==="linear-regression.mastery.q01"?"linear-regression.mastery.q02":id)}]};
  localStorage.setItem(key,JSON.stringify(canonical));localStorage.setItem(MASTERY_DRAFT_KEY,JSON.stringify({...newDraft(),phase:"submitted",responses:answers,attemptId:"recorded",submittedAt:"2026-10-15T00:00:00Z"}));render(<MasteryLesson/>);expect(screen.getByRole("button",{name:"Review responses before submitting"})).toBeInTheDocument();expect(screen.queryByRole("table",{name:"Performance by competency"})).not.toBeInTheDocument();
 });
 it("provides accessible groups, named progress and history, and honest storage failure feedback",()=>{
  vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw new Error("unavailable")});render(<MasteryLesson/>);expect(screen.getAllByRole("group").filter(group=>group.tagName==="FIELDSET")).toHaveLength(24);expect(screen.getByRole("progressbar")).toHaveAccessibleName("Responses entered: 0 of 24");expect(screen.getByRole("alert")).toHaveTextContent("cannot be saved reliably");expect(screen.getByRole("button",{name:"Review responses before submitting"})).toBeEnabled();
 });
});

it("offers unanswered question navigation without submitting or changing assessment policy",()=>{
 render(<MasteryLesson/>);
 const nav=screen.getByRole("navigation",{name:"Assessment question navigator"});
 expect(within(nav).getAllByRole("link")).toHaveLength(24);
 expect(within(nav).getByRole("link",{name:"Q01: unanswered"})).toHaveAttribute("href","#mastery-q01");
 expect(screen.queryByRole("button",{name:"Submit assessment"})).not.toBeInTheDocument();
});
