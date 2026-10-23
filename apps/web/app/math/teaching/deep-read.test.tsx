// @vitest-environment jsdom
import {describe,it,expect,afterEach} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import {DeepRead} from "./deep-read";
import {CALCULUS_WHY} from "./deep/calculus-why";
afterEach(cleanup);
describe("DeepRead",()=>{
 it("renders every section of the calculus pilot with a table, code and a warning",()=>{
  render(<DeepRead lesson={CALCULUS_WHY}/>);
  for(const s of CALCULUS_WHY.sections)expect(screen.getByRole("heading",{name:s.title})).toBeTruthy();
  expect(screen.getAllByRole("table").length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole("link").length).toBe(CALCULUS_WHY.sections.length);
  expect(document.querySelectorAll("pre").length).toBeGreaterThanOrEqual(2);
 });
 it("keeps the stated numbers consistent with the formula 10 + 5h",()=>{
  const t=CALCULUS_WHY.sections.flatMap(s=>s.blocks).find(b=>b.kind==="table")!;
  if(t.kind!=="table")throw new Error("table");
  for(const [h,,avg] of t.rows)expect(Number(avg)).toBeCloseTo(10+5*Number(h),6);
 });
});
