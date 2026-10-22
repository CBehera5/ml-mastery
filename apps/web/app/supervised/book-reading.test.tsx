// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {afterEach,describe,expect,it} from "vitest";
import {cleanup,render,screen} from "@testing-library/react";
import {existsSync} from "node:fs";
import path from "node:path";
import data from "./book-content.json";
import {referenceLabel} from "./reference-label";
import {AlgorithmBookOpening,AlgorithmBookExplanation,readingFor} from "./book-reading";
import {ALGORITHM_QUESTIONS} from "./journey";
import {RegressionShell} from "../learn/linear-regression/components/regression-shell";
import {REGRESSION_LESSONS} from "../learn/linear-regression/curriculum";
afterEach(cleanup);
describe('Book-aligned algorithm readings',()=>{
 for(const [module,topics] of Object.entries(data.mapping))topics.forEach((_,lesson)=>it(`${module} lesson ${lesson+1} supplies an explained figure and worked table`,()=>{
  const r=readingFor(module,lesson)!;expect(r).toBeDefined();expect(r.chart.length).toBeGreaterThan(100);expect(r.explain.length).toBeGreaterThan(60);
  expect(existsSync(path.join(process.cwd(),'apps/web/public/algorithm-books',r.figure))).toBe(true);
  for(const row of r.rows)expect(row).toHaveLength(r.headers.length);
  render(<><AlgorithmBookOpening module={module} lesson={lesson}/><AlgorithmBookExplanation module={module} lesson={lesson}/></>);
  expect(screen.getByRole('img')).toHaveAttribute('width',String(r.width));expect(screen.getByRole('img')).toHaveAttribute('height',String(r.height));
  expect(screen.getByText('Pause and predict')).toBeInTheDocument();expect(screen.getByRole('table')).toHaveAccessibleName(`${r.title}: compare the quantities`);
  expect(screen.getByRole('region',{name:`Worked comparison: ${r.title}`})).toHaveAttribute('tabindex','0');
  expect(screen.getByText(r.figureOrigin==='adapted'?/Adapted diagram; rounded values, not a live result/:/Static source illustration; annotated scores belong/)).toBeInTheDocument();expect(screen.getByRole('link',{name:/Open full-size figure/})).toHaveAttribute('href',`/algorithm-books/${r.figure}`);
  expect(screen.queryByRole('button')).toBeNull();expect(screen.queryByRole('textbox')).toBeNull();
 }));
 it('covers existing lesson counts without creating assessment routes',()=>{
  for(const [module,questions] of Object.entries(ALGORITHM_QUESTIONS))expect(data.mapping[module as keyof typeof data.mapping]).toHaveLength(questions.length);
  expect(data.mapping.linear).toHaveLength(REGRESSION_LESSONS.filter(x=>x.id!=='mastery').length);
  expect(readingFor('linear',8)).toBeUndefined();expect(readingFor('unknown',0)).toBeUndefined();
 });
 it('keeps Linear Regression companion optional and outside mastery',()=>{
  let view=render(<RegressionShell lesson={REGRESSION_LESSONS[1]}><p>Existing equation lesson</p></RegressionShell>);
  const companion=screen.getByText('Explore the book’s separate housing example').closest('details');expect(companion).not.toHaveAttribute('open');expect(screen.getByText('Existing equation lesson')).toBeVisible();
  expect(screen.getByRole('link',{name:/Return to the playground/})).toHaveAttribute('href','#regression-lesson-content');
  view.unmount();render(<RegressionShell lesson={REGRESSION_LESSONS[8]}><p>Existing assessment</p></RegressionShell>);expect(screen.queryByText('Pause and predict')).toBeNull();
 });
 it('does not invent a Model Selection source book',()=>{
  render(<AlgorithmBookOpening module='model-selection' lesson={0}/>);expect(screen.getByText(/uses Evaluation Foundations/)).toBeInTheDocument();
 });
 it('shows readable reference controls without changing their IDs',()=>{
  const first={id:'kn.clean.v1.q0.k1.uniform.raw',fixture:'kn.clean.v1',controls:{query:0,k:1,weighting:'uniform',scaled:false}};
  const second={...first,id:'kn.clean.v1.q0.k3.uniform.raw',controls:{...first.controls,k:3}};
  expect(referenceLabel(first,[first,second])).toContain('Case 1 · clean');expect(referenceLabel(second,[first,second])).toContain('k: 3');
  expect(referenceLabel(first,[first,second])).not.toContain(first.id);expect(first.id).toBe('kn.clean.v1.q0.k1.uniform.raw');
 });
 it('qualifies common source overstatements' ,()=>{
  expect(data.readings['svm/margin'].caution).toContain('does not establish fairness');
  expect(data.readings['random-forests/oob'].caution).toContain('not a free independent final test');
  expect(data.readings['gradient-boosting/compare'].caution).toContain('need not stay inside');
 });
});
