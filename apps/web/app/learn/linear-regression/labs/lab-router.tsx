"use client";
import type { RegressionLessonId } from "../curriculum";
import { EquationLab } from "./equation-lab";
import { ErrorsLab } from "./errors-lab";
import { FailureModesLab } from "./failure-modes-lab";
import { GradientLab } from "./gradient-lab";
import { MultipleFeaturesLab } from "./multiple-features-lab";

import { InstructionalLesson } from "../lessons/instructional-lesson";
import { GradientCodeSection, GradientStory } from "../lessons/gradient-python";
import { EQUATION_CODE, ERRORS_CODE, ERRORS_STORY, FAILURE_CODE, FAILURE_STORY, MULTI_CODE, MULTI_STORY, Section, Story } from "../lessons/more-python";
export function RegressionLabRouter({lessonId}:{lessonId:RegressionLessonId}){switch(lessonId){case"equation":return <InstructionalLesson key="equation" id="equation" after={<Section config={EQUATION_CODE}/>}>{(explore,reveal,explanation)=><EquationLab onExplore={explore} onDiscover={reveal} afterDiscovery={explanation}/>}</InstructionalLesson>;case"errors":return <><Story config={ERRORS_STORY}/><ErrorsLab/><Section config={ERRORS_CODE}/></>;case"gradient-descent":return <InstructionalLesson key="gradient-descent" id="gradient-descent" before={<GradientStory/>} after={<GradientCodeSection/>}><GradientLab/></InstructionalLesson>;case"multiple-features":return <InstructionalLesson key="multiple-features" id="multiple-features" before={<Story config={MULTI_STORY}/>} after={<Section config={MULTI_CODE}/>}><MultipleFeaturesLab/></InstructionalLesson>;case"failure-modes":return <InstructionalLesson key="failure-modes" id="failure-modes" before={<Story config={FAILURE_STORY}/>} after={<Section config={FAILURE_CODE}/>}><FailureModesLab/></InstructionalLesson>;default:return null}}
