// @vitest-environment jsdom
import {describe,it,expect} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import {afterEach} from "vitest";
import {existsSync} from "node:fs";
import path from "node:path";
import content from "./book-content.json";
import {BookOpening,BookExplanation} from "./book-lesson";
import {LESSON_IDS} from "../algebra-functions/content";
import {TOPICS} from "../linear-algebra/content";
import {GEOMETRY_TOPICS} from "../linear-algebra/geometry-content";
import {lessons as probability} from "../probability/content";
import {lessons as statistics} from "../statistics/content";
import {lessons as optimization} from "../optimization/content";
afterEach(cleanup);
const readings:Record<string,{headers:string[];rows:string[][];figure:string;title:string;alt:string}> = content.lessons;
describe("Book-aligned Math readings",()=>{
 const expected={algebra:[...LESSON_IDS],linear:[...TOPICS,...GEOMETRY_TOPICS],calculus:["why","secants","rules","practice","lab","debug","integrals"],probability:probability.map(x=>x.slug),statistics:statistics.map(x=>x.slug),optimization:optimization.map(x=>x.slug)};
 for(const [module,lessons] of Object.entries(expected))for(const lesson of lessons)it(`${module}/${lesson} has a complete, accessible worked reading`,()=>{
  const reading=readings[`${module}/${lesson}`];expect(reading).toBeDefined();
  expect(reading.rows.length).toBeGreaterThan(1);for(const row of reading.rows)expect(row).toHaveLength(reading.headers.length);
  expect(existsSync(path.join(process.cwd(),"apps/web/public/math-books",reading.figure))).toBe(true);
  render(<><BookOpening module={module} lesson={lesson}/><BookExplanation module={module} lesson={lesson}/></>);
  expect(screen.getByRole("img",{name:reading.alt})).toBeTruthy();expect(screen.getByRole("table")).toBeTruthy();expect(screen.getByText("Pause and predict")).toBeTruthy();expect(screen.getByRole("region",{name:`${reading.title}: worked comparison`}).getAttribute("tabindex")).toBe("0");
  expect(screen.queryByRole("button")).toBeNull();expect(screen.queryByRole("textbox")).toBeNull();
 });
 it("distinguishes reading extensions from assessed functionality",()=>{
  render(<BookExplanation module="calculus" lesson="integrals"/>);expect(screen.getByText(/adds no integral solver or completion requirement/)).toBeTruthy();
 });
 it("keeps probability directions, convexity and final-test selection qualified",()=>{
  expect(content.lessons['probability/bayes'].caution).toContain('10%');
  expect(content.lessons['optimization/geometry'].caution).toContain('many minimizers');
  expect(content.lessons['statistics/ml'].ml).toContain('reserve a final test');
 });
});
