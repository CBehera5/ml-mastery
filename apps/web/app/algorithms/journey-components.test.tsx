// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import {cleanup, render, screen, within} from "@testing-library/react";
import {afterEach, expect, it} from "vitest";
import {AlgorithmFrame, algorithmRoute, type AlgorithmModule} from "./journey-components";
const lessons=[{slug:"one",title:"First idea",why:"A concrete problem."},{slug:"two",title:"Next idea",why:"A second problem."}];
afterEach(cleanup);
it.each<AlgorithmModule>(["polynomial","regularization","knn","naive-bayes","svm","decision-trees","random-forests","gradient-boosting","mlp","model-selection","module"])("uses the Linear Regression lesson layout without changing routes: %s", module=>{
 render(<AlgorithmFrame title="Discover a model" module={module} lessons={lessons} lesson={1} message="" showBookOpening={false}><button>Existing experiment</button></AlgorithmFrame>);
 expect(screen.getAllByRole("heading",{level:1})).toHaveLength(1);
 expect(screen.getByRole("heading",{level:1})).toHaveTextContent("Discover a model");
 expect(screen.getByText("LEARNING OUTCOME").closest("aside")).toHaveClass("regression-outcome");
 const rail=document.querySelector(".regression-lesson-rail") as HTMLElement;
 expect(rail).toBeInTheDocument();
 expect(within(rail).getByRole("link",{name:"2 Next idea"})).toHaveAttribute("aria-current","page");
 expect(within(rail).getByRole("link",{name:"1 First idea"})).toHaveAttribute("href",algorithmRoute(module,"one"));
 const content=document.getElementById("evaluation-content")!;
 expect(content).toHaveAttribute("tabindex","-1");
 expect(content).toHaveClass("regression-lab-surface");
 expect(within(content).getByRole("button",{name:"Existing experiment"})).toBeEnabled();
 expect(screen.getByRole("link",{name:"Skip to lesson content"})).toHaveAttribute("href","#evaluation-content");
});
