import type { Metadata } from "next";
import { WrongDirectionChallenge } from "./challenge";

export const metadata: Metadata = {
  title: "Why Is My Model Learning in the Wrong Direction?",
  description: "Debug a gradient-ascent bug by tracing one linear-neuron update.",
};

export default function WrongDirectionPage() {
  return <WrongDirectionChallenge />;
}

