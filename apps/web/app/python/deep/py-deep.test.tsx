// @vitest-environment jsdom
import {describe,it,expect,afterEach} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import {PyDeep,PY_DEEP,hasPyDeep} from "./py-deep";
afterEach(cleanup);
/** Lessons per Python module: it must match each module's catalog. */
const EXPECTED:Record<string,number>={"pandas":6,"numpy":6,"essentials":8,};
describe("Python long-form lessons",()=>{
 for(const [module,readings] of Object.entries(PY_DEEP)){
  it(`${module}: one reading per lesson, in order`,()=>{
   expect(EXPECTED[module],`expected count for ${module}`).toBeDefined();
   expect(readings.length).toBe(EXPECTED[module]);
   readings.forEach((_,i)=>expect(hasPyDeep(module,i)).toBe(true));
  });
  readings.forEach((reading,i)=>it(`${module} lesson ${i+1} renders seven sections, a check and runnable code`,()=>{
   render(<PyDeep module={module} lesson={i}/>);
   expect(reading.sections.length).toBe(7);
   for(const s of reading.sections)expect(screen.getByRole("heading",{name:s.title})).toBeTruthy();
   expect(screen.getByText("Check yourself")).toBeTruthy();
   expect(document.querySelectorAll("pre").length).toBeGreaterThanOrEqual(2);
   expect(reading.minutes).toBeGreaterThanOrEqual(10);
  }));
 }
 it("renders nothing for a lesson without a reading",()=>{const {container}=render(<PyDeep module="essentials" lesson={99}/>);expect(container.innerHTML).toBe("")});
});
