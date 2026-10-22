// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, it, expect } from "vitest";
import { PolynomialLesson as Lesson0 } from "../polynomial/learning";
import { ModelSelectionLesson as Lesson1 } from "../model-selection/learning";
import { RegularizationLesson as Lesson2 } from "../regularization/learning";
import { LogisticLesson as Lesson3 } from "../logistic/learning";
import { KNNLesson as Lesson4 } from "../knn/learning";
import { NaiveBayesLesson as Lesson5 } from "../naive-bayes/learning";
import { DecisionTreesLesson as Lesson6 } from "../decision-trees/learning";
import { RandomForestsLesson as Lesson7 } from "../random-forests/learning";
import { GradientBoostingLesson as Lesson8 } from "../gradient-boosting/learning";
import { SVMLesson as Lesson9 } from "../svm/learning";
import { MlpLesson as Lesson10 } from "../mlp/learning";
import { EvaluationLesson as Lesson11 } from "../module/learning";
beforeEach(()=>localStorage.clear());
afterEach(cleanup);
const paths=[["polynomial",Lesson0],["model-selection",Lesson1],["regularization",Lesson2],["logistic",Lesson3],["knn",Lesson4],["naive-bayes",Lesson5],["decision-trees",Lesson6],["random-forests",Lesson7],["gradient-boosting",Lesson8],["svm",Lesson9],["mlp",Lesson10],["module",Lesson11]] as const;
it.each(paths)("%s puts the real problem and experiment before formal explanation without changing progress",async(name,Lesson)=>{
 render(<Lesson lesson={0}/>);

 const experiment=screen.getByRole("group",{name:"Prediction and experiment"});
 await waitFor(()=>expect(experiment).toBeEnabled());
 if(name === "logistic") fireEvent.click(screen.getByRole("button", {name:"Review mathematics and Python"}));
 const context=document.getElementById("lesson-context")!,math=document.getElementById("lesson-mathematics")!,python=document.getElementById("lesson-python")!,practice=document.getElementById("lesson-practice")!;
 expect(context.compareDocumentPosition(experiment)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(experiment.compareDocumentPosition(math)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(math.compareDocumentPosition(python)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(python.compareDocumentPosition(practice)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(screen.getByRole("navigation",{name:"In this lesson"})).toBeInTheDocument();
 const records=Object.fromEntries(Object.keys(localStorage).map(key=>[key,localStorage.getItem(key)]));
 if(name === "logistic") fireEvent.click(screen.getByText("Lessons in this module",{exact:true}));
 else {
  const rail = document.querySelector(".regression-lesson-rail") as HTMLElement;
  expect(rail).toBeInTheDocument();
  expect(rail.querySelector('[aria-current="page"]')).toBe(rail.querySelector("a"));
  expect(rail.querySelector("a")!.getAttribute("href")).toMatch(name === "module"?/^\/algorithms\/evaluation\/lessons\/ev01$/:new RegExp(`^/algorithms/${name}/`));
 }
 expect(screen.getByRole("link",{name:"Module overview"})).toBeInTheDocument();
 expect(Object.fromEntries(Object.keys(localStorage).map(key=>[key,localStorage.getItem(key)]))).toEqual(records);
});
