// @vitest-environment jsdom
import {describe,it,expect,afterEach} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import {AlgoDeep,hasAlgoDeep} from "./algo-deep";
import {KNN_DEEP} from "./knn";
import {LESSONS} from "../knn/teaching";
import {NAIVE_BAYES_DEEP} from "./naive-bayes";
import {POLYNOMIAL_DEEP} from "./polynomial";
import {REGULARIZATION_DEEP} from "./regularization";
import {LESSONS as RG_LESSONS} from "../regularization/teaching";
import {LESSONS as PR_LESSONS} from "../polynomial/teaching";
import {LESSONS as NB_LESSONS} from "../naive-bayes/teaching";
afterEach(cleanup);
describe("Algorithms long-form lessons",()=>{
 it("KNN has one reading per lesson, in the same order",()=>{expect(KNN_DEEP.length).toBe(LESSONS.length);for(let i=0;i<LESSONS.length;i++)expect(hasAlgoDeep("knn",i)).toBe(true)});
 for(let i=0;i<KNN_DEEP.length;i++)it(`knn lesson ${i+1} renders seven sections, a check and runnable code`,()=>{
  render(<AlgoDeep module="knn" lesson={i}/>);
  expect(KNN_DEEP[i].sections.length).toBe(7);
  for(const s of KNN_DEEP[i].sections)expect(screen.getByRole("heading",{name:s.title})).toBeTruthy();
  expect(screen.getByText("Check yourself")).toBeTruthy();
  expect(document.querySelectorAll("pre").length).toBeGreaterThanOrEqual(2);
 });
 it("Naive Bayes has one reading per lesson, each complete",()=>{expect(NAIVE_BAYES_DEEP.length).toBe(NB_LESSONS.length);NAIVE_BAYES_DEEP.forEach((d,i)=>{expect(hasAlgoDeep("naive-bayes",i)).toBe(true);expect(d.sections.length).toBe(7);cleanup();render(<AlgoDeep module="naive-bayes" lesson={i}/>);for(const sec of d.sections)expect(screen.getByRole("heading",{name:sec.title})).toBeTruthy();expect(screen.getByText("Check yourself")).toBeTruthy()})});
 it("Polynomial has one reading per lesson, each complete",()=>{expect(POLYNOMIAL_DEEP.length).toBe(PR_LESSONS.length);POLYNOMIAL_DEEP.forEach((d,i)=>{expect(hasAlgoDeep("polynomial",i)).toBe(true);expect(d.sections.length).toBe(7);cleanup();render(<AlgoDeep module="polynomial" lesson={i}/>);for(const sec of d.sections)expect(screen.getByRole("heading",{name:sec.title})).toBeTruthy();expect(screen.getByText("Check yourself")).toBeTruthy()})});
 it("Regularization has one reading per lesson, each complete",()=>{expect(REGULARIZATION_DEEP.length).toBe(RG_LESSONS.length);REGULARIZATION_DEEP.forEach((d,i)=>{expect(hasAlgoDeep("regularization",i)).toBe(true);expect(d.sections.length).toBe(7);cleanup();render(<AlgoDeep module="regularization" lesson={i}/>);for(const sec of d.sections)expect(screen.getByRole("heading",{name:sec.title})).toBeTruthy();expect(screen.getByText("Check yourself")).toBeTruthy()})});
 it("renders nothing for a lesson without a reading",()=>{const {container}=render(<AlgoDeep module="knn" lesson={99}/>);expect(container.innerHTML).toBe("")});
});
