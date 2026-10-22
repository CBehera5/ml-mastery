"use client";
import type { RegressionLessonId } from "../curriculum";
import { EquationLab } from "./equation-lab";
import { ErrorsLab } from "./errors-lab";
import { FailureModesLab } from "./failure-modes-lab";
import { GradientLab } from "./gradient-lab";
import { MultipleFeaturesLab } from "./multiple-features-lab";

import { InstructionalLesson } from "../lessons/instructional-lesson";
export function RegressionLabRouter({lessonId}:{lessonId:RegressionLessonId}){switch(lessonId){case"equation":return <InstructionalLesson key="equation" id="equation">{(explore,reveal,explanation)=><EquationLab onExplore={explore} onDiscover={reveal} afterDiscovery={explanation}/>}</InstructionalLesson>;case"errors":return <ErrorsLab/>;case"gradient-descent":return <InstructionalLesson key="gradient-descent" id="gradient-descent"><GradientLab/></InstructionalLesson>;case"multiple-features":return <InstructionalLesson key="multiple-features" id="multiple-features"><MultipleFeaturesLab/></InstructionalLesson>;case"failure-modes":return <InstructionalLesson key="failure-modes" id="failure-modes"><FailureModesLab/></InstructionalLesson>;default:return null}}
