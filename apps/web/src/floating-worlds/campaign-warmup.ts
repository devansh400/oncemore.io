import { roomyConnection, warmUrls } from "@/lib/frame-sequence";

/*
 * Makes the dive into a campaign page land on something already loaded.
 * The sky leaves with a full `location.assign`, so the campaign page needs
 * its HTML, JS, CSS, fonts and poster before it can paint under the arrival
 * veil. Those are small, so `warmCampaignShells` fetches them for every
 * island once the sky is idle; the multi-megabyte frame data is left to the
 * island the visitor actually frames.
 */

const shells = new Set<string>();

/** Fetch each page's HTML and warm the subresources it names. */
export function warmCampaignShells(hrefs: string[]) {
  /*
   * Preview packs for every island only on desktop-class devices: on a phone
   * link, warming the other island's pack measurably slowed the first frame
   * of the one being entered (they share the bandwidth).
   */
  const withPacks = roomyConnection() && matchMedia("(pointer: fine)").matches;
  for (const href of hrefs) {
    if (shells.has(href)) continue;
    shells.add(href);
    void (async () => {
      try {
        const response = await fetch(href, { priority: "low" });
        if (!response.ok) return;
        const html = new DOMParser().parseFromString(await response.text(), "text/html");
        const urls = [
          ...html.querySelectorAll<HTMLScriptElement>("script[src]"),
          ...html.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet], link[rel=preload]"),
        ]
          .map((element) => new URL(element.getAttribute("src") ?? element.getAttribute("href")!, response.url))
          .filter((url) => url.origin === location.origin)
          // The preview pack is a few MB: only where the link can spare it.
          .filter((url) => withPacks || !url.pathname.endsWith(".pack"))
          .map((url) => url.href);
        warmUrls(urls);
      } catch {}
    })();
  }
}

/*
 * While an island is framed, have the browser render its page in the
 * background (Speculation Rules), so the dive swaps to a page that has
 * already painted. Prerendering runs a second page next to the WebGL sky, so
 * it's limited to desktop-class devices on a good link; elsewhere the
 * document is only prefetched. Clearing the rules cancels the prerender.
 */
let rules: HTMLScriptElement | null = null;
export function speculateCampaign(href: string | null | undefined) {
  rules?.remove();
  rules = null;
  if (!href || !HTMLScriptElement.supports?.("speculationrules")) return;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const desktop = matchMedia("(pointer: fine)").matches && memory >= 4;
  const action = desktop && roomyConnection() ? "prerender" : "prefetch";
  rules = document.createElement("script");
  rules.type = "speculationrules";
  rules.textContent = JSON.stringify({ [action]: [{ urls: [href], eagerness: "immediate" }] });
  document.head.append(rules);
}
