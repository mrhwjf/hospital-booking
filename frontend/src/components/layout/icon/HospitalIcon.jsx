function HospitalIcon({ className = "h-8 w-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true">
      <path
        d="M12 4v16M4 12h16"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default HospitalIcon;
