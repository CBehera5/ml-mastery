from pathlib import Path
p=Path('apps/web/app/learn/linear-regression/lessons/instructional-content.ts');s=p.read_text();s += '''
export const INSTRUCTIONAL_OUTCOMES: Record<InstructionalId,string[]> = {
 equation:["Calculate a prediction from its input, weight and bias.","Explain the slope effect at positive, zero and negative inputs.","Interpret bias changes and avoid causal claims.","Calculate a residual and explain its sign."],
 "gradient-descent":["Explain why descent moves opposite the gradient.","Trace a simultaneous parameter update numerically.","Diagnose learning-rate instability from a sequence of losses.","Distinguish optimization evidence from generalization."],
 "multiple-features":["Calculate aligned weighted contributions.","Connect a dot product to a correctly shaped matrix prediction.","Apply training-only preprocessing to held-out inputs.","Explain why correlated inputs limit coefficient interpretation."],
 "failure-modes":["Diagnose underfitting using residual structure.","Recognize overfitting from training and validation comparisons.","Investigate outliers before choosing treatment.","Interpret unstable coefficients under correlated features.","Detect information leakage at prediction time.","Reject unsupported extrapolation claims.","Choose evaluation that represents deployment."]
};
''';p.write_text(s)
p=Path('apps/web/app/learn/linear-regression/lessons/instructional-lesson.tsx');s=p.read_text().replace('INSTRUCTIONS, instructionalObjectiveIds','INSTRUCTIONS, INSTRUCTIONAL_OUTCOMES, instructionalObjectiveIds').replace('{content.checks.map(check=><li key={check.id}>{check.prompt}</li>)}','{INSTRUCTIONAL_OUTCOMES[id].map(outcome=><li key={outcome}>{outcome}</li>)}');p.write_text(s)
p=Path('apps/web/app/learn/foundation/reference-catalog.ts');s=p.read_text();s='import { INSTRUCTIONS, INSTRUCTIONAL_IDS, INSTRUCTIONAL_OUTCOMES, instructionalObjectiveIds, type InstructionalId } from "../linear-regression/lessons/instructional-content";\n'+s
s=s.replace(': [`linear-regression.${id}.objective`];',': INSTRUCTIONAL_IDS.includes(id as InstructionalId) ? instructionalObjectiveIds(id as InstructionalId) : [`linear-regression.${id}.objective`];',1)
s=s.replace(': [];',': INSTRUCTIONAL_IDS.includes(id as InstructionalId) ? INSTRUCTIONS[id as InstructionalId].checks.map(check=>check.id) : [];',1)
s=s.replace('    ...REGRESSION_LESSONS.filter', '''    ...INSTRUCTIONAL_IDS.flatMap(id => INSTRUCTIONS[id].checks.map((check,index) => ({ id: check.objectiveIds[0], moduleId: "supervised.linear-regression", statement: INSTRUCTIONAL_OUTCOMES[id][index], evidenceKinds: ["exercise" as const], masteryRequired: true, remediationLessonIds: [`linear-regression.${id}`] }))),
    ...REGRESSION_LESSONS.filter''')
s=s.replace('...IMPLEMENTATION_EXERCISES.map(({ id }) => id)],','...IMPLEMENTATION_EXERCISES.map(({ id }) => id), ...INSTRUCTIONAL_IDS.flatMap(id=>INSTRUCTIONS[id].checks.map(check=>check.id))],');p.write_text(s)
p=Path('apps/web/app/globals.css');s=p.read_text();s+='''
/* Instructional labs: native controls and a readable single-column assessment flow. */
.instructional-checks { display: grid; gap: 1.25rem; }
.instructional-checks fieldset { min-width: 0; border: 1px solid var(--border, #b8c4d0); border-radius: 12px; padding: 1rem; }
.instructional-checks legend { max-width: 100%; font-weight: 600; padding: 0 .25rem; }
.instructional-checks label { display: flex; align-items: center; gap: .6rem; padding: .6rem 0; }
.instructional-checks input[type=number] { width: 9rem; max-width: 100%; padding: .6rem; }
.why-regression-lesson code { overflow-wrap: anywhere; }
.why-regression-lesson dl div { margin-bottom: .75rem; }
.why-regression-lesson dd { margin-left: 0; }
.lab-visual table { width: 100%; border-collapse: collapse; }
.lab-visual th, .lab-visual td { text-align: left; padding: .5rem; border-bottom: 1px solid #b8c4d0; }
''';p.write_text(s)
