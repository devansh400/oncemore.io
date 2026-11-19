import type { Metadata } from "next";
import { Signup3dExperience } from "./signup-experience";

export const metadata: Metadata = {
  title: "The Little Office in 3D — A big little beginning",
  description:
    "The same tiny office adventure, in a little three-dimensional world. Ring Pip's bell, get your secret code, and begin.",
};

export default function Signup3dPage() {
  return <Signup3dExperience />;
}
