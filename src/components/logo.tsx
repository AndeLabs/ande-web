export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
    >
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9F1C" />
          <stop offset="1" stopColor="#2455B8" />
        </linearGradient>
      </defs>
      <path
        d="M50 0L96.6506 25V75L50 100L3.34937 75V25L50 0Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M50 15L81.6506 32.5V67.5L50 85L18.3494 67.5V32.5L50 15Z"
        stroke="hsl(var(--background))"
        strokeWidth="5"
      />
    </svg>
  );
}
