import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";

import styles from "./profile.module.css";

const display = Nunito({
  variable: "--font-horizon-display",
  subsets: ["latin"],
  display: "swap",
});

const body = DM_Sans({
  variable: "--font-horizon-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Profile — OnceMore",
  description: "Your OnceMore profile, experiences, and account settings.",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${styles.scope} ${display.variable} ${body.variable}`}>{children}</div>;
}
