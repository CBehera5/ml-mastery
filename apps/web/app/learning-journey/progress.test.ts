import { describe, expect, it, vi } from "vitest";
import { createEmptyEvidence, markLessonState } from "../learn/foundation/evidence";
import { PYTHON_MODULES, STAGES, CONNECTIONS } from "./catalog";
import { EVIDENCE_SCOPES, readJourneyProgress, READ_KEYS, recommend, START } from "./progress";
import * as essentials from "../python/essentials/model";
import * as essentialsCatalog from "../python/essentials/catalog";
import * as numpy from "../python/numpy/model";
import * as numpyCatalog from "../python/numpy/catalog";
import * as pandas from "../python/pandas/model";
import * as pandasCatalog from "../python/pandas/catalog";
import * as visualization from "../python/visualization/model";
import * as visualizationCatalog from "../python/visualization/catalog";
import * as preparation from "../python/preparation/model";
import * as preparationCatalog from "../python/preparation/catalog";
import * as sklearn from "../python/sklearn/model";
import * as sklearnCatalog from "../python/sklearn/catalog";

const time = "2026-10-16T12:00:00.000Z";
function port(entries: [string, string][] = []) {
  const data = new Map(entries);
  const getItem = vi.fn((key: string) => data.get(key) ?? null);
  const setItem = vi.fn();
  return { data, storage: { getItem, setItem } };
}
const modules = [
  { id: "essentials", key: essentials.STORAGE_KEY, draft: () => { const state = essentials.emptyState(); state.draft.answers[0] = structuredClone([...essentialsCatalog.INDEPENDENT_FORMS[0][0].accepted[0]]); return essentials.serialize(state); }, passed: () => { const state = essentials.emptyState(); state.draft.phase = "review"; state.draft.answers = essentialsCatalog.INDEPENDENT_FORMS[0].map(item => structuredClone([...item.accepted[0]])); return essentials.serialize(essentials.confirmAttempt(state, true, time)); } },
  { id: "numpy", key: numpy.STORAGE_KEY, draft: () => { const state = numpy.emptyState(); state.draft.answers[0] = structuredClone([...numpyCatalog.INDEPENDENT_FORMS[0][0].accepted[0]]); return numpy.serialize(state); }, passed: () => { const state = numpy.emptyState(); state.draft.phase = "review"; state.draft.answers = numpyCatalog.INDEPENDENT_FORMS[0].map(item => structuredClone([...item.accepted[0]])); return numpy.serialize(numpy.confirmAttempt(state, true, time)); } },
  { id: "pandas", key: pandas.STORAGE_KEY, draft: () => { const state = pandas.emptyState(); state.draft.answers[0] = structuredClone([...pandasCatalog.INDEPENDENT_FORMS[0][0].accepted[0]]); return pandas.serialize(state); }, passed: () => { const state = pandas.emptyState(); state.draft.phase = "review"; state.draft.answers = pandasCatalog.INDEPENDENT_FORMS[0].map(item => structuredClone([...item.accepted[0]])); return pandas.serialize(pandas.confirmAttempt(state, true, time)); } },
  { id: "visualization", key: visualization.STORAGE_KEY, draft: () => { const state = visualization.emptyState(); state.draft.answers[0] = structuredClone([...visualizationCatalog.INDEPENDENT_FORMS[0][0].accepted[0]]); return visualization.serialize(state); }, passed: () => { const state = visualization.emptyState(); state.draft.phase = "review"; state.draft.answers = visualizationCatalog.INDEPENDENT_FORMS[0].map(item => structuredClone([...item.accepted[0]])); return visualization.serialize(visualization.confirmAttempt(state, true, time)); } },
  { id: "preparation", key: preparation.STORAGE_KEY, draft: () => { const state = preparation.emptyState(); state.draft.answers[0] = structuredClone([...preparationCatalog.INDEPENDENT_FORMS[0][0].accepted[0]]); return preparation.serialize(state); }, passed: () => { const state = preparation.emptyState(); state.draft.phase = "review"; state.draft.answers = preparationCatalog.INDEPENDENT_FORMS[0].map(item => structuredClone([...item.accepted[0]])); return preparation.serialize(preparation.confirmAttempt(state, true, time)); } },
  { id: "sklearn", key: sklearn.STORAGE_KEY, draft: () => { const state = sklearn.emptyState(); state.draft.answers[0] = structuredClone([...sklearnCatalog.INDEPENDENT_FORMS[0][0].accepted[0]]); return sklearn.serialize(state); }, passed: () => { const state = sklearn.emptyState(); state.draft.phase = "review"; state.draft.answers = sklearnCatalog.INDEPENDENT_FORMS[0].map(item => structuredClone([...item.accepted[0]])); return sklearn.serialize(sklearn.confirmAttempt(state, true, time)); } },
];
describe("read-only learning journey", () => {
  it("has truthful stage availability, real existing entry points and no future launch link", () => {
    expect(STAGES.map(stage => stage.status)).toEqual(["Available", "Available", "Available curriculum", "Coming Soon"]);
    expect(STAGES.slice(3).every(stage => stage.links.length === 0)).toBe(true);
    expect(CONNECTIONS).toHaveLength(5);
    expect(new Set(READ_KEYS).size).toBe(READ_KEYS.length);
  });
  it("keeps empty and unreadable states distinct without scanning or writing storage", async () => {
    const empty = port(); expect(recommend(await readJourneyProgress(empty.storage))).toEqual(START);
    expect(empty.storage.getItem.mock.calls.map(([key]) => key)).toEqual(READ_KEYS);
    expect(empty.storage.setItem).not.toHaveBeenCalled();
    const report = await readJourneyProgress({ getItem: () => { throw Error("Denied"); } });
    expect(report.warnings).toHaveLength(READ_KEYS.length);
    expect(recommend(report).detail).toMatch(/could not be read/);
  });
  it.each(modules)("restores an actual $id draft without awarding or rewriting anything", async module => {
    const raw = module.draft(), source = port([[module.key, raw], ["unrelated", "preserve"]]);
    const result = await readJourneyProgress(source.storage);
    expect(result.warnings).toEqual([]);
    expect(recommend(result).href).toBe(`/python/${module.id}/mastery`);
    expect(result.scopes[0].mastery).toBe("Mastery not yet demonstrated");
    expect(source.data.get(module.key)).toBe(raw);
    expect(source.storage.setItem).not.toHaveBeenCalled();
  });
  it.each(modules)("shows actual $id mastery only in its own scope without forcing lesson completion", async module => {
    const source = port([[module.key, module.passed()]]);
    const result = await readJourneyProgress(source.storage);
    expect(result.warnings).toEqual([]);
    expect(result.scopes).toHaveLength(1);
    expect(result.scopes[0].mastery).toBe("Mastery demonstrated");
    expect(recommend(result).href).toBe(`/python/${module.id}`);
    expect(source.storage.setItem).not.toHaveBeenCalled();
  });
  it.each(EVIDENCE_SCOPES)("reads the exact $title evidence version and preserves foreign/corrupt/future scopes", async config => {
    let evidence = createEmptyEvidence(config.version);
    const slug = config.lessons[0];
    evidence = markLessonState(evidence, slug ? `${config.prefix}.${slug}` : config.prefix, "started", [], time);
    const key = `ml-math-lab:evidence:${config.scope}:v1`, raw = JSON.stringify(evidence);
    const source = port([[key, raw]]);
    const result = await readJourneyProgress(source.storage);
    expect(result.warnings).toEqual([]);
    expect(result.scopes[0].active).toBe(true);
    expect(recommend(result).href.startsWith("/")).toBe(true);
    for (const bad of ["broken", raw.replace(config.version, "future"), JSON.stringify({ ...evidence, lessons: { foreign: Object.values(evidence.lessons)[0] } }), "x".repeat(262145)]) {
      const invalid = port([[key, bad]]);
      const rejected = await readJourneyProgress(invalid.storage);
      expect(rejected.scopes).toEqual([]);
      expect(rejected.warnings).toHaveLength(1);
      expect(invalid.data.get(key)).toBe(bad);
      expect(invalid.storage.setItem).not.toHaveBeenCalled();
    }
  });
  it("ranks actual relevant evidence timestamps, not incidental raw keys or fabricated last visits", async () => {
    const algebra = createEmptyEvidence("algebra.functions.v1");
    const old = markLessonState(algebra, "algebra.functions.variables", "started", [], "2026-10-15T00:00:00.000Z");
    const newer = markLessonState(createEmptyEvidence("statistics.foundations.v1"), "statistics.foundations.relationships", "started", [], time);
    const source = port([["ml-math-lab:evidence:math.algebra:v1", JSON.stringify(old)], ["ml-math-lab:evidence:math.statistics:v1", JSON.stringify(newer)]]);
    expect(recommend(await readJourneyProgress(source.storage)).href).toBe("/math/statistics/relationships");
    expect(recommend({ scopes: [], warnings: [] }).detail).not.toMatch(/last visited/i);
  });
  it("isolates corrupt Python records and still resumes valid work", async () => {
    const raw = modules[2].draft();
    const source = port([[numpy.STORAGE_KEY, "{bad"], [pandas.STORAGE_KEY, raw]]);
    const report = await readJourneyProgress(source.storage);
    expect(report.warnings).toHaveLength(1);
    expect(recommend(report).href).toBe("/python/pandas/mastery");
    expect(source.storage.setItem).not.toHaveBeenCalled();
  });
  it("keeps lesson completion, active practice, critical recall and prior mastery separate", async () => {
    let state = numpy.emptyState();
    state.practice[4].answers = structuredClone([...numpyCatalog.PRACTICE_FORMS[0][4].accepted[0]]);
    let report = await readJourneyProgress(port([[numpy.STORAGE_KEY, numpy.serialize(state)]]).storage);
    expect(recommend(report).href).toBe("/python/numpy/n02");
    state = numpy.emptyState(); state.draft.phase = "review"; state.draft.answers = numpyCatalog.INDEPENDENT_FORMS[0].map(item => structuredClone([...item.accepted[0]]));
    state = numpy.confirmAttempt(state, true, time);
    state = numpy.retry(state, "later-failure"); state.draft.phase = "review";
    state = numpy.confirmAttempt(state, true, time);
    report = await readJourneyProgress(port([[numpy.STORAGE_KEY, numpy.serialize(state)]]).storage);
    expect(report.scopes[0].mastery).toBe("Mastery demonstrated");
    expect(recommend(report).detail).toMatch(/Earlier mastery/);
    expect(recommend(report).href).toBe("/python/numpy/n01");
  });
  it("reads retained pilot/legacy records but never imports them into module mastery", async () => {
    const source = port([["ml-math-lab:topic:derivatives:v1", JSON.stringify({ completed: ["why"], mastered: false, bestScore: 0 })], ["ml-math-lab:lesson:vectors-dot-product:v1", "[true,false,false,false,false]"]]);
    const report = await readJourneyProgress(source.storage);
    expect(report.scopes).toHaveLength(2);
    expect(report.scopes.every(scope => !scope.mastery.startsWith("Mastery demonstrated"))).toBe(true);
    expect(source.storage.setItem).not.toHaveBeenCalled();
  });
  it("bounds equivalent read representations and never mutates the original P01 envelope", async () => {
    const model = await import("../python/foundation/progress");
    const state = model.emptyProgress(); state.experiment.changed = true;
    const raw = model.serializeProgress(state);
    const source = port([[model.STORAGE_KEY, raw]]);
    const report = await readJourneyProgress(source.storage);
    expect(recommend(report).href).toBe("/python/essentials/p01");
    expect(report.scopes[0].mastery).toMatch(/separate/);
    expect(source.data.get(model.STORAGE_KEY)).toBe(raw);
    expect(source.data.has(essentials.STORAGE_KEY)).toBe(false);
  });
  it("rejects reset-on-invalid Regression parsers without treating damaged bytes as no progress", async () => {
    const source = port([["ml-math-lab:project:linear-regression:bridge:v1", JSON.stringify({version: 99})], ["ml-math-lab:assessment:linear-regression:mastery:v1", JSON.stringify({version: 1, variant: "v01", responses: {}})]]);
    const report = await readJourneyProgress(source.storage);
    expect(report.warnings).toHaveLength(2);
    expect(report.scopes).toEqual([]);
  });
  it("keeps all six static first-lesson mappings aligned to actual catalogs", () => {
    expect(PYTHON_MODULES.map(module => module.count)).toEqual([8,6,6,5,6,5]);
    for (const catalog of [essentialsCatalog, numpyCatalog, pandasCatalog, visualizationCatalog, preparationCatalog, sklearnCatalog]) expect(catalog.CATALOG_VALID).toBe(true);
  });
});

