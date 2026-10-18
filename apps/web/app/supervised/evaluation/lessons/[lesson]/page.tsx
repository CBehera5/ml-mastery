import { notFound } from "next/navigation";
import { LESSONS } from "../../../module/teaching";
import { EvaluationLesson } from "../../../module/learning";
export const dynamicParams = false;
export function generateStaticParams() { return LESSONS.map(lesson => ({ lesson: lesson.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const content = LESSONS.find(item => item.slug === lesson);
  return { title: content ? `${lesson.toUpperCase()} — ${content.title} | ML Mastery` : "Evaluation Foundations | ML Mastery" };
}
export default async function Page({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const index = LESSONS.findIndex(item => item.slug === lesson);
  if (index < 0) notFound();
  return <EvaluationLesson lesson={index}/>;
}
