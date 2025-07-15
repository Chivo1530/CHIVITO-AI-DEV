export default function Crown({ className = "w-8 h-8", color = "#FFD700" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
        <filter id="crownGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Crown Base */}
      <path
        d="M3 18h18v2H3v-2z"
        fill="url(#crownGradient)"
        filter="url(#crownGlow)"
      />
      
      {/* Crown Body */}
      <path
        d="M4 16h16L18 8l-3 4-3-6-3 6-3-4-2 8z"
        fill="url(#crownGradient)"
        filter="url(#crownGlow)"
      />
      
      {/* Crown Gems */}
      <circle cx="12" cy="10" r="1" fill="#DC143C" />
      <circle cx="8" cy="12" r="0.5" fill="#DC143C" />
      <circle cx="16" cy="12" r="0.5" fill="#DC143C" />
      
      {/* Crown Highlights */}
      <path
        d="M5 14l2-4 2 2 1-4 1 4 2-2 2 4H5z"
        fill="rgba(255, 255, 255, 0.3)"
      />
      
      {/* Crown Jewels */}
      <polygon
        points="12,4 13,8 11,8"
        fill="#DC143C"
        filter="url(#crownGlow)"
      />
      <polygon
        points="7,8 8,12 6,12"
        fill="#8B0000"
      />
      <polygon
        points="17,8 18,12 16,12"
        fill="#8B0000"
      />
    </svg>
  );
}