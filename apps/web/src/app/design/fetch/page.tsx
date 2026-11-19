import type { Metadata } from "next";

import { brandBody, brandDisplay } from "../brand-fonts";
import { FetchSandbox } from "./fetch-sandbox";

export const metadata: Metadata = {
  title: "Fetch | OnceMore Design",
  description: "The fetch quest's poses, props and vault, for review outside the sky.",
};

export default function FetchDesignPage() {
  return (
    <div className={`${brandBody.className} ${brandDisplay.variable}`}>
      <FetchSandbox displayClassName={brandDisplay.className} />
    </div>
  );
}
