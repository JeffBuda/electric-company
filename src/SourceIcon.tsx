// SourceIcon.tsx
import React from 'react';

const SourceIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    {/* Power Plant Base */}
    <rect x="16" y="32" width="32" height="24" fill="#808080" />
    <rect x="20" y="36" width="24" height="20" fill="#A9A9A9" />

    {/* Smokestack 1 */}
    <rect x="22" y="16" width="6" height="20" fill="#696969" />
    <circle cx="25" cy="12" r="4" fill="#D3D3D3" />
    <circle cx="25" cy="8" r="3" fill="#D3D3D3" />
    <circle cx="25" cy="4" r="2" fill="#D3D3D3" />

    {/* Smokestack 2 */}
    <rect x="36" y="16" width="6" height="20" fill="#696969" />
    <circle cx="39" cy="12" r="4" fill="#D3D3D3" />
    <circle cx="39" cy="8" r="3" fill="#D3D3D3" />
    <circle cx="39" cy="4" r="2" fill="#D3D3D3" />
  </svg>
);

export default SourceIcon;