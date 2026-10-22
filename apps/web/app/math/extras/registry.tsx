"use client";
import type { ComponentType } from "react";
import { CodeLabSection, type CodeLabConfig } from "../../learn/linear-regression/lessons/code-lab-section";
import { LossPlayground } from "../optimization/loss-playground";
import { OBJECTIVE_CODE } from "../optimization/objectives-python";
import { GeometryPlayground, RegularizationPlayground, ResponsiblePlayground, StabilityPlayground, UpdatesPlayground } from "./optimization-labs";
import { FunctionsPlayground, GraphsPlayground, LogarithmsPlayground, PowersPlayground, TransformationsPlayground, VariablesPlayground } from "./algebra-labs";
import { FN_CODE, GR_CODE, LOG_CODE, POW_CODE, TR_CODE, VAR_CODE } from "./algebra-code";
import { GEOMETRY_CODE, REG_CODE, RESP_CODE, STABILITY_CODE, UPDATES_CODE } from "./optimization-code";

export type Extra = { Playground?: ComponentType; code?: CodeLabConfig; moreLabel?: string };
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
export const extraFor = (module: string, slug: string): Extra | undefined => EXTRAS[`${module}/${slug}`];
export function LessonPlayground({ module, slug }: { module: string; slug: string }) { const P = extraFor(module, slug)?.Playground; return P ? <P /> : null; }
export function LessonCode({ module, slug }: { module: string; slug: string }) { const c = extraFor(module, slug)?.code; return c ? <CodeLabSection config={c} /> : null; }
