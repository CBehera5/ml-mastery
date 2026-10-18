import { notFound } from "next/navigation";
import { lessons } from "../content";
import { OptimizationAssessment, OptimizationLesson } from "../learning";
export function generateStaticParams() { return [...lessons.map(lesson=>({lesson:lesson.slug})),{lesson:"mastery"}]; }
export async function generateMetadata({ params }: { params: Promise<{lesson:string}> }) {
  const {lesson}=await params;
  const title=lesson==="mastery"?"Independent Optimization mastery":lessons.find(item=>item.slug===lesson)?.title ?? "Optimization";
  return { title: `${title} | ML Math Lab` };
}
export default async function Page({ params }: { params: Promise<{lesson:string}> }) {
  const {lesson}=await params;
  if(lesson==="mastery")return <OptimizationAssessment/>;
  const entry=lessons.find(item=>item.slug===lesson);
  if(!entry)notFound();
  return <OptimizationLesson slug={entry.slug}/>;
}
