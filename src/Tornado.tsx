// Tornado.tsx
import React, { useEffect, useState } from 'react';
import TornadoIcon from './TornadoIcon';

type TornadoProps = {
  grid: any[][];
  setGrid: (grid: any[][]) => void;
};

const Tornado: React.FC<TornadoProps> = ({ grid, setGrid }) => {
  const [position, setPosition] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState({ row: 1, col: 1 });

  useEffect(() => {
    const interval = setInterval(() => {
      moveTornado();
    }, 5000);
    return () => clearInterval(interval);
  }, [position]);

  const moveTornado = () => {
    const newRow = position.row + direction.row;
    const newCol = position.col + direction.col;

    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
      const newGrid = [...grid];
      if (newGrid[newRow][newCol].piece === 'conduit') {
        newGrid[newRow][newCol] = { piece: null, powered: false, on: true, remainingPower: 0 };
      }
      setGrid(newGrid);
      setPosition({ row: newRow, col: newCol });
    } else {
      setDirection({ row: -direction.row, col: -direction.col });
    }
  };

  return (
    <div style={{ gridRow: position.row + 1, gridColumn: position.col + 1 }}>
      <TornadoIcon />
    </div>
  );
};

export default Tornado;