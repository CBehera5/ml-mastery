// @vitest-environment jsdom
import {describe,it,expect,afterEach} from "vitest";
import {render,screen,cleanup,fireEvent} from "@testing-library/react";
import {BRIDGES} from "./lessons";
import {DeepRead} from "../teaching/deep-read";
import {BRIDGE_LABS} from "./bridge-labs";
import {cosine,expectation,l1,l2,linf,likelihood,logLikelihood,mle,variance} from "./bridge-math";
afterEach(cleanup);
describe("math bridge numbers",()=>{
 it("norms match the lesson",()=>{expect([l1(4,3),l2(4,3),linf(4,3)]).toEqual([7,5,4]);expect(cosine([1,2,3],[2,4,6])).toBeCloseTo(1,10);expect(l2(2,1)).toBeCloseTo(2.236,3);expect(l2(2,11)).toBeCloseTo(11.18,2)});
 it("expectation matches the lesson",()=>{const x=[0,100,500],p=[.7,.2,.1];expect(expectation(x,p)).toBeCloseTo(70,9);expect(variance(x,p)).toBeCloseTo(22100,6);expect(Math.sqrt(22100)).toBeCloseTo(148.66,2);expect(expectation([0,10],[.5,.5])).toBe(5);expect(variance([0,10],[.5,.5])).toBe(25)});
 it("likelihood matches the lesson",()=>{expect(likelihood(.5,7,10)).toBeCloseTo(.000977,6);expect(likelihood(.7,7,10)).toBeCloseTo(.002224,6);expect(likelihood(.9,7,10)).toBeCloseTo(.000478,6);expect(logLikelihood(.5,7,10)).toBeCloseTo(-6.931,3);expect(logLikelihood(.7,7,10)).toBeCloseTo(-6.109,3);expect(mle(7,10)).toBe(.7);expect(-Math.log(.8)).toBeCloseTo(.223,3);expect(-Math.log(.1)).toBeCloseTo(2.303,3)});
});
describe("bridge lessons",()=>{
 for(const b of BRIDGES)it(`${b.slug} renders all sections, a check and a playground`,()=>{
  render(<><DeepRead lesson={b.lesson}/>{(()=>{const L=BRIDGE_LABS[b.slug];return <L/>})()}</>);
  for(const s of b.lesson.sections)expect(screen.getByRole("heading",{name:s.title})).toBeTruthy();
  expect(b.lesson.sections.length).toBe(7);
  expect(screen.getByText("Check yourself")).toBeTruthy();
 });
 it("check gives feedback",()=>{render(<DeepRead lesson={BRIDGES[0].lesson}/>);fireEvent.click(screen.getByLabelText(/L2 = 7/));expect(screen.getByRole("status").textContent).toMatch(/Not quite/);fireEvent.click(screen.getByLabelText(/L2 = 5, and L1 = 7/));expect(screen.getByRole("status").textContent).toMatch(/Right/)});
});
