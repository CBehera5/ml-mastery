import type { Metadata } from "next";
import { Landing } from "./landing/landing";

export const metadata: Metadata = {
  title: { absolute: "ML Mastery | Understand machine learning, step by step" },
  description: "Explore mathematics, connect it to Python, and understand how models learn. Start freely. Project Studio is Coming Soon.",
};
export default function Home() { return <Landing />; }
