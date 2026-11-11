import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP as unknown as gsap.Plugin, ScrollTrigger, SplitText);

gsap.defaults({ ease: "power3.out", duration: 0.85 });

export { gsap, ScrollTrigger, SplitText, useGSAP };
