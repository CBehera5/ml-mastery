import {experimentGuide} from "../simple-experiment";
// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { KNNAssessment, KNNLesson, KNNOverview, Graphic } from "./learning";
import { configurations, PREDICTIONS } from "./catalog";
import { load, STORAGE_KEY } from "./model";
beforeEach(()=>localStorage.clear()); afterEach(cleanup);
async function open(lesson=0){render(<KNNLesson lesson={lesson}/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Objective understanding and guided practice"})).toBeEnabled());}
it("teaches all16 objectives with mathematics, Python and comparison",async()=>{
 for(let lesson=0;lesson<4;lesson++){await open(lesson);for(let objective=1;objective<=4;objective++)expect(screen.getByRole("heading",{name:new RegExp(`^KN0${lesson+1}.O${objective}:`)})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Mathematics and symbols"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"KNN and comparison"})).toBeInTheDocument();cleanup();}
});
it("restores correct practice without changing prior module records or awarding mastery",async()=>{
 const keys=["ml-math-lab:supervised:logistic:full:v1","regression-progress","python"];keys.forEach(key=>localStorage.setItem(key,"earlier-mastery"));await open();const region=within(screen.getByRole("region",{name:"Practice KN01.O1"}));fireEvent.change(region.getByRole("spinbutton"),{target:{value:"5"}});fireEvent.click(region.getByRole("radio",{name:/^A then B$/}));fireEvent.click(region.getByRole("button",{name:"Check KN01.O1"}));expect(region.getByRole("status")).toHaveTextContent("Correct.");expect(load(localStorage.getItem(STORAGE_KEY)).practice[0].proof).not.toBeNull();expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();keys.forEach(key=>expect(localStorage.getItem(key)).toBe("earlier-mastery"));cleanup();await open();expect(screen.getByRole("region",{name:"Practice KN01.O1"})).toHaveTextContent("Practice demonstrated; not mastery.");
});
for(const lab of [0,1])it(`lab ${lab} requires prediction and an explained changed configuration`,async()=>{
 await open(lab===0?0:1);const config=configurations(lab).find(c=>c.id===experimentGuide("knn",lab===0?0:1).options[1].id)!;fireEvent.click(screen.getByRole("radio",{name:experimentGuide("knn",lab===0?0:1).options[1].label}));expect(screen.getByRole("button",{name:"Show the result"})).toBeDisabled();fireEvent.change(screen.getByRole("combobox",{name:"Your prediction"}),{target:{value:PREDICTIONS[0]}});fireEvent.change(screen.getByRole("combobox",{name:"Predicted reason"}),{target:{value:"labels-define-distance"}});fireEvent.click(screen.getByRole("button",{name:"Show the result"}));expect(screen.getByRole("table",{name:"Exact neighbor order, distances and votes"})).toBeInTheDocument();fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"}),{target:{value:String(config.expected.reason)}});fireEvent.click(screen.getByRole("button",{name:"Check my explanation"}));expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();
});
it("shows rejection as no prediction rather than class0",async()=>{
 const config=configurations(1).find(c=>c.id==="KN-E2.reject.cutoff-tie.v1")!;render(<Graphic lab={1} config={config}/>);expect(screen.getByText(/Rejected configuration:/)).toHaveTextContent("No class prediction exists");
});
it("keeps assessment independent from overview completion",async()=>{
 render(<KNNOverview/>);expect(screen.getByText(/13\/16 families/)).toBeInTheDocument();cleanup();render(<KNNAssessment/>);expect(screen.getByText(/16 objectives; at least13/)).toBeInTheDocument();expect(screen.queryByText("Mastery demonstrated")).not.toBeInTheDocument();
});
