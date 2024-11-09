// TreeIcon.tsx
import React from 'react';

const TreeIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    {/* Tree 1 */}
    <rect x="10" y="40" width="8" height="16" fill="#8B4513" />
    <circle cx="14" cy="36" r="6" fill="#228B22" />
    <circle cx="10" cy="30" r="6" fill="#228B22" />
    <circle cx="18" cy="30" r="6" fill="#228B22" />

    {/* Tree 2 */}
    <rect x="28" y="40" width="8" height="16" fill="#8B4513" />
    <circle cx="32" cy="36" r="8" fill="#228B22" />
    <circle cx="28" cy="30" r="6" fill="#228B22" />
    <circle cx="36" cy="30" r="6" fill="#228B22" />
    <circle cx="32" cy="24" r="6" fill="#228B22" />

    {/* Tree 3 */}
    <rect x="46" y="40" width="8" height="16" fill="#8B4513" />
    <circle cx="50" cy="36" r="8" fill="#228B22" />
    <circle cx="46" cy="30" r="6" fill="#228B22" />
  </svg>
);

export default TreeIcon;