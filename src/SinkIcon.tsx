// SinkIcon.tsx
import React from 'react';

const SinkIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    {/* Building 1 */}
    <rect x="10" y="20" width="12" height="32" fill="#A9A9A9" />
    {/* Windows for Building 1 */}
    {[...Array(8)].map((_, row) =>
      [...Array(3)].map((_, col) => (
        <rect
          key={`b1-${row}-${col}`}
          x={12 + col * 4}
          y={22 + row * 4}
          width="2"
          height="2"
          fill="#000000"
        />
      ))
    )}

    {/* Building 2 */}
    <rect x="26" y="12" width="12" height="40" fill="#A9A9A9" />
    {/* Windows for Building 2 */}
    {[...Array(10)].map((_, row) =>
      [...Array(3)].map((_, col) => (
        <rect
          key={`b2-${row}-${col}`}
          x={28 + col * 4}
          y={14 + row * 4}
          width="2"
          height="2"
          fill="#000000"
        />
      ))
    )}

    {/* Building 3 */}
    <rect x="42" y="16" width="12" height="36" fill="#A9A9A9" />
    {/* Windows for Building 3 */}
    {[...Array(9)].map((_, row) =>
      [...Array(3)].map((_, col) => (
        <rect
          key={`b3-${row}-${col}`}
          x={44 + col * 4}
          y={18 + row * 4}
          width="2"
          height="2"
          fill="#000000"
        />
      ))
    )}
  </svg>
);

export default SinkIcon;