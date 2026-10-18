import { expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { MODULE_POLICIES, scoreAssessment } from "../apps/web/app/python/foundation/assessment";
import { gradeFamily, validateDefinition, type Answer, type Family } from "../apps/web/app/python/foundation/contracts";
import { acceptedResponse } from "../apps/web/app/python/foundation/test-fixtures";
import * as essentials from "../apps/web/app/python/essentials/catalog";
import * as numpy from "../apps/web/app/python/numpy/catalog";
import * as pandas from "../apps/web/app/python/pandas/catalog";
import * as visualization from "../apps/web/app/python/visualization/catalog";
import * as preparation from "../apps/web/app/python/preparation/catalog";
import * as sklearn from "../apps/web/app/python/sklearn/catalog";

const catalogs = { essentials, numpy, pandas, visualization, preparation, sklearn };
function wrong(definition: Family, part: number): Answer {
  const atom = definition.atoms[part];
  const candidates: Answer[] = atom.kind === "choice" ? atom.options.map(option => ({ kind: "choice", optionId: option.id })) : atom.kind === "number" ? [{ kind: "number", value: -999999 }] : atom.slots.flatMap(slot => slot.options.map(option => {
    const current = structuredClone(definition.accepted[0][part]);
    if (current.kind !== "slots") throw Error("Expected slots");
    current.entries.find(entry => entry.slotId === slot.id)!.optionId = option.id;
    return current;
  }));
  for (const candidate of candidates) {
    const response = acceptedResponse(definition);
    response.answers[part].answer = candidate;
    const grade = gradeFamily(definition, response);
    if (grade.status === "graded" && !grade.correct) return candidate;
  }
  throw Error("No valid wrong counterexample");
}
it("audits all real module forms, thresholds, equivalent tuples and 246 valid-wrong paired gate failures", () => {
  const report = [];
  for (const policy of MODULE_POLICIES) {
    const catalog = catalogs[policy.module];
    expect(catalog.CATALOG_VALID).toBe(true);
    expect(catalog.MASTERY_AVAILABLE).toBe(true);
    expect(catalog.LESSONS).toHaveLength(policy.count / 4);
    expect(catalog.PRACTICE_FORMS.flat()).toHaveLength(policy.count * 2);
    expect(catalog.INDEPENDENT_FORMS.flat()).toHaveLength(policy.count * 3);
    const all = [...catalog.PRACTICE_FORMS.flat(), ...catalog.INDEPENDENT_FORMS.flat()];
    expect(new Set(all.map(item => item.id)).size).toBe(policy.count * 5);
    for (const family of all) {
      expect(validateDefinition(family)).toBe(true);
      expect(family.remediation.length).toBeGreaterThan(0);
      expect(family.explanation.length).toBeGreaterThan(0);
      for (let tuple = 0; tuple < family.accepted.length; tuple++) expect(gradeFamily(family, acceptedResponse(family, tuple))).toMatchObject({ status: "graded", correct: true });
    }
    let criticalFailures = 0;
    for (const form of catalog.INDEPENDENT_FORMS) {
      expect(form.filter(item => item.critical).map(item => item.objective)).toEqual([...policy.critical]);
      const correct = form.map(item => acceptedResponse(item));
      for (const score of [Math.ceil(policy.count * .8) - 1, Math.ceil(policy.count * .8), policy.count]) {
        const responses = structuredClone(correct);
        form.map((family, index) => ({ family, index })).filter(item => !item.family.critical).slice(0, policy.count - score).forEach(({ family, index }) => { responses[index].answers[0].answer = wrong(family, 0); });
        expect(scoreAssessment(policy.module, form, responses)).toMatchObject({ score, passed: score >= Math.ceil(policy.count * .8) });
      }
      form.forEach((family, index) => {
        if (!family.critical) return;
        expect(family.atoms).toHaveLength(2);
        for (const part of [0, 1]) {
          const responses = structuredClone(correct);
          responses[index].answers[part].answer = wrong(family, part);
          expect(scoreAssessment(policy.module, form, responses)).toMatchObject({ score: policy.count - 1, passed: false, failedCritical: [family.objective] });
          criticalFailures++;
        }
      });
    }
    report.push({ module: policy.module, lessons: catalog.LESSONS.map(lesson => ({ id: lesson.id, title: lesson.title, objectives: lesson.objectives })), objectives: policy.count, practice: policy.count * 2, independent: policy.count * 3, threshold: Math.ceil(policy.count * .8), critical: policy.critical, criticalFailures, content: catalog.CONTENT, assessment: catalog.ASSESSMENT });
  }
  expect(report.reduce((total, item) => total + item.criticalFailures, 0)).toBe(246);
  writeFileSync("outputs/task-013-8/mastery-coverage.json", JSON.stringify(report, null, 2) + "\n");
});

