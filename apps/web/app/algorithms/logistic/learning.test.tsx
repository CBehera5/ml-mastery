import {Values} from "../module/learning";
import {experimentGuide} from "../simple-experiment";
// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { LogisticAssessment, LogisticLesson, LogisticOverview, Graphic } from "./learning";
import { configurations, FORMS, LESSONS, MASTERY_AVAILABLE, PREDICTIONS } from "./catalog";
import { canonical } from "../../python/foundation/contracts";
import { emptyState, load, serialize, STORAGE_KEY } from "./model";
beforeEach(()=>localStorage.clear()); afterEach(cleanup);
async function open(lesson=0){render(<LogisticLesson lesson={lesson}/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Objective understanding and guided practice"})).toBeEnabled());}
for(const sample of [
 {id:"LG-E1.LG.authored.w2.positive-tail.y0.v1",lesson:0,kind:"saturation"},
 {id:"LG-E1.fit.C1.q1",lesson:0,kind:"fitted"},
 {id:"LG-E1.invalid.nonpositive-C",lesson:0,kind:"unsupported"},
 {id:"LG-E2.no-actual-positives.t1",lesson:2,kind:"undefined"}
])it(`renders ${sample.kind} without conflating endpoint, missing and finite outcomes`,async()=>{
 const config=configurations(sample.lesson===0?0:1).find(c=>c.id===sample.id)!;render(<><Graphic lab={sample.lesson===0?0:1} config={config}/><Values value={config.expected} label="Numerical regression evidence"/></>);
 if(sample.kind==="saturation"){expect(screen.getByText(/Finite-logit mathematical loss:/)).toHaveTextContent("40");expect(screen.getAllByText("positive infinity",{exact:true}).length).toBeGreaterThan(0);}
 if(sample.kind==="undefined")expect(screen.getAllByText("undefined",{exact:true}).length).toBeGreaterThanOrEqual(3);
 if(sample.kind==="fitted")expect(screen.queryByText(/Finite-logit mathematical loss:/)).not.toBeInTheDocument();
 if(sample.kind==="unsupported")expect(screen.getByText(/Unsupported model configuration: no model was fitted/)).toBeInTheDocument();
});
it("teaches all24 objectives with contextual recall, mathematics, Python and comparison",async()=>{
 for(let lesson=0;lesson<6;lesson++){await open(lesson);for(let objective=1;objective<=4;objective++)expect(screen.getAllByRole("heading",{name:LESSONS[lesson].objectives[objective-1]})[0]).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Review mathematics and Python"}));fireEvent.click(screen.getByText("Library workflow and comparison",{exact:true}));expect(screen.getByRole("heading",{name:"Mathematics and symbols"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Logistic and comparison"})).toBeInTheDocument();cleanup();}
});
it("saves correct practice and restores without touching earlier module evidence",async()=>{
 const old=["ml-math-lab:supervised:polynomial:full:v1","ml-math-lab:supervised:ev:full:v1","python","regression-progress"];old.forEach(key=>localStorage.setItem(key,"earlier-mastery"));await open();const region=within(screen.getByRole("region",{name:"Practice LG01.O1"}));fireEvent.change(region.getByRole("spinbutton"),{target:{value:".25"}});fireEvent.click(region.getByRole("button",{name: "Check my answer, LG01.O1"}));expect(region.getByRole("status")).toHaveTextContent("Correct.");expect(load(localStorage.getItem(STORAGE_KEY)).practice[0].proof).not.toBeNull();expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();old.forEach(key=>expect(localStorage.getItem(key)).toBe("earlier-mastery"));cleanup();await open();expect(screen.getByRole("region",{name:"Practice LG01.O1"})).toHaveTextContent("Practice demonstrated; not mastery.");
});
for(const lab of [0,1])it(`lab ${lab} requires prediction, reveals numerical alternative and rejects stale reasoning`,async()=>{
 await open(lab?2:0);const config=configurations(lab).find(c=>c.id===experimentGuide("logistic",lab?2:0).options[1].id)!;fireEvent.click(screen.getByRole("radio",{name:experimentGuide("logistic",lab?2:0).options[1].label}));expect(screen.getByRole("button",{name:"Show the result"})).toBeDisabled();fireEvent.change(screen.getByRole("combobox",{name:"Your prediction"}),{target:{value:PREDICTIONS[0]}});fireEvent.click(screen.getByRole("button",{name:"Show the result"}));if(lab){expect(screen.getByRole("table",{name:"Actual rows, predicted columns: exact confusion counts"})).toBeInTheDocument();}else{expect(screen.getByText("Read all21 sigmoid coordinates")).toBeInTheDocument();}fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"}),{target:{value:String(config.expected.reason)}});fireEvent.click(screen.getByRole("button",{name:"Check my explanation"}));expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();fireEvent.click(screen.getByRole("radio",{name:experimentGuide("logistic",lab?2:0).options[0].label}));expect(screen.queryByRole("combobox",{name:"Supported explanation"})).not.toBeInTheDocument();expect(screen.getByRole("combobox",{name:"Your prediction"})).toHaveValue("");
});
it.runIf(MASTERY_AVAILABLE)("requires confirmation and preserves earlier mastery after a failed complete retry",async()=>{
 const state=emptyState();state.draft.answers=FORMS[0].map(family=>canonical(family.accepted[0]));localStorage.setItem(STORAGE_KEY,serialize(state));render(<LogisticAssessment/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Independent answers"})).toBeEnabled());fireEvent.click(screen.getByRole("button",{name:"Review all24 answers"}));expect(screen.getByRole("button",{name:"Submit confirmed attempt"})).toBeDisabled();fireEvent.click(screen.getByRole("checkbox",{name:/I reviewed the whole attempt/}));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));expect(screen.getByRole("heading",{name:"Mastery demonstrated: 24/24"})).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Retry next independent form"}));fireEvent.click(screen.getByRole("button",{name:"Review all24 answers"}));fireEvent.click(screen.getByRole("checkbox",{name:/I reviewed the whole attempt/}));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));expect(screen.getByRole("heading",{name:"Not yet mastered: 0/24"})).toBeInTheDocument();expect(load(localStorage.getItem(STORAGE_KEY)).mastery?.score).toBe(24);
});
it("offers only the approved module and notebook",()=>{render(<LogisticOverview/>);expect(screen.getByRole("link",{name:"Download the Logistic Regression notebook"})).toHaveAttribute("href","/notebooks/supervised-logistic.ipynb");expect(screen.queryByRole("link",{name:/KNN course/})).not.toBeInTheDocument();});

it("keeps the discovery ephemeral and reveals the exact same-customer coefficient comparison",async()=>{
 await open();
 const saved=localStorage.getItem(STORAGE_KEY);
 expect(screen.queryByRole("heading",{name:"Mathematics and symbols"})).not.toBeInTheDocument();
 expect(screen.getByRole("button",{name:"Try the comparison"})).toBeDisabled();
 fireEvent.click(screen.getByRole("radio",{name:"It rises, but does not double"}));
 fireEvent.click(screen.getByRole("button",{name:"Try the comparison"}));
 expect(screen.getByRole("heading",{name:"What actually changed?"})).toBeInTheDocument();
 expect(screen.getByText(/Coefficient 2; score 2.197225; probability 90%/)).toBeInTheDocument();
 expect(screen.getByText(/Your prediction matches this outcome/)).toHaveTextContent("match alone does not demonstrate understanding");
 expect(screen.getByRole("heading",{name:"Mathematics and symbols"})).toBeInTheDocument();
 expect(screen.getByText(/An equals sign assigns a value/)).toBeInTheDocument();
 expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);
 fireEvent.click(screen.getByRole("button",{name:"Replay guided comparison"}));
 expect(screen.getByRole("button",{name:"Try the comparison"})).toBeDisabled();
 expect(screen.queryByRole("heading",{name:"What actually changed?"})).not.toBeInTheDocument();
 expect(screen.queryByRole("heading",{name:"Mathematics and symbols"})).not.toBeInTheDocument();
 expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);
});
it.each(["It doubles to 150%","Not sure"])("responds truthfully to %s without claiming understanding",async(choice)=>{
 await open();fireEvent.click(screen.getByRole("radio",{name:choice}));fireEvent.click(screen.getByRole("button",{name:"Try the comparison"}));
 expect(screen.getByText(/Coefficient 2; score 2.197225; probability 90%/)).toBeInTheDocument();
 expect(screen.getByText(choice==="Not sure"?/You chose Not sure/:/differs from your prediction/)).toBeInTheDocument();
 expect(load(localStorage.getItem(STORAGE_KEY)).labs.every(lab=>!lab.credit)).toBe(true);
 expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();
});
it.each([
 [1,"The loss decreases",/Probability 90%; observed label 1; row log loss 0.105361/],
 [2,"It falls from four to three",/Threshold 0.6; contacts 3; true positives 2; false positives 1; false negatives 0/],
 [3,"C = 0.1",/C = 10; first coefficient 1.210403; customer probability 73.84%; development log loss 0.759381/],
 [4,"No: held-out information entered preprocessing",/Accuracy 75%; evaluation boundary invalid/],
 [5,"No: the probabilities can differ despite identical actions",/Accuracy 75%; log loss 0.631825/],
] as const)("lesson %i replays its specific verified comparison",async(lesson,choice,result)=>{
 await open(lesson);fireEvent.click(screen.getByRole("radio",{name:choice}));fireEvent.click(screen.getByRole("button",{name:"Try the comparison"}));
 expect(screen.getByText(result)).toBeInTheDocument();expect(screen.getByRole("heading",{name:"From mathematics to Python"})).toBeInTheDocument();
 expect(screen.getByRole("navigation",{name:"Logistic Regression lessons"}).querySelector('[aria-current="page"]')).toHaveAttribute("href",`/algorithms/logistic/lg0${lesson+1}`);
 expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
});
it("offers only the two lesson-specific coefficient settings and no internal-case selector",async()=>{
 await open();const guide=experimentGuide("logistic",0);
 const group=screen.getByRole("group",{name:guide.label});
 expect(within(group).getAllByRole("radio")).toHaveLength(2);
 expect(within(group).getByRole("radio",{name:"2: doubled coefficient"})).toBeInTheDocument();
 expect(screen.queryByRole("combobox",{name:"Experiment configuration"})).not.toBeInTheDocument();
 expect(document.body.textContent).not.toContain("LG-E1.LG.authored");
});

it("supplies the missing odds, shapes and data-boundary explanations before practice",async()=>{
 await open();fireEvent.click(screen.getByRole("button",{name:"Review mathematics and Python"}));
 expect(screen.getByRole("heading",{name:"From probability to odds and log-odds"})).toBeInTheDocument();
 expect(screen.getByRole("heading",{name:"Read rows and class columns"})).toBeInTheDocument();
 expect(screen.getByText(/increasing x by 1 adds w/)).toBeInTheDocument();
 const bridge=screen.getByRole("heading",{name:"Connect the ideas before practice"}).parentElement!;
 expect(bridge.compareDocumentPosition(document.getElementById("lesson-practice")!)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 cleanup();await open(1);fireEvent.click(screen.getByRole("button",{name:"Review mathematics and Python"}));
 expect(screen.getByRole("heading",{name:"How loss gives a training signal"})).toBeInTheDocument();
 expect(screen.getByText(/Development or validation labels may compare declared/)).toBeInTheDocument();
 expect(screen.queryByText(/held-out labels must not influence parameter updates or selection\./)).not.toBeInTheDocument();
});
it("lets learners calculate sufficient precision without changing scores or submitting practice",async()=>{
 await open(1);const saved=localStorage.getItem(STORAGE_KEY);
 fireEvent.click(screen.getByText("Numerical workbench and precision instructions",{exact:true}));
 fireEvent.change(screen.getByRole("spinbutton",{name:"Probability for calculation"}),{target:{value:".25"}});
 fireEvent.click(screen.getByRole("button",{name:"Calculate without submitting"}));
 expect(screen.getByRole("status",{name:"Calculation result"})).toHaveTextContent("1.38629436111989");
 expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);
 fireEvent.change(screen.getByRole("spinbutton",{name:"Probability for calculation"}),{target:{value:"0"}});
 fireEvent.click(screen.getByRole("button",{name:"Calculate without submitting"}));
 expect(screen.getByRole("status",{name:"Calculation result"})).toHaveTextContent("strictly between 0 and 1");
});
