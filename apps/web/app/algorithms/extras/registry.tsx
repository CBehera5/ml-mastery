"use client";
import type { ComponentType } from "react";
import { CodeLabSection, type CodeLabConfig } from "../linear-regression/lessons/code-lab-section";
import { CHOOSE_CODE, LIMITS_CODE, SCALE_CODE, VOTE_CODE } from "../knn/playground/knn-code";
import { ChooseKPlayground, LimitsPlayground, NeighborsPlayground, ScalePlayground } from "../knn/playground/knn-labs";
import { CONF_CODE, EVIDENCE_CODE, GAUSS_CODE, SMOOTH_CODE } from "../naive-bayes/playground/nb-code";
import { ConfidencePlayground, DensityPlayground, EvidencePlayground, SmoothingPlayground } from "../naive-bayes/playground/nb-labs";
import { COLUMNS_CODE, CURVE_CODE, DEGREE_CODE, LIMITS_CODE as POLY_LIMITS_CODE } from "../polynomial/playground/poly-code";
import { ColumnsPlayground, CurvePlayground, DegreePlayground, LimitsPlayground as PolyLimitsPlayground } from "../polynomial/playground/poly-labs";
import { ELASTIC_CODE, INTERP_CODE, LASSO_CODE, RIDGE_CODE, SAFE_CODE, WHY_CODE } from "../regularization/playground/reg-code";
import { ElasticPlayground, InterpretPlayground, LassoPlayground, RidgePlayground, SafePlayground, WhyPlayground } from "../regularization/playground/reg-labs";
import { CONF_CODE as LG_CONF_CODE, FLOW_CODE, GEO_CODE, LOSS_CODE, SIG_CODE, THR_CODE } from "../logistic/playground/lg-code";
import { BoundaryPlayground, ConfidencePlayground as LgConfidencePlayground, LeakPlayground, LossPlayground, SigmoidPlayground, ThresholdPlayground } from "../logistic/playground/lg-labs";
import { ALIGN_CODE, DEPTH_CODE, GINI_CODE, PART_CODE, RULE_CODE, SPLIT_CODE } from "../decision-trees/playground/dt-code";
import { AlignPlayground, DepthPlayground, GiniPlayground, PartitionPlayground, RulePlayground, SplitPlayground } from "../decision-trees/playground/dt-labs";
import { AVG_CODE, BAG_CODE, IMP_CODE, OOB_CODE, VOTE_CODE as RF_VOTE_CODE } from "../random-forests/playground/rf-code";
import { AveragePlayground, BagPlayground, ImportancePlayground, OobPlayground, VotePlayground } from "../random-forests/playground/rf-labs";

export type AlgoExtra = { Playground?: ComponentType; code?: CodeLabConfig };
/** One entry per lesson, keyed `module/lessonIndex` (zero-based). A lesson page shows its playground before the formal experiment and its code cell in the Python section. */
export const ALGO_EXTRAS: Record<string, AlgoExtra> = {
  "knn/0": { Playground: NeighborsPlayground, code: VOTE_CODE },
  "knn/1": { Playground: ScalePlayground, code: SCALE_CODE },
  "knn/2": { Playground: ChooseKPlayground, code: CHOOSE_CODE },
  "knn/3": { Playground: LimitsPlayground, code: LIMITS_CODE },
  "naive-bayes/0": { Playground: EvidencePlayground, code: EVIDENCE_CODE },
  "naive-bayes/1": { Playground: SmoothingPlayground, code: SMOOTH_CODE },
  "naive-bayes/2": { Playground: DensityPlayground, code: GAUSS_CODE },
  "naive-bayes/3": { Playground: ConfidencePlayground, code: CONF_CODE },
  "polynomial/0": { Playground: CurvePlayground, code: CURVE_CODE },
  "polynomial/1": { Playground: ColumnsPlayground, code: COLUMNS_CODE },
  "polynomial/2": { Playground: DegreePlayground, code: DEGREE_CODE },
  "polynomial/3": { Playground: PolyLimitsPlayground, code: POLY_LIMITS_CODE },
  "regularization/0": { Playground: WhyPlayground, code: WHY_CODE },
  "regularization/1": { Playground: RidgePlayground, code: RIDGE_CODE },
  "regularization/2": { Playground: LassoPlayground, code: LASSO_CODE },
  "regularization/3": { Playground: ElasticPlayground, code: ELASTIC_CODE },
  "regularization/4": { Playground: SafePlayground, code: SAFE_CODE },
  "regularization/5": { Playground: InterpretPlayground, code: INTERP_CODE },
  "decision-trees/0": { Playground: PartitionPlayground, code: PART_CODE },
  "decision-trees/1": { Playground: SplitPlayground, code: SPLIT_CODE },
  "decision-trees/2": { Playground: GiniPlayground, code: GINI_CODE },
  "decision-trees/3": { Playground: DepthPlayground, code: DEPTH_CODE },
  "decision-trees/4": { Playground: AlignPlayground, code: ALIGN_CODE },
  "decision-trees/5": { Playground: RulePlayground, code: RULE_CODE },
  "random-forests/0": { Playground: BagPlayground, code: BAG_CODE },
  "random-forests/1": { Playground: AveragePlayground, code: AVG_CODE },
  "random-forests/2": { Playground: VotePlayground, code: RF_VOTE_CODE },
  "random-forests/3": { Playground: OobPlayground, code: OOB_CODE },
  "random-forests/4": { Playground: ImportancePlayground, code: IMP_CODE },
  "logistic/0": { Playground: SigmoidPlayground, code: SIG_CODE },
  "logistic/1": { Playground: LossPlayground, code: LOSS_CODE },
  "logistic/2": { Playground: ThresholdPlayground, code: THR_CODE },
  "logistic/3": { Playground: BoundaryPlayground, code: GEO_CODE },
  "logistic/4": { Playground: LeakPlayground, code: FLOW_CODE },
  "logistic/5": { Playground: LgConfidencePlayground, code: LG_CONF_CODE },
};
export const algoExtra = (module: string, lesson: number): AlgoExtra | undefined => ALGO_EXTRAS[`${module}/${lesson}`];
export const hasAlgoCode = (module: string, lesson: number) => Boolean(algoExtra(module, lesson)?.code);
export function AlgoPlayground({ module, lesson }: { module: string; lesson: number }) { const P = algoExtra(module, lesson)?.Playground; return P ? <P /> : null; }
export function AlgoCode({ module, lesson }: { module: string; lesson: number }) { const code = algoExtra(module, lesson)?.code; return code ? <CodeLabSection key={code.id} config={code} /> : null; }
