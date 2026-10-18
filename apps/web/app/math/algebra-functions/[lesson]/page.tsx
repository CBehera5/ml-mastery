import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {AlgebraLesson} from "../lesson";
import {AlgebraAssessment} from "../assessment";
import {LESSON_IDS,LESSONS,type LessonId} from "../content";
export const dynamicParams=false;
export function generateStaticParams(){return [...LESSON_IDS,"assessment"].map(lesson=>({lesson}))}
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}):Promise<Metadata>{const{lesson}=await params;return{title:`${lesson==="assessment"?"Independent Algebra assessment":LESSONS[lesson as LessonId]?.title??"Algebra"} | ML Math Lab`}}
export default async function Page({params}:{params:Promise<{lesson:string}>}){const{lesson}=await params;if(lesson==="assessment")return <AlgebraAssessment/>;if(!LESSON_IDS.includes(lesson as LessonId))notFound();return <AlgebraLesson key={lesson} id={lesson as LessonId}/>}
