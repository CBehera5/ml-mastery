import type { Metadata } from "next";
import { FeedbackForm } from "./feedback-form";

export const metadata: Metadata = { title: "Beta Feedback | ML Math Lab" };
export default function FeedbackPage() { return <FeedbackForm />; }

