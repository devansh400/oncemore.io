import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Process } from "@/components/sections/process";
import { Proof } from "@/components/sections/proof";
import { Work } from "@/components/sections/work";
import { Marquee } from "@/components/ui/marquee";

const ticker = [
  "They Call Him OG",
  "Maa Inti Bangaaram",
  "1M fans in under 42 hours",
  "Interactive worlds",
  "AI-powered moments",
  "Exclusive content",
];

export default function Home() {
  return (
    <>
      <Hero />
      <div className="border-y border-bone/10 py-4">
        <Marquee items={ticker} />
      </div>
      <Manifesto />
      <Proof />
      <Work />
      <Capabilities />
      <Process />
      <Contact />
    </>
  );
}
