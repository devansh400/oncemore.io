export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      <div className="grain-surface absolute inset-0 opacity-[0.055] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.62)_100%)]" />
    </div>
  );
}
