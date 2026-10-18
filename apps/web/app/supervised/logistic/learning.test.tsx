// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { LogisticAssessment, LogisticLesson, LogisticOverview } from "./learning";
import { configurations, FORMS, MASTERY_AVAILABLE, PREDICTIONS } from "./catalog";
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
 await open(sample.lesson);fireEvent.change(screen.getByRole("combobox",{name:"Experiment configuration"}),{target:{value:sample.id}});fireEvent.change(screen.getByRole("combobox",{name:"Your prediction"}),{target:{value:PREDICTIONS[0]}});fireEvent.click(screen.getByRole("button",{name:"Reveal frozen outcome"}));
 if(sample.kind==="saturation"){expect(screen.getByText(/Finite-logit mathematical loss:/)).toHaveTextContent("40");expect(screen.getAllByText("positive infinity",{exact:true}).length).toBeGreaterThan(0);}
 if(sample.kind==="undefined")expect(screen.getAllByText("undefined",{exact:true}).length).toBeGreaterThanOrEqual(3);
 if(sample.kind==="fitted")expect(screen.queryByText(/Finite-logit mathematical loss:/)).not.toBeInTheDocument();
 if(sample.kind==="unsupported")expect(screen.getByText(/Unsupported model configuration: no model was fitted/)).toBeInTheDocument();
});
it("teaches all24 objectives with contextual recall, mathematics, Python and comparison",async()=>{
 for(let lesson=0;lesson<6;lesson++){await open(lesson);for(let objective=1;objective<=4;objective++)expect(screen.getByRole("heading",{name:new RegExp(`^LG0${lesson+1}.O${objective}:`)})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Mathematics and symbols"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Logistic and comparison"})).toBeInTheDocument();cleanup();}
});
it("saves correct practice and restores without touching earlier module evidence",async()=>{
 const old=["ml-math-lab:supervised:polynomial:full:v1","ml-math-lab:supervised:ev:full:v1","python","regression-progress"];old.forEach(key=>localStorage.setItem(key,"earlier-mastery"));await open();const region=within(screen.getByRole("region",{name:"Practice LG01.O1"}));fireEvent.change(region.getByRole("spinbutton"),{target:{value:".25"}});fireEvent.click(region.getByRole("button",{name:"Check LG01.O1"}));expect(region.getByRole("status")).toHaveTextContent("Correct.");expect(load(localStorage.getItem(STORAGE_KEY)).practice[0].proof).not.toBeNull();expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();old.forEach(key=>expect(localStorage.getItem(key)).toBe("earlier-mastery"));cleanup();await open();expect(screen.getByRole("region",{name:"Practice LG01.O1"})).toHaveTextContent("Practice demonstrated; not mastery.");
});
for(const lab of [0,1])it(`lab ${lab} requires prediction, reveals numerical alternative and rejects stale reasoning`,async()=>{
 await open(lab?2:0);const config=configurations(lab)[1];fireEvent.change(screen.getByRole("combobox",{name:"Experiment configuration"}),{target:{value:config.id}});expect(screen.getByRole("button",{name:"Reveal frozen outcome"})).toBeDisabled();fireEvent.change(screen.getByRole("combobox",{name:"Your prediction"}),{target:{value:PREDICTIONS[0]}});fireEvent.click(screen.getByRole("button",{name:"Reveal frozen outcome"}));if(lab){expect(screen.getByRole("table",{name:"Actual rows, predicted columns: exact confusion counts"})).toBeInTheDocument();}else{expect(screen.getByText("Read all21 sigmoid coordinates")).toBeInTheDocument();}fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"}),{target:{value:String(config.expected.reason)}});fireEvent.click(screen.getByRole("button",{name:"Check experiment explanation"}));expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();fireEvent.change(screen.getByRole("combobox",{name:"Experiment configuration"}),{target:{value:configurations(lab)[0].id}});expect(screen.queryByRole("combobox",{name:"Supported explanation"})).not.toBeInTheDocument();expect(screen.getByRole("combobox",{name:"Your prediction"})).toHaveValue("");
});
it.runIf(MASTERY_AVAILABLE)("requires confirmation and preserves earlier mastery after a failed complete retry",async()=>{
 const state=emptyState();state.draft.answers=FORMS[0].map(family=>canonical(family.accepted[0]));localStorage.setItem(STORAGE_KEY,serialize(state));render(<LogisticAssessment/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Independent answers"})).toBeEnabled());fireEvent.click(screen.getByRole("button",{name:"Review all24 answers"}));expect(screen.getByRole("button",{name:"Submit confirmed attempt"})).toBeDisabled();fireEvent.click(screen.getByRole("checkbox",{name:/I reviewed the whole attempt/}));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));expect(screen.getByRole("heading",{name:"Mastery demonstrated: 24/24"})).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Retry next independent form"}));fireEvent.click(screen.getByRole("button",{name:"Review all24 answers"}));fireEvent.click(screen.getByRole("checkbox",{name:/I reviewed the whole attempt/}));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));expect(screen.getByRole("heading",{name:"Not yet mastered: 0/24"})).toBeInTheDocument();expect(load(localStorage.getItem(STORAGE_KEY)).mastery?.score).toBe(24);
});
it("offers only the approved module and notebook",()=>{render(<LogisticOverview/>);expect(screen.getByRole("link",{name:"Download the Logistic Regression notebook"})).toHaveAttribute("href","/notebooks/supervised-logistic.ipynb");expect(screen.queryByRole("link",{name:/KNN course/})).not.toBeInTheDocument();});
