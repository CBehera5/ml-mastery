// @vitest-environment jsdom
import {describe,it,expect} from "vitest";
import {render,screen,cleanup,fireEvent} from "@testing-library/react";
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
  expect(screen.queryByText(/displayed inputs/)).toBeNull();
 });
 it("asks for a guess before the explorer, never scores it, and lets the learner skip",()=>{
  render(<BookOpening module="algebra" lesson="variables"/>);
  const lock=screen.getByRole("button",{name:"Lock in my guess"}) as HTMLButtonElement;expect(lock.disabled).toBe(true);
  fireEvent.change(screen.getByRole("textbox",{name:"Your guess, in a few words"}),{target:{value:"Yes, six fit"}});expect(lock.disabled).toBe(false);
  fireEvent.click(lock);expect(screen.getByRole("status").textContent).toContain("Your guess: Yes, six fit");
  cleanup();render(<BookOpening module="algebra" lesson="variables"/>);fireEvent.click(screen.getByRole("button",{name:/not sure/}));expect(screen.getByRole("status").textContent).toContain("No guess yet");
 });
 it("distinguishes reading extensions from assessed functionality",()=>{
  render(<BookExplanation module="calculus" lesson="integrals"/>);expect(screen.getByText(/no integral solver is needed/)).toBeTruthy();
 });
 it("keeps probability directions, convexity and final-test selection qualified",()=>{
  expect(content.lessons['probability/bayes'].caution).toContain('10%');
  expect(content.lessons['optimization/geometry'].caution).toContain("every point minimizes it");
  expect(content.lessons['statistics/ml'].ml).toContain('reserve a final test');
 });
});
