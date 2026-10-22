import {Graphic} from "./graphic";
import { LESSONS } from "./teaching";
import {experimentGuide} from "../simple-experiment";
// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import {afterEach,expect,it} from "vitest";
import {cleanup,fireEvent,render,screen,waitFor,within} from "@testing-library/react";
import {SVMAssessment,SVMLesson,SVMOverview} from "./learning";
import {configurations,PRACTICE} from "./catalog";
import {load,STORAGE_KEY} from "./model";
afterEach(()=>{cleanup();localStorage.clear();});
async function open(lesson=0){render(<SVMLesson lesson={lesson}/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Objective understanding and guided practice"})).toBeEnabled());}
for(let lesson=0;lesson<5;lesson++)it(`teaches all four SV0${lesson+1} objectives and applications`,async()=>{
 await open(lesson);for(let objective=1;objective<=4;objective++)expect(screen.getAllByRole("heading", { name: LESSONS[lesson].objectives[objective - 1] })[0]).toBeInTheDocument();
 expect(screen.getByRole("heading",{name:"Mathematics and symbols"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Python application"})).toBeInTheDocument();
});
it("restores geometry practice without granting mastery or modifying earlier evidence",async()=>{
 const prior=["ml-math-lab:supervised:decision-trees:full:v1","python","regression-progress"];prior.forEach(key=>localStorage.setItem(key,"earlier-evidence"));await open(0);
 const practice=within(screen.getByRole("region",{name:"Practice SV01.O1"}));fireEvent.change(practice.getAllByRole("spinbutton")[0],{target:{value:String((PRACTICE[0][0].accepted[0][0] as {value:number}).value)}});fireEvent.change(practice.getAllByRole("spinbutton")[1],{target:{value:String((PRACTICE[0][0].accepted[0][1] as {value:number}).value)}});fireEvent.click(practice.getByRole("button",{name: "Check my answer, SV01.O1"}));
 expect(practice.getByRole("status")).toHaveTextContent("Correct.");expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();prior.forEach(key=>expect(localStorage.getItem(key)).toBe("earlier-evidence"));cleanup();await open(0);expect(screen.getByRole("region",{name:"Practice SV01.O1"})).toHaveTextContent("Practice demonstrated");
});
for(const lab of [0,1])it(`lab${lab} requires prediction,changes and a supported explanation;shows OOB missingness`,async()=>{
 await open(lab===0?0:2);fireEvent.click(screen.getByRole("radio",{name:experimentGuide("svm",lab===0?0:2).options[0].label}));expect(screen.getByRole("button",{name:"Show the result"})).toBeDisabled();const config=configurations(lab).find(c=>c.id===experimentGuide("svm",lab===0?0:2).options[1].id)!;
 fireEvent.click(screen.getByRole("radio",{name:experimentGuide("svm",lab===0?0:2).options[1].label}));fireEvent.change(screen.getByRole("combobox",{name:"Your prediction"}),{target:{value:config.predictionOptions[0].id}});fireEvent.change(screen.getByRole("combobox",{name:"Predicted reason"}),{target:{value:"probability"}});fireEvent.click(screen.getByRole("button",{name:"Show the result"}));
 if(lab===0) expect(screen.getByRole("table",{name:"Manual scores,decisions and signed distances"})).toBeInTheDocument(); else {expect(screen.getByRole("table",{name:"Validation decision scores and classes"})).toBeInTheDocument();expect(screen.getByRole("table",{name:"Training supports and hinge violations"})).toBeInTheDocument();}
 fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"}),{target:{value:config.reasonId}});fireEvent.click(screen.getByRole("button",{name:"Check my explanation"}));expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();
});
it("keeps completion separate from the independent assessment",()=>{render(<SVMOverview/>);expect(screen.getByText(/16\/20 families/)).toBeInTheDocument();cleanup();render(<SVMAssessment/>);expect(screen.getByText(/20 objectives; at least16/)).toBeInTheDocument();});

it("preserves fitted linear margin numerical alternatives independently of the beginner geometry control",()=>{render(<Graphic config={configurations(0)[1]}/>);expect(screen.getByRole("table",{name:"Validation decision scores and classes"})).toBeInTheDocument();expect(screen.getByRole("table",{name:"Training supports and hinge violations"})).toBeInTheDocument();});
