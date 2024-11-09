import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import './App.css';

const GRID_SIZE = 10;

const GameBoard: React.FC = () => {
  const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ piece: null, powered: false, on: true }));
  const [grid, setGrid] = useState(initialGrid);
  const [selectedPiece, setSelectedPiece] = useState<'source' | 'conduit' | 'sink' | 'remove' | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePowerStatus();
      updateScore();
    }, 1000);
    return () => clearInterval(interval);
  }, [grid]);

  const updatePowerStatus = () => {
    const newGrid = grid.map(row => row.map(tile => ({ ...tile, powered: false })));

    const isPowered = (row: number, col: number) => {
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return false;
      return newGrid[row][col].powered;
    };

    const powerTile = (row: number, col: number) => {
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
      const tile = newGrid[row][col];
      if (tile.piece === 'source' && tile.on) {
        tile.powered = true;
      } else if (tile.piece === 'conduit' || tile.piece === 'sink') {
        if (
          isPowered(row - 1, col) ||
          isPowered(row + 1, col) ||
          isPowered(row, col - 1) ||
          isPowered(row, col + 1)
        ) {
          tile.powered = true;
        }
      }
    };

    // First pass: power sources
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].piece === 'source' && newGrid[row][col].on) {
          newGrid[row][col].powered = true;
        }
      }
    }

    // Second pass: power conduits and sinks
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        powerTile(row, col);
      }
    }

    setGrid(newGrid);
  };

  const updateScore = () => {
    let newScore = 0;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col].piece === 'source' && grid[row][col].powered) {
          newScore += 1;
        }
      }
    }
    setScore(newScore);
  };

  const handleTileClick = (row: number, col: number) => {
    const newGrid = [...grid];
    const tile = newGrid[row][col];

    if (selectedPiece === 'remove') {
      newGrid[row][col] = { piece: null, powered: false, on: true };
    } else if (tile.piece === 'source') {
      tile.on = !tile.on;
    } else if (selectedPiece) {
      newGrid[row][col] = { piece: selectedPiece, powered: false, on: true };
    }

    setGrid(newGrid);
  };

  const forceRecalculatePower = () => {
    updatePowerStatus();
  };

  const clearGrid = () => {
    setGrid(initialGrid);
  };

  return (
    <div className="game-container">
      <div className="controls">
        <button onClick={() => setSelectedPiece('source')}>Source</button>
        <button onClick={() => setSelectedPiece('conduit')}>Conduit</button>
        <button onClick={() => setSelectedPiece('sink')}>Sink</button>
        <button onClick={() => setSelectedPiece('remove')}>Remove</button>
        <button onClick={forceRecalculatePower}>Refresh</button>
        <button onClick={clearGrid}>Clear</button>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              piece={tile.piece}
              powered={tile.powered}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      <div className="score">Score: {score}</div>
    </div>
  );
};

export default GameBoard;