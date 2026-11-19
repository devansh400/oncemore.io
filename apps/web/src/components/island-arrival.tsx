import "../../public/floating-worlds/island-transition.css";

// Run as the campaign HTML arrives so the veil can cover the first paint.
const startArrival = `(() => {
  try {
    const key = "floating-worlds:arrival";
    const arrival = JSON.parse(sessionStorage.getItem(key));
    if (arrival?.path !== location.pathname) return;
    sessionStorage.removeItem(key);
    if (Date.now() - arrival.at > 30000 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const clear = () => root.removeAttribute("data-island-arrival");
    root.setAttribute("data-island-arrival", "");
    addEventListener("pagehide", clear, { once: true });
    setTimeout(clear, 2000);
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
