import { notFound } from "next/navigation";
import { LESSONS } from "../catalog";
import { EssentialsLesson } from "../learning";
export const dynamicParams = false;
export function generateStaticParams() { return LESSONS.slice(1).map(lesson => ({ lesson: lesson.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const found = LESSONS.find(item => item.slug === lesson);
  return { title: found ? `${found.title} · Python Essentials` : "Python Essentials" };
}
export default async function Page({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const index = LESSONS.findIndex(item => item.slug === lesson);
  if (index < 1) notFound();
  return <EssentialsLesson lesson={index}/>;
}
