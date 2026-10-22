import type { Metadata } from "next";
import { BetaWelcome } from "./welcome";

export const metadata: Metadata = {
  title: "Private Beta",
  description: "A 15–20 minute private beta for understanding and debugging one neural-network update.",
};

export default function BetaPage() {
  return <BetaWelcome />;
}

