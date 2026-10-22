import { notFound } from "next/navigation";
import { LESSONS } from "../catalog";
import { SklearnLesson } from "../learning";
export const dynamicParams = false;
export function generateStaticParams() { return LESSONS.map(lesson => ({ lesson: lesson.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const found = LESSONS.find(item => item.slug === lesson);
  return { title: found ? `${found.title} · scikit-learn` : "scikit-learn" };
}
export default async function Page({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const index = LESSONS.findIndex(item => item.slug === lesson);
  if (index < 0) notFound();
  return <SklearnLesson lesson={index}/>;
}
