import type { Metadata } from "next";
import { SignupExperience } from "./signup-experience";

export const metadata: Metadata = {
  title: "The Little Office — A small start to something good",
  description:
    "Meet Pip. Your very small, very dedicated signup assistant. A tiny office adventure in three little steps.",
};

export default function SignupPage() {
  return <SignupExperience />;
}
