// @vitest-environment jsdom
import {describe,it,expect,afterEach} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import {MathDeep,MATH_DEEP,hasMathDeep} from "./math-deep";
afterEach(cleanup);
/** How many lessons each Math module has a reading for. */
const EXPECTED:Record<string,number>={"vectors-dot-product":1,"integration":1,"functions-derivatives":1,"calculus-debug":1,"calculus-rules":1,"calculus-secants":1,"linear-algebra-eigenvectors":1,"linear-algebra-transformations":1,"matrices-multiplication":1,"optimization":6,"statistics":7,"probability":6,"algebra-functions":6,};
describe("Math long-form lessons",()=>{
 for(const [module,readings] of Object.entries(MATH_DEEP)){
  it(`${module}: one reading per lesson, in order`,()=>{
   expect(EXPECTED[module],`expected count for ${module}`).toBeDefined();
   expect(readings.length).toBe(EXPECTED[module]);
   readings.forEach((_,i)=>expect(hasMathDeep(module,i)).toBe(true));
  });
  readings.forEach((reading,i)=>it(`${module} lesson ${i+1} renders seven sections, a check and runnable code`,()=>{
   render(<MathDeep module={module} lesson={i}/>);
   expect(reading.sections.length).toBe(7);
   for(const s of reading.sections)expect(screen.getByRole("heading",{name:s.title})).toBeTruthy();
   expect(screen.getByText("Check yourself")).toBeTruthy();
   expect(document.querySelectorAll("pre").length).toBeGreaterThanOrEqual(2);
   expect(reading.minutes).toBeGreaterThanOrEqual(10);
  }));
 }
 it("renders nothing for a lesson without a reading",()=>{const {container}=render(<MathDeep module="algebra-functions" lesson={99}/>);expect(container.innerHTML).toBe("")});
});
