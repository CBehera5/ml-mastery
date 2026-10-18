import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegressionShell } from "../components/regression-shell";
import { RegressionLabRouter } from "../labs/lab-router";
import { WhyLinearRegressionLesson } from "../lessons/why-lesson";
import { MasteryLesson } from "../mastery/mastery-lesson";
import { ProjectLesson } from "../project/project-lesson";
import { ImplementationLesson } from "../lessons/implementation-lesson";
import { findRegressionLesson, REGRESSION_LESSONS } from "../curriculum";

export const dynamicParams = false;
export function generateStaticParams(){return REGRESSION_LESSONS.map((lesson)=>({lesson:lesson.id}))}
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}):Promise<Metadata>{const {lesson:id}=await params,lesson=findRegressionLesson(id);return lesson?{title:`${lesson.title} | ML Math Lab`,description:lesson.objective}:{};}
const LAB_LESSONS=new Set(["equation","errors","gradient-descent","multiple-features","failure-modes"]);
export default async function LinearRegressionLessonPage({params}:{params:Promise<{lesson:string}>}){const {lesson:id}=await params,lesson=findRegressionLesson(id);if(!lesson)notFound();const content=lesson.id==="why"?<WhyLinearRegressionLesson/>:lesson.id==="implementation"?<ImplementationLesson/>:lesson.id==="project"?<ProjectLesson/>:lesson.id==="mastery"?<MasteryLesson/>:LAB_LESSONS.has(lesson.id)?<RegressionLabRouter lessonId={lesson.id}/>:undefined;return <RegressionShell lesson={lesson}>{content}</RegressionShell>}
