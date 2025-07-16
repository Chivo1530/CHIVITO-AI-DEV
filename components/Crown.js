export default function Crown({ className = "w-8 h-8", color = "#DC143C" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple Crown Outline */}
      <path
        d="M3 18h18v2H3v-2z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Crown Body - Simple Outline */}
      <path
        d="M4 16h16L18 8l-3 4-3-6-3 6-3-4-2 8z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Crown Peak Points */}
      <circle cx="12" cy="4" r="1" fill={color} />
      <circle cx="6" cy="8" r="0.5" fill={color} />
      <circle cx="18" cy="8" r="0.5" fill={color} />
      
      {/* Center Jewel */}
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  );
}