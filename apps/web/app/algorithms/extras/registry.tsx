"use client";
import type { ComponentType } from "react";
import { CodeLabSection, type CodeLabConfig } from "../linear-regression/lessons/code-lab-section";
import { CHOOSE_CODE, LIMITS_CODE, SCALE_CODE, VOTE_CODE } from "../knn/playground/knn-code";
import { ChooseKPlayground, LimitsPlayground, NeighborsPlayground, ScalePlayground } from "../knn/playground/knn-labs";

export type AlgoExtra = { Playground?: ComponentType; code?: CodeLabConfig };
/** One entry per lesson, keyed `module/lessonIndex` (zero-based). A lesson page shows its playground before the formal experiment and its code cell in the Python section. */
export const ALGO_EXTRAS: Record<string, AlgoExtra> = {
  "knn/0": { Playground: NeighborsPlayground, code: VOTE_CODE },
  "knn/1": { Playground: ScalePlayground, code: SCALE_CODE },
  "knn/2": { Playground: ChooseKPlayground, code: CHOOSE_CODE },
  "knn/3": { Playground: LimitsPlayground, code: LIMITS_CODE },
};
export const algoExtra = (module: string, lesson: number): AlgoExtra | undefined => ALGO_EXTRAS[`${module}/${lesson}`];
export const hasAlgoCode = (module: string, lesson: number) => Boolean(algoExtra(module, lesson)?.code);
export function AlgoPlayground({ module, lesson }: { module: string; lesson: number }) { const P = algoExtra(module, lesson)?.Playground; return P ? <P /> : null; }
export function AlgoCode({ module, lesson }: { module: string; lesson: number }) { const code = algoExtra(module, lesson)?.code; return code ? <CodeLabSection key={code.id} config={code} /> : null; }
