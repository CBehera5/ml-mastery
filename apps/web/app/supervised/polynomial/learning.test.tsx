import {experimentGuide} from "../simple-experiment";
// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PolynomialAssessment, PolynomialLesson, PolynomialOverview } from "./learning";
import { FORMS, MASTERY_AVAILABLE } from "./catalog";
import { canonical } from "../../python/foundation/contracts";
import { emptyState, load, serialize, STORAGE_KEY } from "./model";
beforeEach(()=>localStorage.clear()); afterEach(cleanup);
async function open(lesson=0) {render(<PolynomialLesson lesson={lesson}/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Objective understanding and guided practice"})).toBeEnabled());}
it("teaches all16 objectives with worked mathematics, Python, comparison and contextual recall",async()=>{
 for(let lesson=0;lesson<4;lesson++){await open(lesson);for(let objective=1;objective<=4;objective++)expect(screen.getByRole("heading",{name:new RegExp(`^PR0${lesson+1}.O${objective}:`)})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Mathematics and symbols"})).toBeInTheDocument();expect(screen.getByRole("link",{name:"Evaluation Foundations"})).toHaveAttribute("href","/supervised/evaluation");cleanup();}
});
it("persists polynomial practice without reading or overwriting earlier scopes",async()=>{
 const earlier=["ml-math-lab:supervised:ev:full:v1","ml-math-lab:supervised:ev:prototype:v1","ml-math-lab:python:sklearn:v1","regression-progress"];
 earlier.forEach(key=>localStorage.setItem(key,"earlier-mastery"));await open();const panel=within(screen.getByRole("region",{name:"Practice PR01.O3"}));fireEvent.change(panel.getByRole("spinbutton"),{target:{value:"6"}});fireEvent.click(panel.getByRole("button",{name:"Check PR01.O3"}));expect(panel.getByRole("status")).toHaveTextContent("Correct.");expect(load(localStorage.getItem(STORAGE_KEY)).practice[2].proof).not.toBeNull();expect(load(localStorage.getItem(STORAGE_KEY)).mastery).toBeNull();earlier.forEach(key=>expect(localStorage.getItem(key)).toBe("earlier-mastery"));
});
it("requires prediction and changed meaningful state, reveals reference curves/text and clears stale results",async()=>{
 await open(3);fireEvent.click(screen.getByRole("radio",{name:experimentGuide("polynomial",3).options[1].label}));expect(screen.getByRole("button",{name:"Show the result"})).toBeDisabled();fireEvent.change(screen.getByRole("combobox",{name:"Your prediction"}),{target:{value:"I expect a valid feature map and plausible in-range prediction"}});fireEvent.click(screen.getByRole("button",{name:"Show the result"}));expect(screen.getByText("extrapolation; no reliability evidence")).toBeInTheDocument();expect(screen.getByText("Read all21 plotted coordinates as a numerical table")).toBeInTheDocument();fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"}),{target:{value:"permitted-development"}});fireEvent.click(screen.getByRole("button",{name:"Check my explanation"}));expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();fireEvent.click(screen.getByRole("radio",{name:experimentGuide("polynomial",3).options[0].label}));expect(screen.queryByRole("combobox",{name:"Supported explanation"})).not.toBeInTheDocument();expect(screen.getByRole("combobox",{name:"Your prediction"})).toHaveValue("");
});
it.runIf(MASTERY_AVAILABLE)("requires confirmation, restores review and preserves mastery after a failed fresh retry",async()=>{
 const state=emptyState();state.draft.answers=FORMS[0].map(family=>canonical(family.accepted[0]));localStorage.setItem(STORAGE_KEY,serialize(state));render(<PolynomialAssessment/>);await waitFor(()=>expect(screen.getByRole("group",{name:"Independent answers"})).toBeEnabled());fireEvent.click(screen.getByRole("button",{name:"Review all16 answers"}));expect(screen.getByRole("button",{name:"Submit confirmed attempt"})).toBeDisabled();fireEvent.click(screen.getByRole("checkbox",{name:/I reviewed the whole attempt/}));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));expect(screen.getByRole("heading",{name:"Mastery demonstrated: 16/16"})).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Retry next independent form"}));fireEvent.click(screen.getByRole("button",{name:"Review all16 answers"}));fireEvent.click(screen.getByRole("checkbox",{name:/I reviewed the whole attempt/}));fireEvent.click(screen.getByRole("button",{name:"Submit confirmed attempt"}));expect(screen.getByRole("heading",{name:"Not yet mastered: 0/16"})).toBeInTheDocument();expect(load(localStorage.getItem(STORAGE_KEY)).mastery?.score).toBe(16);
});
it("provides an honest overview and notebook, not a later algorithm course",()=>{render(<PolynomialOverview/>);expect(screen.getByRole("link",{name:"Download the Polynomial Regression notebook"})).toHaveAttribute("href","/notebooks/supervised-polynomial.ipynb");expect(screen.queryByRole("link",{name:/Lasso|Random Forest/})).not.toBeInTheDocument();});
