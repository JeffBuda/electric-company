// TornadoIcon.tsx
import React from 'react';

const TornadoIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    {/* Cyclone */}
    <ellipse cx="32" cy="10" rx="20" ry="6" fill="#808080" />
    <ellipse cx="32" cy="20" rx="18" ry="5" fill="#808080" />
    <ellipse cx="32" cy="30" rx="16" ry="4" fill="#808080" />
    <ellipse cx="32" cy="40" rx="14" ry="3" fill="#808080" />
    <ellipse cx="32" cy="50" rx="12" ry="2" fill="#808080" />
    <ellipse cx="32" cy="58" rx="10" ry="1" fill="#808080" />

    {/* White streaks */}
    <path d="M12 10 Q32 5 52 10" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <path d="M14 20 Q32 15 50 20" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <path d="M16 30 Q32 25 48 30" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <path d="M18 40 Q32 35 46 40" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <path d="M20 50 Q32 45 44 50" stroke="#FFFFFF" strokeWidth="1" fill="none" />

    {/* Dust Clouds */}
    <circle cx="28" cy="62" r="4" fill="#D3D3D3" />
    <circle cx="36" cy="62" r="4" fill="#D3D3D3" />
  </svg>
);

export default TornadoIcon;