// ConduitIcon.tsx
import React from 'react';

const ConduitIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    {/* Vertical Pole */}
    <rect x="30" y="16" width="4" height="32" fill="#8B4513" />

    {/* Cross Member */}
    <rect x="24" y="16" width="16" height="4" fill="#8B4513" />

    {/* Wires */}
    <path d="M24,20 Q28,28 24,36" stroke="#000000" strokeWidth="2" fill="none" />
    <path d="M40,20 Q36,28 40,36" stroke="#000000" strokeWidth="2" fill="none" />
  </svg>
);

export default ConduitIcon;