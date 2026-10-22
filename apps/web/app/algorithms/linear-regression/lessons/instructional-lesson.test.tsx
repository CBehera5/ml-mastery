// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createEmptyEvidence, evidenceStorageKey, markLessonState, recordObjectiveCompletion } from "../../../learn/foundation/evidence";
import { evaluateExercise, validateExercise } from "../../../learn/foundation/exercises";
import { REFERENCE_CURRICULUM } from "../../../learn/foundation/reference-catalog";
import { validateCurriculumCatalog } from "../../../learn/foundation/curriculum";
import { RegressionLabRouter } from "../labs/lab-router";
import { INSTRUCTIONS, INSTRUCTIONAL_IDS, instructionalObjectiveIds, type InstructionalId } from "./instructional-content";
const key=evidenceStorageKey("linear-regression");
beforeEach(()=>localStorage.clear());
afterEach(cleanup);
function answerAll(id:InstructionalId){INSTRUCTIONS[id].checks.forEach((exercise,index)=>{
 const field=screen.getByRole("group",{name:`${index+1}. ${exercise.prompt}`});
 if(exercise.kind==="numerical")fireEvent.change(within(field).getByRole("spinbutton"),{target:{value:String(exercise.expected)}});
 else fireEvent.click(within(field).getByRole("radio",{name:exercise.options.find(option=>option.id===exercise.expectedOptionId)!.label}));
 fireEvent.click(within(field).getByRole("button",{name:`Check answer ${index+1}`}));
})}
function explore(id:InstructionalId){
 if(id==="failure-modes")fireEvent.click(screen.getByRole("button",{name:"Training versus validation"}));
 else if(id==="gradient-descent")fireEvent.click(screen.getByRole("button",{name:"Step"}));
 else fireEvent.change(screen.getAllByRole("slider")[0],{target:{value:id==="equation"?"50":"3"}});
}
describe.each(INSTRUCTIONAL_IDS)("%s instructional evidence",id=>{
 it("requires correct understanding checks and a real lab interaction; persists on revisit without awarding mastery",async()=>{
  const original=recordObjectiveCompletion(markLessonState(createEmptyEvidence("linear-regression.v1"),"linear-regression.implementation","completed",[],"2026-10-15T00:00:00Z"),"existing-objective","existing-evidence","2026-10-15T00:00:00Z");
  localStorage.setItem(key,JSON.stringify(original));localStorage.setItem("derivatives-progress","preserve-me");
  const view=render(<RegressionLabRouter lessonId={id}/>);
  if(id==="equation")fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));
  expect(screen.getByRole("heading",{name:"Mathematical reasoning"})).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"Mathematical symbol key"})).toBeInTheDocument();
  answerAll(id);
  expect(screen.queryByRole("heading",{name:id==="equation"?"Existing lesson checks complete":"Lesson outcome demonstrated"})).not.toBeInTheDocument();
  explore(id);
  await waitFor(()=>expect(screen.getByRole("heading",{name:id==="equation"?"Existing lesson checks complete":"Lesson outcome demonstrated"})).toBeInTheDocument());
  const stored=JSON.parse(localStorage.getItem(key)!);
  expect(stored.lessons[`linear-regression.${id}`].state).toBe("completed");
  instructionalObjectiveIds(id).forEach(objective=>{expect(stored.objectives[objective].completed).toBe(true);expect(stored.objectives[objective].mastered).toBe(false)});
  expect(stored.masteryEvidence).toEqual([]);expect(stored.objectives["existing-objective"]).toEqual(original.objectives["existing-objective"]);
  expect(stored.lessons["linear-regression.implementation"]).toEqual(original.lessons["linear-regression.implementation"]);
  expect(localStorage.getItem("derivatives-progress")).toBe("preserve-me");
  view.unmount();render(<RegressionLabRouter lessonId={id}/>);
  await waitFor(()=>expect(screen.getByRole("heading",{name:id==="equation"?"Existing lesson checks complete":"Lesson outcome demonstrated"})).toBeInTheDocument());
 });
 it("rejects incorrect answers with remediation and does not complete on opening or exploration alone",()=>{
  localStorage.setItem(key,"broken json");render(<RegressionLabRouter lessonId={id}/>);if(id==="equation")fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));explore(id);
  const exercise=INSTRUCTIONS[id].checks[0],field=screen.getByRole("group",{name:`1. ${exercise.prompt}`});
  if(exercise.kind==="numerical")fireEvent.change(within(field).getByRole("spinbutton"),{target:{value:"999"}});
  else fireEvent.click(within(field).getByRole("radio",{name:exercise.options.find(option=>option.id!==exercise.expectedOptionId)!.label}));
  fireEvent.click(within(field).getByRole("button",{name:"Check answer 1"}));
  expect(within(field).getByRole("status")).toHaveTextContent(/Try again|Reconsider/);
  const stored=JSON.parse(localStorage.getItem(key)!);expect(stored.objectives[exercise.objectiveIds[0]]).toBeUndefined();
  expect(stored.lessons[`linear-regression.${id}`].state).toBe("started");
 });
});
describe("instructional exercise contracts and accessibility",()=>{
 it("validates all definitions and rejects non-finite numerical responses",()=>{
  for(const id of INSTRUCTIONAL_IDS)for(const check of INSTRUCTIONS[id].checks){expect(validateExercise(check)).toEqual([]);if(check.kind==="numerical")expect(evaluateExercise(check,{kind:"numerical",value:NaN},1).correct).toBe(false)}
  expect(INSTRUCTIONS.equation.checks[0]).toMatchObject({expected:220});
  expect(INSTRUCTIONS["gradient-descent"].checks[1]).toMatchObject({expected:1.8});
  expect(INSTRUCTIONS["multiple-features"].checks[0]).toMatchObject({expected:64});
 });
 it("registers every exercise and objective while preserving the aggregate curriculum IDs",()=>{
  expect(validateCurriculumCatalog(REFERENCE_CURRICULUM)).toEqual({valid:true,errors:[]});
  for(const id of INSTRUCTIONAL_IDS){const lesson=REFERENCE_CURRICULUM.lessons.find(l=>l.id===`linear-regression.${id}`)!;expect(lesson.objectiveIds).toContain(`linear-regression.${id}.objective`);expect(lesson.exerciseIds).toHaveLength(INSTRUCTIONS[id].checks.length)}
 });
 it("provides a nonvisual history with initial and updated runtime states",()=>{
  render(<RegressionLabRouter lessonId="gradient-descent"/>);
  const table=screen.getByRole("table",{name:"Training history from the mathematical runtime"});
  expect(within(table).getAllByRole("row")).toHaveLength(22);
  expect(within(table).getByRole("columnheader",{name:"Bias gradient"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Step"}));
  expect(within(table).getAllByRole("row")[2]).toHaveAttribute("aria-current","step");
 });
});


describe("equation-only staged learning and preserved evidence",()=>{
 it("introduces formal notation only after discovery and keeps transfer ephemeral",async()=>{
  render(<RegressionLabRouter lessonId="equation"/>);
  expect(screen.queryByRole("heading",{name:"Mathematical reasoning"})).not.toBeInTheDocument();expect(screen.queryByRole("heading",{name:"The same rule in Python"})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("radio",{name:"Not sure"}));fireEvent.click(screen.getByRole("button",{name:"Try coefficient 46"}));
  expect(screen.queryByRole("heading",{name:"Mathematical reasoning"})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Compare coefficient and baseline"}));fireEvent.click(screen.getByRole("button",{name:"Connect the discovery to mathematics and Python"}));
  expect(screen.getByRole("heading",{name:"Mathematical reasoning"})).toBeInTheDocument();expect(screen.getByText(/coefficient_k_per_thousand_sqft = 42.0/)).toBeInTheDocument();expect(screen.getByText(/Separate additional practice/)).toBeInTheDocument();
  await waitFor(()=>expect(JSON.parse(localStorage.getItem(key)!).objectives["linear-regression.equation.experiment"].completed).toBe(true));
  const before=localStorage.getItem(key);fireEvent.change(screen.getByRole("textbox",{name:"Your energy explanation"}),{target:{value:"Half a kWh less per square metre over twelve square metres"}});fireEvent.click(screen.getByRole("button",{name:"Reveal energy comparison"}));expect(screen.getByText(/44 to 38 kWh/)).toBeInTheDocument();expect(localStorage.getItem(key)).toBe(before);
  fireEvent.click(screen.getByRole("button",{name:"Replay discovery"}));expect(localStorage.getItem(key)).toBe(before);
 });
});


it("preserves assessed history and mastery across equation review, reset and transfer",async()=>{
 const date="2026-10-15T00:00:00Z";
 const seed=markLessonState(createEmptyEvidence("linear-regression.v1"),"linear-regression.equation","assessed",["historic-objective"],date);
 seed.objectives["historic-objective"]={completed:true,mastered:true,evidenceIds:["historical-assessment"],updatedAt:date};
 seed.masteryEvidence=[{id:"historical-assessment",objectiveId:"historic-objective",sourceType:"assessment",sourceId:"linear-regression.mastery.v1",level:3,awardedAt:date}];
 seed.assessmentAttempts=[{id:"historical-attempt",assessmentId:"linear-regression.mastery.v1",variantId:"v01",score:24,maxScore:24,objectiveIds:["historic-objective"],submittedAt:date}];
 seed.projectMilestones=[{projectId:"other-project",milestoneId:"milestone",completed:true,evidenceId:"project-evidence",updatedAt:date}];
 localStorage.setItem(key,JSON.stringify(seed));render(<RegressionLabRouter lessonId="equation"/>);
 await waitFor(()=>expect(screen.getByRole("heading",{name:"Existing lesson checks complete"})).toBeInTheDocument());
 fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));fireEvent.click(screen.getByRole("button",{name:"Reset parameters"}));fireEvent.click(screen.getByRole("button",{name:"Reveal energy comparison"}));fireEvent.click(screen.getByRole("button",{name:"Replay discovery"}));
 const stored=JSON.parse(localStorage.getItem(key)!);
 expect(stored.lessons["linear-regression.equation"].state).toBe("assessed");expect(stored.objectives).toEqual(seed.objectives);expect(stored.masteryEvidence).toEqual(seed.masteryEvidence);expect(stored.assessmentAttempts).toEqual(seed.assessmentAttempts);expect(stored.projectMilestones).toEqual(seed.projectMilestones);
});


it("places mathematics and practice before optional exploration and transfer after practice",()=>{
 render(<RegressionLabRouter lessonId="equation"/>);
 expect(screen.queryByText(/ŷ = wx/)).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));
 const math=screen.getByRole("heading",{name:"Mathematical reasoning"}),practice=screen.getByRole("heading",{name:"Guided exercises and misconception checks"}),transfer=screen.getByRole("heading",{name:"Try a new context: energy use (unscored)"}),exploreHeading=screen.getByRole("heading",{name:"Free exploration: weight tilts; bias lifts"});
 expect(math.compareDocumentPosition(practice)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(practice.compareDocumentPosition(transfer)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(transfer.compareDocumentPosition(exploreHeading)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(document.activeElement).toBe(math);
});


it("explicitly introduces the equation, multiplication and prediction notation after discovery",()=>{
 render(<RegressionLabRouter lessonId="equation"/>);
 expect(screen.queryByRole("heading",{name:"From the estimating rule to the equation"})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Review explanation and free exploration"}));
 expect(screen.getByRole("heading",{name:"From the estimating rule to the equation"})).toBeInTheDocument();
 expect(screen.getByText("ŷ = w × x + b",{exact:true})).toBeInTheDocument();
 expect(screen.getByText("245 = 42 × 2.5 + 140",{exact:true})).toBeInTheDocument();
 expect(screen.getByText(/Here we use the hat to distinguish an estimate from the recorded value/)).toBeInTheDocument();
});
