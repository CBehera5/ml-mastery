// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import {afterEach, expect, it} from "vitest";
import data from "./experiment-guides.json";
import {ExperimentChoice, ExperimentComparison, ExperimentNumbers, experimentGuide, normalizeLessonConfig} from "./simple-experiment";
import * as polynomial from "./polynomial/catalog";
import * as regularization from "./regularization/catalog";
import * as logistic from "./logistic/catalog";
import * as knn from "./knn/catalog";
import * as nb from "./naive-bayes/catalog";
import * as svm from "./svm/catalog";
import * as trees from "./decision-trees/catalog";
import * as forests from "./random-forests/catalog";
import * as boosting from "./gradient-boosting/catalog";
import * as mlp from "./mlp/catalog";
import * as selection from "./model-selection/catalog";
import * as evaluation from "./module/catalog";
const catalogs={polynomial,regularization,logistic,knn,"naive-bayes":nb,svm,"decision-trees":trees,"random-forests":forests,"gradient-boosting":boosting,mlp,"model-selection":selection,module:evaluation};
afterEach(cleanup);
const cases=Object.entries(data).flatMap(([module,rows])=>rows.map((_,lesson)=>({module,lesson})));
it("covers all 63 existing algorithm and evaluation lessons",()=>expect(cases).toHaveLength(63));
it.each(cases)("$module lesson $lesson offers a focused, labelled control over existing calculations",({module,lesson})=>{
 const guide=experimentGuide(module,lesson),catalog=catalogs[module as keyof typeof catalogs];
 const ids="configurations" in catalog?catalog.configurations(guide.lab).map(c=>c.id):catalog.configIds(guide.lab).map(c=>c.id);
 expect(guide.options.length).toBeGreaterThanOrEqual(2);expect(guide.options.length).toBeLessThanOrEqual(3);
 expect(new Set(guide.options.map(option=>option.id)).size).toBe(guide.options.length);
 let selected="";const {container}=render(<ExperimentChoice guide={guide} current="earlier-saved-case" onChange={id=>{selected=id;}}/>);
 expect(screen.getByRole("status")).toHaveTextContent("Existing progress is preserved");
 expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
 for(const option of guide.options){expect(ids).toContain(option.id);expect(container.textContent).not.toContain(option.id);}
 fireEvent.click(screen.getByRole("radio",{name:guide.options[1].label}));expect(selected).toBe(guide.options[1].id);
 expect(container.textContent).not.toMatch(/reference fixture|configuration|diagnostic cases|Selected:/i);
});
it("compares actual before-and-after values, including a decrease and no change, without declaring improvement",()=>{
 const {rerender}=render(<ExperimentComparison before={{prediction:20,training_mae:2}} after={{prediction:17,training_mae:2}}/>);
 expect(screen.getByRole("cell",{name:"20"})).toBeInTheDocument();expect(screen.getByRole("cell",{name:"17"})).toBeInTheDocument();
 expect(screen.getAllByRole("cell",{name:"2"})).toHaveLength(2);
 rerender(<ExperimentComparison before={{prediction:17}} after={{prediction:17}}/>);expect(screen.getAllByRole("cell",{name:"17"})).toHaveLength(2);
});
it("never prints manifest identifiers or unseen fields as results",()=>{
 const {container}=render(<ExperimentNumbers value={{id:"PR-E1.internal-case",fixture:"internal-fixture",prediction:17,secretTestRows:[123]}}/>);
 expect(screen.getByRole("cell",{name:"17"})).toBeInTheDocument();expect(container.textContent).not.toMatch(/PR-E1|fixture|123|secret/);
});
it("normalizes the real neural-network transport shape without changing its answers or numerical values",()=>{
 const raw={id:"x",prediction_question:"Predict",prediction_options:[{id:"forward",label:"Forward result"}],reason_options:[{id:"mechanism",label:"Mechanism"}],correct_prediction_id:"forward",correct_reason_id:"mechanism",forward:{probabilities_positive:[.75]},explanation:"Supplied explanation"};
 const result=normalizeLessonConfig(raw);
 expect(result.predictionOptions).toBe(raw.prediction_options);expect(result.correctPrediction).toBe("forward");expect(result.reference).toBe(raw);expect(raw).not.toHaveProperty("predictionOptions");
});

it("distinguishes Polynomial's supplied two-input rules from separately fitted one-input models",()=>{
 const guide=experimentGuide("polynomial",1);
 const a=polynomial.configFor(0,guide.options[0].id).expected,b=polynomial.configFor(0,guide.options[1].id).expected;
 expect(a.prediction).toBe(8);expect(b.prediction).toBe(32);
 expect((b.coefficients as number[]).slice(0,2)).toEqual(a.coefficients);
 expect(b.intercept).toBe(a.intercept);
 expect(guide.fixed).toContain("illustrations, not fitted models");
});
