import type { Metadata } from "next";
import { LearningJourney } from "../learning-journey/dashboard";

export const metadata: Metadata = { title: "Your Learning Journey | ML Mastery", description: "Find your next useful step from mathematics and Python to trained, evaluated machine-learning models." };
export default function JourneyPage() { return <LearningJourney />; }
