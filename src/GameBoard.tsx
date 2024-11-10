import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import TreeIcon from './TreeIcon'; // Import the TreeIcon component
import LakeIcon from './LakeIcon'; // Import the LakeIcon component
import SourceIcon from './SourceIcon'; // Import the SourceIcon component
import ConduitIcon from './ConduitIcon'; // Import the ConduitIcon component
import SinkIcon from './SinkIcon'; // Import the SinkIcon component
import TornadoIcon from './TornadoIcon'; // Import the TornadoIcon component
import './App.css';

const GRID_SIZE = 50;
const INTERVAL_DURATION = 1000; // 1 second in milliseconds
const CAPACITOR_DURATION = 10; // 10 seconds
const CONDUIT_COST = 10;
const SOURCE_COST = 1000; // Cost of placing a source
const TREE_CHANCE = 0.1; // 10% chance to place a tree
const LAKE_CHANCE = 0.05; // 5% chance to place a lake
const SINK_CHANCE = 0.03; // 3% chance to place a sink
const INITIAL_CREDITS = 100; // Initial credits

const GameBoard: React.FC = () => {
  const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ piece: null, powered: false, on: true, remainingPower: CAPACITOR_DURATION }));
  const [grid, setGrid] = useState(initialGrid);
  const [selectedPiece, setSelectedPiece] = useState<'source' | 'conduit' | 'sink' | 'switch' | 'capacitor' | 'forest' | 'lake' | 'remove' | null>(null);
  const [score, setScore] = useState(INITIAL_CREDITS);
  const [tornadoes, setTornadoes] = useState([{ row: 0, col: 0, direction: { row: 1, col: 1 } }]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveTornadoes();
      updatePowerStatus();
      updateScore();
    }, INTERVAL_DURATION);
    return () => clearInterval(interval);
  }, [grid, tornadoes]);


  const bfs = (startRow: number, startCol: number, newGrid: any[][]) => {
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    const queue = [[startRow, startCol]];
    newGrid[startRow][startCol].powered = true;

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
          const neighbor = newGrid[newRow][newCol];
          if (!neighbor.powered && (neighbor.piece === 'conduit' || neighbor.piece === 'sink' || (neighbor.piece === 'switch' && neighbor.on) || (neighbor.piece === 'capacitor' && neighbor.remainingPower > 0))) {
            neighbor.powered = true;
            queue.push([newRow, newCol]);
          }
        }
      }
    }
  };

  const updatePowerStatus = () => {
    const newGrid = grid.map(row => row.map(tile => ({ ...tile, powered: false })));

    // Start BFS from each source
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].piece === 'source' && newGrid[row][col].on) {
          bfs(row, col, newGrid);
        }
      }
    }

    // Update capacitors' remaining power and propagate power from capacitors
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].piece === 'capacitor') {
          if (newGrid[row][col].powered) {
            newGrid[row][col].remainingPower = CAPACITOR_DURATION;
          } else if (newGrid[row][col].remainingPower > 0) {
            newGrid[row][col].remainingPower -= 1;
            if (newGrid[row][col].remainingPower > 0) {
              bfs(row, col, newGrid);
            }
          }
        }
      }
    }

    // Check if capacitors are adjacent to powered tiles and reset their power if they are
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].piece === 'capacitor' && !newGrid[row][col].powered) {
          const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
          ];
          for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
              if (newGrid[newRow][newCol].powered) {
                newGrid[row][col].powered = true;
                newGrid[row][col].remainingPower = CAPACITOR_DURATION;
                bfs(row, col, newGrid);
                break;
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);
  };

  const updateScore = () => {
    let additionalScore = 0;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col].piece === 'sink' && grid[row][col].powered) {
          additionalScore += SINK_REWARD;
        }
      }
    }
    setScore(prevScore => prevScore + additionalScore);
  };

  const handleTileClick = (row: number, col: number) => {
    const newGrid = [...grid];
    const tile = newGrid[row][col];

    if (selectedPiece === 'remove') {
      newGrid[row][col] = { piece: null, powered: false, on: true, remainingPower: CAPACITOR_DURATION };
    } else if (tile.piece === 'source' || tile.piece === 'switch' || tile.piece === 'capacitor') {
      tile.on = !tile.on;
      if (tile.piece === 'capacitor' && tile.on) {
        tile.remainingPower = CAPACITOR_DURATION;
      }
    } else if (selectedPiece) {
      newGrid[row][col] = { piece: selectedPiece, powered: false, on: true, remainingPower: CAPACITOR_DURATION };
      if (selectedPiece === 'conduit') {
        setScore(prevScore => prevScore - CONDUIT_COST);
      } else if (selectedPiece === 'source') {
        setScore(prevScore => prevScore - SOURCE_COST);
      }
    }

    setGrid(newGrid);
  };

  const moveTornadoes = () => {
    const newGrid = [...grid];
    const newTornadoes = tornadoes.map(tornado => {
      const newRow = tornado.row + tornado.direction.row;
      const newCol = tornado.col + tornado.direction.col;

      if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
        if (newGrid[newRow][newCol].piece === 'conduit') {
          newGrid[newRow][newCol] = { piece: null, powered: false, on: true, remainingPower: 0 };
        }
        return { ...tornado, row: newRow, col: newCol };
      } else {
        return { ...tornado, direction: { row: -tornado.direction.row, col: -tornado.direction.col } };
      }
    });

    setGrid(newGrid);
    setTornadoes(newTornadoes);
  };

  const clearGrid = () => {
    setGrid(initialGrid);
  };

  const resetGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ piece: null, powered: false, on: true, remainingPower: CAPACITOR_DURATION }));
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const randomValue = Math.random();
        if (randomValue < TREE_CHANCE) { // 10% chance to place a tree
          newGrid[row][col] = { piece: 'forest', powered: false, on: true, remainingPower: CAPACITOR_DURATION };
        } else if (randomValue < TREE_CHANCE + LAKE_CHANCE) { // 5% chance to place a lake
          newGrid[row][col] = { piece: 'lake', powered: false, on: true, remainingPower: CAPACITOR_DURATION };
        } else if (randomValue < TREE_CHANCE + LAKE_CHANCE + SINK_CHANCE) { // 3% chance to place a sink
          newGrid[row][col] = { piece: 'sink', powered: false, on: true, remainingPower: CAPACITOR_DURATION };
        }
      }
    }
    setGrid(newGrid);
    setScore(INITIAL_CREDITS); // Reset score to INITIAL_CREDITS
  };

  const addTornado = () => {
    setTornadoes([...tornadoes, { row: 0, col: 0, direction: { row: 1, col: 1 } }]);
  };

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      <div className="controls">
        <button onClick={() => setSelectedPiece('source')}>Source</button>
        <button onClick={() => setSelectedPiece('conduit')}>Conduit</button>
        <button onClick={() => setSelectedPiece('sink')}>Sink</button>
        <button onClick={() => setSelectedPiece('switch')}>Switch</button>
        <button onClick={() => setSelectedPiece('capacitor')}>Capacitor</button>
        <button onClick={() => setSelectedPiece('forest')}>Tree</button>
        <button onClick={() => setSelectedPiece('lake')}>Lake</button>
        <button onClick={() => setSelectedPiece('remove')}>Remove</button>
        <button onClick={clearGrid}>Clear</button>
        <button onClick={resetGrid}>Reset</button>
        <button onClick={addTornado}>Tornado</button>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              piece={tornadoes.some(t => t.row === rowIndex && t.col === colIndex) ? 'tornado' : tile.piece}
              powered={tile.powered}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;