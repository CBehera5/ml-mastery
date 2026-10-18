// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { NaiveBayesAssessment, NaiveBayesLesson, NaiveBayesOverview } from "./learning";
import { configurations, PREDICTIONS } from "./catalog";
import { load, STORAGE_KEY } from "./model";
beforeEach(()=>localStorage.clear()); afterEach(cleanup);
async function open(lesson=0){render(<NaiveBayesLesson lesson={lesson}/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Objective understanding and guided practice"})).toBeEnabled());}
function reveal(id:string){fireEvent.change(screen.getByRole("combobox",{name:"Experiment configuration"}),{target:{value:id}});fireEvent.change(screen.getByRole("combobox",{name:"Your prediction"}),{target:{value:PREDICTIONS[1]}});fireEvent.change(screen.getByRole("combobox",{name:"Predicted reason"}),{target:{value:"causal"}});fireEvent.click(screen.getByRole("button",{name:"Reveal frozen outcome"}));}
it("teaches all16 objectives without changing smoothing's noncritical status",async()=>{
 for(let lesson=0;lesson<4;lesson++){await open(lesson);for(let objective=1;objective<=4;objective++)expect(screen.getByRole("heading",{name:new RegExp(`^NB0${lesson+1}.O${objective}:`)})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Mathematics and symbols"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Naive Bayes and comparison"})).toBeInTheDocument();cleanup();}
});
it("restores correct posterior practice without changing other scopes or awarding mastery",async()=>{
 const keys=["ml-math-lab:supervised:knn:full:v1","ml-math-lab:supervised:logistic:full:v1","regression-progress","python"];keys.forEach(key=>localStorage.setItem(key,"earlier-mastery"));await open();const region=within(screen.getByRole("region",{name:"Practice NB01.O1"}));fireEvent.change(region.getByRole("spinbutton"),{target:{value:".75"}});fireEvent.click(region.getByRole("button",{name:"Check NB01.O1"}));expect(region.getByRole("status")).toHaveTextContent("Correct.");expect(load(localStorage.getItem(STORAGE_KEY)).practice[0].proof).not.toBeNull();expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();keys.forEach(key=>expect(localStorage.getItem(key)).toBe("earlier-mastery"));cleanup();await open();expect(screen.getByRole("region",{name:"Practice NB01.O1"})).toHaveTextContent("Practice demonstrated; not mastery.");
});
for(const lab of [0,1])it(`lab ${lab} requires prediction and reason before reveal and changed explained activity`,async()=>{
 await open(lab===0?0:2);expect(screen.getByRole("button",{name:"Reveal frozen outcome"})).toBeDisabled();const config=configurations(lab)[1];reveal(config.id);expect(screen.getByRole("table",{name:"Class priors,log scores and normalized posteriors"})).toBeInTheDocument();fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"}),{target:{value:config.reasonId}});fireEvent.click(screen.getByRole("button",{name:"Check experiment explanation"}));expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();
});
for(const sample of [{id:"NB-E1.supplied.allzero.v1",lesson:0,text:/Undefined posterior:/},{id:"NB-E1.reject.alpha0-conflict.v1",lesson:0,text:/Rejected configuration:/},{id:"NB-E2.reject.global-constant.v1",lesson:2,text:/Rejected configuration:/}])it(`renders ${sample.id} without fabricated probabilities`,async()=>{
 await open(sample.lesson);reveal(sample.id);expect(screen.getByText(sample.text)).toHaveTextContent("No class prediction exists");expect(screen.queryByRole("table",{name:"Class priors,log scores and normalized posteriors"})).not.toBeInTheDocument();
});
it("keeps independent mastery separate from overview completion",async()=>{
 render(<NaiveBayesOverview/>);expect(screen.getByText(/13\/16 families/)).toBeInTheDocument();cleanup();render(<NaiveBayesAssessment/>);expect(screen.getByText(/16 objectives; at least13/)).toBeInTheDocument();
});
it("distinguishes valid log zero support from undefined posterior without changing the frozen value",async()=>{
 await open();reveal("NB-E1.supplied.3.v1");expect(screen.getAllByText(/log of exact zero support; not an undefined posterior/).length).toBeGreaterThan(0);expect(configurations(0).find(item=>item.id==="NB-E1.supplied.3.v1")!.expected.log_class_scores).toEqual([{tag:"infinity",sign:"negative"},Math.log(.25)]);
});
