import {editorialMetadata} from "../../../experience/editorial-metadata";
import { notFound } from "next/navigation";
import { LESSONS } from "../teaching";
import { GradientBoostingLesson } from "../learning";
export const dynamicParams = false;
export function generateStaticParams() { return LESSONS.map(lesson=>({lesson:lesson.slug})); }
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}) { const {lesson}=await params; return editorialMetadata(`/supervised/gradient-boosting/${lesson}`); }
export default async function Page({params}:{params:Promise<{lesson:string}>}) { const {lesson}=await params; const index=LESSONS.findIndex(item=>item.slug===lesson); if(index<0)notFound(); return <GradientBoostingLesson lesson={index}/>; }
