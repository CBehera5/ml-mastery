"use client";
import type { ComponentType } from "react";
import { CodeLabSection, type CodeLabConfig } from "../../learn/linear-regression/lessons/code-lab-section";
import { LossPlayground } from "../optimization/loss-playground";
import { OBJECTIVE_CODE } from "../optimization/objectives-python";
import { GeometryPlayground, RegularizationPlayground, ResponsiblePlayground, StabilityPlayground, UpdatesPlayground } from "./optimization-labs";
import { FunctionsPlayground, GraphsPlayground, LogarithmsPlayground, PowersPlayground, TransformationsPlayground, VariablesPlayground } from "./algebra-labs";
import { FN_CODE, GR_CODE, LOG_CODE, POW_CODE, TR_CODE, VAR_CODE } from "./algebra-code";
import { GradientCheckPlayground, RulesPlayground, SecantsPlayground, StepSizePlayground } from "./calc-labs";
import { DBG_CODE, RULE_CODE, SEC_CODE, STEP_CODE } from "./calc-code";
import { DotPlayground, EigenPlayground, InversePlayground, MatMulPlayground, MatVecPlayground, SpanPlayground, TransformPlayground, VectorsPlayground } from "./la-labs";
import { LA_DOT, LA_EG, LA_IN, LA_MM, LA_MV, LA_SP, LA_TR, LA_VEC } from "./la-code";
import { BayesPlayground, BinomialPlayground, ConditionalPlayground, EventsPlayground, GridPlayground, ThresholdPlayground } from "./prob-labs";
import { PR_BY, PR_BN, PR_CD, PR_EV, PR_GR, PR_TH } from "./prob-code";
import { GEOMETRY_CODE, REG_CODE, RESP_CODE, STABILITY_CODE, UPDATES_CODE } from "./optimization-code";

export type Extra = { Playground?: ComponentType<{ onDone?: () => void }>; code?: CodeLabConfig; moreLabel?: string };
/** One entry per lesson, keyed `module/slug`. A lesson page renders its playground first and its code cell after the reflection. */
export const EXTRAS: Record<string, Extra> = {
  "optimization/objectives": { Playground: LossPlayground, code: OBJECTIVE_CODE, moreLabel: "More landscapes: narrow bowl, saddle and double well" },
  "optimization/updates": { Playground: UpdatesPlayground, code: UPDATES_CODE, moreLabel: "The original training explorer" },
  "optimization/geometry": { Playground: GeometryPlayground, code: GEOMETRY_CODE, moreLabel: "The original landscape explorer" },
  "optimization/stability": { Playground: StabilityPlayground, code: STABILITY_CODE, moreLabel: "The original training-history explorer" },
  "optimization/regularization": { Playground: RegularizationPlayground, code: REG_CODE, moreLabel: "The original regularization comparison" },
  "optimization/responsible": { Playground: ResponsiblePlayground, code: RESP_CODE, moreLabel: "The original scaling comparison" },
};
Object.assign(EXTRAS, {
  "algebra/variables": { Playground: VariablesPlayground, code: VAR_CODE, moreLabel: "The general function explorer" },
  "algebra/functions": { Playground: FunctionsPlayground, code: FN_CODE, moreLabel: "The general function explorer" },
  "algebra/graphs": { Playground: GraphsPlayground, code: GR_CODE, moreLabel: "The general function explorer" },
  "algebra/powers": { Playground: PowersPlayground, code: POW_CODE, moreLabel: "The general function explorer" },
  "algebra/logarithms": { Playground: LogarithmsPlayground, code: LOG_CODE, moreLabel: "The general function explorer" },
  "algebra/transformations": { Playground: TransformationsPlayground, code: TR_CODE, moreLabel: "The general function explorer" },
});
Object.assign(EXTRAS, {
  "calculus/secants": { Playground: SecantsPlayground, code: SEC_CODE, moreLabel: "The original secant explorer" },
  "calculus/rules": { Playground: RulesPlayground, code: RULE_CODE, moreLabel: "The rule cards and the worked example" },
  "calculus/lab": { Playground: StepSizePlayground, code: STEP_CODE, moreLabel: "The original three-views lab" },
  "calculus/debug": { Playground: GradientCheckPlayground, code: DBG_CODE, moreLabel: "The original debugging walk-through" },
});
Object.assign(EXTRAS, {
  "linear/vectors": { Playground: VectorsPlayground, code: LA_VEC, moreLabel: "The original vector explorer" },
  "linear/dot": { Playground: DotPlayground, code: LA_DOT, moreLabel: "The original dot-product explorer" },
  "linear/matrix-vector": { Playground: MatVecPlayground, code: LA_MV, moreLabel: "The original rectangular batch explorer" },
  "linear/matrix-matrix": { Playground: MatMulPlayground, code: LA_MM, moreLabel: "The original row-column explorer" },
  "linear/transform": { Playground: TransformPlayground, code: LA_TR, moreLabel: "The original transformation explorer" },
  "linear/span": { Playground: SpanPlayground, code: LA_SP, moreLabel: "The original span explorer" },
  "linear/inverse": { Playground: InversePlayground, code: LA_IN, moreLabel: "The original inverse explorer" },
  "linear/eigen": { Playground: EigenPlayground, code: LA_EG, moreLabel: "The original eigenvector explorer" },
});
Object.assign(EXTRAS, {
  "probability/understanding": { Playground: EventsPlayground, code: PR_EV, moreLabel: "The original events lab" },
  "probability/multiple-events": { Playground: GridPlayground, code: PR_GR, moreLabel: "The original events lab" },
  "probability/conditional": { Playground: ConditionalPlayground, code: PR_CD, moreLabel: "The original events lab" },
  "probability/bayes": { Playground: BayesPlayground, code: PR_BY, moreLabel: "The original Bayes lab" },
  "probability/distributions": { Playground: BinomialPlayground, code: PR_BN, moreLabel: "The original distributions lab" },
  "probability/ml": { Playground: ThresholdPlayground, code: PR_TH, moreLabel: "The original threshold lab" },
});
export const extraFor = (module: string, slug: string): Extra | undefined => EXTRAS[`${module}/${slug}`];
export function LessonPlayground({ module, slug, onDone }: { module: string; slug: string; onDone?: () => void }) { const P = extraFor(module, slug)?.Playground; return P ? <P onDone={onDone} /> : null; }
export function LessonCode({ module, slug }: { module: string; slug: string }) { const c = extraFor(module, slug)?.code; return c ? <CodeLabSection key={c.id} config={c} /> : null; }
