// @vitest-environment jsdom
import {describe,it,expect,afterEach} from "vitest";
import {render,screen,cleanup,fireEvent} from "@testing-library/react";
import {BRIDGES} from "./lessons";
import {DeepRead} from "../teaching/deep-read";
import {BRIDGE_LABS} from "./bridge-labs";
import {cosine,expectation,l1,l2,linf,likelihood,logLikelihood,mle,variance,PX,PY,bestWeight,residual,dot,sse,principal,spreadAt,entropy,crossEntropy,kl,bits,stdErr,interval,twoGroupZ,shrink,descend,bumpy,fullGrad,sampleGrad,meanLoss,runSgd,fenceArea} from "./bridge-math";
afterEach(cleanup);
describe("math bridge numbers",()=>{
 it("norms match the lesson",()=>{expect([l1(4,3),l2(4,3),linf(4,3)]).toEqual([7,5,4]);expect(cosine([1,2,3],[2,4,6])).toBeCloseTo(1,10);expect(l2(2,1)).toBeCloseTo(2.236,3);expect(l2(2,11)).toBeCloseTo(11.18,2)});
 it("expectation matches the lesson",()=>{const x=[0,100,500],p=[.7,.2,.1];expect(expectation(x,p)).toBeCloseTo(70,9);expect(variance(x,p)).toBeCloseTo(22100,6);expect(Math.sqrt(22100)).toBeCloseTo(148.66,2);expect(expectation([0,10],[.5,.5])).toBe(5);expect(variance([0,10],[.5,.5])).toBe(25)});
 it("likelihood matches the lesson",()=>{expect(likelihood(.5,7,10)).toBeCloseTo(.000977,6);expect(likelihood(.7,7,10)).toBeCloseTo(.002224,6);expect(likelihood(.9,7,10)).toBeCloseTo(.000478,6);expect(logLikelihood(.5,7,10)).toBeCloseTo(-6.931,3);expect(logLikelihood(.7,7,10)).toBeCloseTo(-6.109,3);expect(mle(7,10)).toBe(.7);expect(-Math.log(.8)).toBeCloseTo(.223,3);expect(-Math.log(.1)).toBeCloseTo(2.303,3)});
});
describe("later bridge numbers",()=>{
 it("projection",()=>{expect(bestWeight(PX,PY)).toBe(1.5);expect(dot(residual(1.5,PX,PY),PX)).toBe(0);expect(sse(1.5,PX,PY)).toBe(1.5);expect(sse(1,PX,PY)).toBe(5);expect(sse(2,PX,PY)).toBe(5);expect(dot(PY,PY)).toBe(33)});
 it("pca",()=>{const p=principal();expect(p.l1).toBeCloseTo(7.4665,3);expect(p.l2).toBeCloseTo(0.0335,3);expect(p.deg).toBeCloseTo(35.17,1);expect(spreadAt(0)).toBeCloseTo(5,9);expect(spreadAt(90)).toBeCloseTo(2.5,9);expect(spreadAt(45)).toBeCloseTo(7.25,9);expect(p.share).toBeCloseTo(.9955,3)});
 it("information",()=>{const p=[.7,.2,.1],q=[.5,.3,.2];expect(entropy(p)).toBeCloseTo(1.157,3);expect(crossEntropy(p,q)).toBeCloseTo(1.280,3);expect(kl(p,q)).toBeCloseTo(.123,3);expect(bits(.125)).toBe(3);expect(entropy([.5,.25,.25])).toBe(1.5);expect(entropy([.9,.1])).toBeCloseTo(.469,3)});
 it("inference",()=>{expect(stdErr(.62,100)).toBeCloseTo(.0485,4);const [lo,hi]=interval(.62,100);expect(lo).toBeCloseTo(.525,3);expect(hi).toBeCloseTo(.715,3);const t=twoGroupZ(.15,.21,200);expect(t.se).toBeCloseTo(.0383,4);expect(t.z).toBeCloseTo(1.57,2);expect(twoGroupZ(.15,.21,800).z).toBeCloseTo(3.13,2);expect(stdErr(.62,400)*1.96).toBeCloseTo(.048,3)});
 it("bias variance",()=>{expect(shrink(1).mse).toBeCloseTo(5,9);expect(shrink(.95).mse).toBeCloseTo(4.7625,6);expect(shrink(.9).mse).toBeCloseTo(5.05,9);expect(shrink(.8).mse).toBeCloseTo(7.2,9);expect(shrink(100/105).mse).toBeLessThan(shrink(.95).mse)});
 it("convexity",()=>{expect(descend(1.5)).toBeCloseTo(1.347,3);expect(descend(.1)).toBeCloseTo(-1.473,3);expect(descend(-1.5)).toBeCloseTo(-1.473,3);expect(bumpy(descend(1.5))).toBeCloseTo(-2.62,2);expect(bumpy(descend(-1.5))).toBeCloseTo(-5.44,2)});
 it("sgd",()=>{expect(fullGrad(0)).toBeCloseTo(-29.75,9);expect([0,1,2,3].map(i=>sampleGrad(0,i))).toEqual([-4.4,-15.2,-37.8,-61.6].map(v=>expect.closeTo(v,9)));const p=runSgd(4,.05,5);expect(p[1]).toBeCloseTo(1.4875,4);expect(p[5]).toBeCloseTo(1.9814,3);expect(meanLoss(p[1])).toBeCloseTo(1.9068,3);expect(runSgd(1,.02,40,7).length).toBe(41)});
 it("constraints",()=>{expect(fenceArea(5)).toBe(25);expect([2,4,6,8].map(x=>fenceArea(x))).toEqual([16,24,24,16])});
});
describe("bridge lessons",()=>{
 for(const b of BRIDGES)it(`${b.slug} renders all sections, a check and a playground`,()=>{
  render(<><DeepRead lesson={b.lesson}/>{(()=>{const L=BRIDGE_LABS[b.slug];return <L/>})()}</>);
  for(const s of b.lesson.sections)expect(screen.getByRole("heading",{name:s.title})).toBeTruthy();
  expect(b.lesson.sections.length).toBe(7);expect(screen.getAllByRole("table").length).toBeGreaterThanOrEqual(1);expect(document.querySelectorAll("pre").length).toBeGreaterThanOrEqual(2);
  expect(screen.getByText("Check yourself")).toBeTruthy();
 });
 it("check gives feedback",()=>{render(<DeepRead lesson={BRIDGES[0].lesson}/>);fireEvent.click(screen.getByLabelText(/L2 = 7/));expect(screen.getByRole("status").textContent).toMatch(/Not quite/);fireEvent.click(screen.getByLabelText(/L2 = 5, and L1 = 7/));expect(screen.getByRole("status").textContent).toMatch(/Right/)});
});
