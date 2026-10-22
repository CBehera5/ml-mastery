import {describe,expect,it} from "vitest";
import pages from "./editorial-metadata.json";
import {editorialMetadata} from "./editorial-metadata";
describe('Math and Algorithm editorial metadata',()=>{
 it('uses distinct summaries instead of the inherited neuron description',()=>{
  const entries=Object.entries(pages);expect(entries.length).toBe(143);
  expect(new Set(entries.map(([,v])=>v.description)).size).toBe(entries.length);
  for(const [route,value] of entries){expect(editorialMetadata(route).description).toBe(value.description);expect(value.description).not.toContain('See every number inside a linear neuron');expect(value.description.length).toBeGreaterThan(60);expect(value.description.length).toBeLessThan(220);}
 });
 it('names lesson topics without internal lesson codes',()=>{
  const titles=Object.values(pages).map(x=>x.title);expect(new Set(titles).size).toBe(titles.length);
  for(const title of titles){expect(title).not.toMatch(/\b(?:PR|LG|KN|NB|SV|DT|RF|GB|NN|EV|MS|RG)\d{2}\b/);expect(title).toMatch(/\| ML Mastery$/);}
  expect(editorialMetadata('/algorithms/polynomial/pr01').title).toContain('Polynomial Regression');
  expect(editorialMetadata('/algorithms/model-selection/ms03').title).toContain('Model Selection');
 });
 it('distinguishes transfer practice and legacy evidence scopes',()=>{
  expect(editorialMetadata('/math/integration').description).toContain('not a lesson about calculating integrals');
  expect(editorialMetadata('/math/linear-algebra/assessment').description).not.toBe(editorialMetadata('/math/linear-algebra/mastery').description);
  expect(editorialMetadata('/algorithms/evaluation/ev01').description).toContain('separate');
 });
 it('does not invent canonical URLs or guarantees for unknown pages',()=>{
  expect(editorialMetadata('/unknown')).toEqual({});
  for(const value of Object.values(pages)){expect(value).not.toHaveProperty('alternates');expect(value.description).not.toMatch(/guaranteed|certified|100% mastery/i);}
 });
});
