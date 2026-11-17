export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M48.7 13.9A25 25 0 1 0 48.7 50.1"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M38 10a24 24 0 0 1 0 44A28 28 0 0 0 38 10Z" fill="currentColor" />
      <circle cx="53" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}
