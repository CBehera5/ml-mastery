// @vitest-environment jsdom
import {describe,it,expect,afterEach} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import {AlgoDeep,ALGO_DEEP,hasAlgoDeep} from "./algo-deep";
import {REGRESSION_LESSONS} from "../linear-regression/curriculum";
afterEach(cleanup);
const teaching=import.meta.glob("../*/teaching.ts",{eager:true}) as Record<string,{LESSONS:readonly unknown[]}>;
describe("Algorithms long-form lessons",()=>{
 for(const [module,readings] of Object.entries(ALGO_DEEP)){
  it(`${module}: one reading per lesson, in order`,()=>{
   const lessons=module==="linear-regression"?REGRESSION_LESSONS.filter(l=>l.type!=="project"&&l.type!=="assessment"):teaching[`../${module}/teaching.ts`]?.LESSONS;
   expect(lessons,`teaching.ts for ${module}`).toBeDefined();
   expect(readings.length).toBe(lessons.length);
   readings.forEach((_,i)=>expect(hasAlgoDeep(module,i)).toBe(true));
  });
  readings.forEach((reading,i)=>it(`${module} lesson ${i+1} renders seven sections, a check and runnable code`,()=>{
   render(<AlgoDeep module={module} lesson={i}/>);
   expect(reading.sections.length).toBe(7);
   for(const s of reading.sections)expect(screen.getByRole("heading",{name:s.title})).toBeTruthy();
   expect(screen.getByText("Check yourself")).toBeTruthy();
   expect(document.querySelectorAll("pre").length).toBeGreaterThanOrEqual(2);
   expect(reading.minutes).toBeGreaterThanOrEqual(10);
  }));
 }
 it("renders nothing for a lesson without a reading",()=>{const {container}=render(<AlgoDeep module="knn" lesson={99}/>);expect(container.innerHTML).toBe("")});
});
