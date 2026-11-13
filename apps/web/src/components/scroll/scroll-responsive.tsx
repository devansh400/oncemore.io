"use client";

import { useSyncExternalStore } from "react";
import { ScrollExperience } from "./scroll-experience";
import { MobileScrollExperience } from "./scroll-mobile";

const query = "(max-width: 700px)";
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

export function ResponsiveScrollExperience() {
  const mobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return mobile ? <MobileScrollExperience /> : <ScrollExperience />;
}
