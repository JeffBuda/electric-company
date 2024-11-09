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
    
    {/* Windows Row 1 */}
    <rect x="22" y="38" width="2" height="4" fill="#000000" />
    <rect x="26" y="38" width="2" height="4" fill="#000000" />
    <rect x="30" y="38" width="2" height="4" fill="#000000" />
    <rect x="34" y="38" width="2" height="4" fill="#000000" />
    <rect x="38" y="38" width="2" height="4" fill="#000000" />
    <rect x="42" y="38" width="2" height="4" fill="#000000" />

    {/* Windows Row 2 */}
    <rect x="22" y="44" width="2" height="4" fill="#000000" />
    <rect x="26" y="44" width="2" height="4" fill="#000000" />
    <rect x="30" y="44" width="2" height="4" fill="#000000" />
    <rect x="34" y="44" width="2" height="4" fill="#000000" />
    <rect x="38" y="44" width="2" height="4" fill="#000000" />
    <rect x="42" y="44" width="2" height="4" fill="#000000" />

    {/* Windows Row 3 */}
    <rect x="22" y="50" width="2" height="4" fill="#000000" />
    <rect x="26" y="50" width="2" height="4" fill="#000000" />
    <rect x="30" y="50" width="2" height="4" fill="#000000" />
    <rect x="34" y="50" width="2" height="4" fill="#000000" />
    <rect x="38" y="50" width="2" height="4" fill="#000000" />
    <rect x="42" y="50" width="2" height="4" fill="#000000" />

    {/* Smokestack 1 */}
    <rect x="22" y="24" width="6" height="12" fill="#696969" />
    <circle cx="25" cy="20" r="3" fill="#D3D3D3" />
    <circle cx="26" cy="16" r="2.5" fill="#D3D3D3" />
    <circle cx="27" cy="12" r="2" fill="#D3D3D3" />

    {/* Smokestack 2 */}
    <rect x="30" y="20" width="6" height="16" fill="#696969" />
    <circle cx="33" cy="16" r="3" fill="#D3D3D3" />
    <circle cx="34" cy="12" r="2.5" fill="#D3D3D3" />
    <circle cx="35" cy="8" r="2" fill="#D3D3D3" />

    {/* Smokestack 3 */}
    <rect x="38" y="16" width="6" height="20" fill="#696969" />
    <circle cx="41" cy="12" r="3" fill="#D3D3D3" />
    <circle cx="42" cy="8" r="2.5" fill="#D3D3D3" />
    <circle cx="43" cy="4" r="2" fill="#D3D3D3" />
  </svg>
);

export default SourceIcon;