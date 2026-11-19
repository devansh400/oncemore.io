import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

export const brandDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--brand-display",
});
export const brandBody = DM_Sans({ subsets: ["latin"], variable: "--brand-body" });
