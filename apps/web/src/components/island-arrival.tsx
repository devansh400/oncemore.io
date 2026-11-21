import "../../public/floating-worlds/island-transition.css";

/*
 * Run as the campaign HTML arrives so the veil can cover the first paint.
 *
 * The sky may prerender this page while an island is framed. A prerendered
 * page runs this script before the dive has recorded its arrival, so it holds
 * the veil fully covered (`data-island-arrival-pending`) and decides when the
 * page is actually shown: start the fade if it was entered by a dive, or drop
 * the veil at once if the visitor got here some other way.
 */
const startArrival = `(() => {
  try {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const arrive = () => {
      root.removeAttribute("data-island-arrival-pending");
      const key = "floating-worlds:arrival";
      const arrival = JSON.parse(sessionStorage.getItem(key));
      if (arrival?.path !== location.pathname) return;
      sessionStorage.removeItem(key);
      if (Date.now() - arrival.at > 30000) return;
      const clear = () => root.removeAttribute("data-island-arrival");
      root.setAttribute("data-island-arrival", "");
      addEventListener("pagehide", clear, { once: true });
      setTimeout(clear, 2000);
    };
    if (document.prerendering) {
      root.setAttribute("data-island-arrival-pending", "");
      document.addEventListener("prerenderingchange", arrive, { once: true });
    } else arrive();
  } catch {}
})();`;

export function IslandArrival() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: startArrival }} />
      <div className="island-arrival-veil" aria-hidden="true" />
    </>
  );
}
