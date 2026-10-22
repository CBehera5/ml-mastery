// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import {cleanup,fireEvent,render,screen,waitFor,within} from "@testing-library/react";
import {afterEach,beforeEach,expect,it} from "vitest";
import {experimentGuide} from "./simple-experiment";
import { PolynomialLesson as Lesson0 } from "./polynomial/learning";
import {configFor as config0} from "./polynomial/catalog";
import { RegularizationLesson as Lesson1 } from "./regularization/learning";
import {configFor as config1} from "./regularization/catalog";
import { LogisticLesson as Lesson2 } from "./logistic/learning";
import {configFor as config2} from "./logistic/catalog";
import { KNNLesson as Lesson3 } from "./knn/learning";
import {configFor as config3} from "./knn/catalog";
import { NaiveBayesLesson as Lesson4 } from "./naive-bayes/learning";
import {configFor as config4} from "./naive-bayes/catalog";
import { SVMLesson as Lesson5 } from "./svm/learning";
import {configFor as config5} from "./svm/catalog";
import { DecisionTreesLesson as Lesson6 } from "./decision-trees/learning";
import {configFor as config6} from "./decision-trees/catalog";
import { RandomForestsLesson as Lesson7 } from "./random-forests/learning";
import {configFor as config7} from "./random-forests/catalog";
import { GradientBoostingLesson as Lesson8 } from "./gradient-boosting/learning";
import {configFor as config8} from "./gradient-boosting/catalog";
import { EvaluationLesson as Lesson9 } from "./module/learning";
import {configFor as config9} from "./module/catalog";
beforeEach(()=>{localStorage.clear();localStorage.setItem("prior-course-evidence","preserved");});afterEach(cleanup);
const routes=[
{module:"polynomial",lesson:0,Lesson:Lesson0,configFor:config0},
{module:"polynomial",lesson:1,Lesson:Lesson0,configFor:config0},
{module:"polynomial",lesson:2,Lesson:Lesson0,configFor:config0},
{module:"polynomial",lesson:3,Lesson:Lesson0,configFor:config0},
{module:"regularization",lesson:0,Lesson:Lesson1,configFor:config1},
{module:"regularization",lesson:1,Lesson:Lesson1,configFor:config1},
{module:"regularization",lesson:2,Lesson:Lesson1,configFor:config1},
{module:"regularization",lesson:3,Lesson:Lesson1,configFor:config1},
{module:"regularization",lesson:4,Lesson:Lesson1,configFor:config1},
{module:"regularization",lesson:5,Lesson:Lesson1,configFor:config1},
{module:"logistic",lesson:0,Lesson:Lesson2,configFor:config2},
{module:"logistic",lesson:1,Lesson:Lesson2,configFor:config2},
{module:"logistic",lesson:2,Lesson:Lesson2,configFor:config2},
{module:"logistic",lesson:3,Lesson:Lesson2,configFor:config2},
{module:"logistic",lesson:4,Lesson:Lesson2,configFor:config2},
{module:"logistic",lesson:5,Lesson:Lesson2,configFor:config2},
{module:"knn",lesson:0,Lesson:Lesson3,configFor:config3},
{module:"knn",lesson:1,Lesson:Lesson3,configFor:config3},
{module:"knn",lesson:2,Lesson:Lesson3,configFor:config3},
{module:"knn",lesson:3,Lesson:Lesson3,configFor:config3},
{module:"naive-bayes",lesson:0,Lesson:Lesson4,configFor:config4},
{module:"naive-bayes",lesson:1,Lesson:Lesson4,configFor:config4},
{module:"naive-bayes",lesson:2,Lesson:Lesson4,configFor:config4},
{module:"naive-bayes",lesson:3,Lesson:Lesson4,configFor:config4},
{module:"svm",lesson:0,Lesson:Lesson5,configFor:config5},
{module:"svm",lesson:1,Lesson:Lesson5,configFor:config5},
{module:"svm",lesson:2,Lesson:Lesson5,configFor:config5},
{module:"svm",lesson:3,Lesson:Lesson5,configFor:config5},
{module:"svm",lesson:4,Lesson:Lesson5,configFor:config5},
{module:"decision-trees",lesson:0,Lesson:Lesson6,configFor:config6},
{module:"decision-trees",lesson:1,Lesson:Lesson6,configFor:config6},
{module:"decision-trees",lesson:2,Lesson:Lesson6,configFor:config6},
{module:"decision-trees",lesson:3,Lesson:Lesson6,configFor:config6},
{module:"decision-trees",lesson:4,Lesson:Lesson6,configFor:config6},
{module:"decision-trees",lesson:5,Lesson:Lesson6,configFor:config6},
{module:"random-forests",lesson:0,Lesson:Lesson7,configFor:config7},
{module:"random-forests",lesson:1,Lesson:Lesson7,configFor:config7},
{module:"random-forests",lesson:2,Lesson:Lesson7,configFor:config7},
{module:"random-forests",lesson:3,Lesson:Lesson7,configFor:config7},
{module:"random-forests",lesson:4,Lesson:Lesson7,configFor:config7},
{module:"gradient-boosting",lesson:0,Lesson:Lesson8,configFor:config8},
{module:"gradient-boosting",lesson:1,Lesson:Lesson8,configFor:config8},
{module:"gradient-boosting",lesson:2,Lesson:Lesson8,configFor:config8},
{module:"gradient-boosting",lesson:3,Lesson:Lesson8,configFor:config8},
{module:"gradient-boosting",lesson:4,Lesson:Lesson8,configFor:config8},
{module:"gradient-boosting",lesson:5,Lesson:Lesson8,configFor:config8},
{module:"module",lesson:0,Lesson:Lesson9,configFor:config9},
{module:"module",lesson:1,Lesson:Lesson9,configFor:config9},
{module:"module",lesson:2,Lesson:Lesson9,configFor:config9},
{module:"module",lesson:3,Lesson:Lesson9,configFor:config9},
{module:"module",lesson:4,Lesson:Lesson9,configFor:config9},
{module:"module",lesson:5,Lesson:Lesson9,configFor:config9},

];
it.each(routes)("$module lesson $lesson supports a changed prediction, reveal, explanation and reset without a case picker",async({module,lesson,Lesson,configFor})=>{
 render(<Lesson lesson={lesson}/>);
 const guide=experimentGuide(module,lesson);
 const controls=await screen.findByRole("group",{name:guide.label});
 await waitFor(()=>expect(within(controls).getAllByRole("radio")[0]).toBeEnabled());
 const chosen=guide.options[1];
 fireEvent.click(within(controls).getByRole("radio",{name:chosen.label}));
 const show=screen.getByRole("button",{name:"Show the result"});expect(show).toBeDisabled();
 const prediction=screen.getByRole("combobox",{name:"Your prediction"}) as HTMLSelectElement;
 fireEvent.change(prediction,{target:{value:prediction.options[1].value}});
 const predictedReason=screen.queryByRole("combobox",{name:"Predicted reason"}) as HTMLSelectElement|null;
 if(predictedReason)fireEvent.change(predictedReason,{target:{value:predictedReason.options[1].value}});
 expect(show).toBeEnabled();fireEvent.click(show);
 expect(screen.getByRole("heading",{name:"Experiment result"})).toHaveTextContent("Observed outcome");
 const c=configFor(guide.lab,chosen.id);
 const reason="reasonId" in c?c.reasonId:String(c.expected.reason);
 fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"}),{target:{value:reason}});
 fireEvent.click(screen.getByRole("button",{name:"Check my explanation"}));
 expect(screen.getByText("Meaningful interaction demonstrated; not independent mastery.")).toBeInTheDocument();
 const experiment=document.getElementById(module==="logistic"?"advanced-experiment":"experiment")!;
 expect(experiment.textContent).not.toContain(chosen.id);
 expect(experiment.textContent).not.toMatch(/Reference identifiers|Selected state:|reference fixture|PR-E1|RG-E1|SV-E1/);
 expect(within(experiment).queryByRole("combobox",{name:"Experiment configuration"})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Start again"}));
 expect(within(controls).getByRole("radio",{name:guide.options[0].label})).toBeChecked();
 expect(screen.getByRole("heading",{name:"Experiment result"})).toHaveTextContent("Outcome not revealed");
 expect(screen.getByRole("combobox",{name:"Your prediction"})).toHaveValue("");
 expect(screen.queryByRole("combobox",{name:"Supported explanation"})).not.toBeInTheDocument();
 expect(localStorage.getItem("prior-course-evidence")).toBe("preserved");
});
