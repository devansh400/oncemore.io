export function PipPortrait() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id="pip3d-skin" cx="30%" cy="20%">
          <stop stopColor="#ffe9a1" />
          <stop offset="1" stopColor="#f4b944" />
        </radialGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="#b6f4e0" />
      <ellipse cx="20" cy="39" rx="13" ry="12" fill="#00bba9" />
      <rect x="11" y="10" width="19" height="21" rx="9" fill="url(#pip3d-skin)" />
      <path d="M10 17C7 5 29 2 31 16L25 17 22 13 18 16 14 13 13 17Z" fill="#153c70" />
      <ellipse cx="15" cy="21" rx="1.5" ry="2" fill="#071a38" />
      <ellipse cx="25" cy="21" rx="1.5" ry="2" fill="#071a38" />
      <path
        d="M17 26Q20 29 23 26"
        fill="none"
        stroke="#a66a20"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M16 32h8l-4 6Z" fill="white" />
    </svg>
  );
}
