import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import Modal from './Modal';
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
const SINK_REWARD = 1; // Reward for each powered sink
const SINK_POWER_REQUIREMENT = 10; // Power requirement for each sink
const SOURCE_POWER_CAPACITY = 50; // Power capacity for each source

const DIRECTIONS = [
  { row: -1, col: 0 },  // North
  { row: -1, col: 1 },  // North-East
  { row: 0, col: 1 },   // East
  { row: 1, col: 1 },   // South-East
  { row: 1, col: 0 },   // South
  { row: 1, col: -1 },  // South-West
  { row: 0, col: -1 },  // West
  { row: -1, col: -1 }  // North-West
];

const GameBoard: React.FC = () => {
  const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ piece: null, powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: false }));
  const [grid, setGrid] = useState(initialGrid);
  const [selectedPiece, setSelectedPiece] = useState<'source' | 'conduit' | 'sink' | 'switch' | 'capacitor' | 'forest' | 'lake' | 'remove' | 'toggle' | 'tornado' | null>(null);
  const [score, setScore] = useState(INITIAL_CREDITS);
  const [outages, setOutages] = useState(0);
  const [tornadoes, setTornadoes] = useState<{ row: number, col: number, direction: { row: number, col: number } }[]>([]);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        moveTornadoes();
        updatePowerStatus();
        updateScore();
        checkGameOver();
      }, INTERVAL_DURATION);
      return () => clearInterval(interval);
    }
  }, [grid, tornadoes, gameState]);

  useEffect(() => {
    resetGrid();
  }, []);

  const bfs = (startRow: number, startCol: number, newGrid: any[][], powerCapacity: number) => {
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    const queue = [[startRow, startCol]];
    newGrid[startRow][startCol].powered = true;
    newGrid[startRow][startCol].powerLevel = powerCapacity;

    while (queue.length > 0 && powerCapacity > 0) {
      const [row, col] = queue.shift()!;
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
          const neighbor = newGrid[newRow][newCol];
          if (!neighbor.powered && (neighbor.piece === 'conduit' || neighbor.piece === 'sink' || (neighbor.piece === 'switch' && neighbor.on) || (neighbor.piece === 'capacitor' && neighbor.remainingPower > 0))) {
            if (neighbor.piece === 'sink') {
              if (powerCapacity >= SINK_POWER_REQUIREMENT) {
                neighbor.powered = true;
                neighbor.powerLevel = powerCapacity;
                powerCapacity -= SINK_POWER_REQUIREMENT;
              }
            } else {
              neighbor.powered = true;
              neighbor.powerLevel = powerCapacity;
            }
            queue.push([newRow, newCol]);
          }
        }
      }
    }
  };

  const updatePowerStatus = () => {
    const newGrid = grid.map(row => row.map(tile => ({ ...tile, powered: false, powerLevel: 0 })));

    // Start BFS from each source
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].piece === 'source' && newGrid[row][col].on) {
          bfs(row, col, newGrid, SOURCE_POWER_CAPACITY);
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
              bfs(row, col, newGrid, SOURCE_POWER_CAPACITY);
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
                bfs(row, col, newGrid, SOURCE_POWER_CAPACITY);
                break;
              }
            }
          }
        }
      }
    }

    // Update outage count for sinks that were powered but are no longer powered
    let newOutages = 0;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tile = newGrid[row][col];
        if (tile.piece === 'sink') {
          if (tile.powered) {
            tile.wasPowered = true;
          } else if (tile.wasPowered) {
            newOutages += 1;
          }
        }
      }
    }

    setGrid(newGrid);
    setOutages(prevOutages => prevOutages + newOutages);

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
    if (gameState !== 'playing') return;

    const newGrid = [...grid];
    const tile = newGrid[row][col];

    // Prevent placing a source or conduit on an occupied tile
    if ((selectedPiece === 'source' || selectedPiece === 'conduit') && tile.piece) {
      return;
    }

    if (selectedPiece === 'remove') {
      newGrid[row][col] = { piece: null, powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: tile.wasPowered };
    } else if (selectedPiece === 'toggle') {
      if (tile.piece === 'source' || tile.piece === 'switch') {
        tile.on = !tile.on;
      }
    } else if (selectedPiece === 'tornado') {
      const tornadoIndex = tornadoes.findIndex(t => t.row === row && t.col === col);
      if (tornadoIndex !== -1) {
        const newTornadoes = [...tornadoes];
        newTornadoes.splice(tornadoIndex, 1);
        setTornadoes(newTornadoes);
      }
    } else if (tile.piece === 'source' || tile.piece === 'switch' || tile.piece === 'capacitor') {
      tile.on = !tile.on;
      if (tile.piece === 'capacitor' && tile.on) {
        tile.remainingPower = CAPACITOR_DURATION;
      }
    } else if (selectedPiece) {
      newGrid[row][col] = { piece: selectedPiece, powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: tile.wasPowered };
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
          newGrid[newRow][newCol] = { piece: null, powered: false, on: true, remainingPower: 0, wasPowered: newGrid[newRow][newCol].wasPowered };
        }
        return { ...tornado, row: newRow, col: newCol };
      } else {
        return { ...tornado, direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] };
      }
    });

    setGrid(newGrid);
    setTornadoes(newTornadoes);
  };

  const clearGrid = () => {
    setGrid(initialGrid);
  };

  const resetGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ piece: null, powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: false }));
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const randomValue = Math.random();
        if (randomValue < TREE_CHANCE) { // 10% chance to place a tree
          newGrid[row][col] = { piece: 'forest', powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: false };
        } else if (randomValue < TREE_CHANCE + LAKE_CHANCE) { // 5% chance to place a lake
          newGrid[row][col] = { piece: 'lake', powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: false };
        } else if (randomValue < TREE_CHANCE + LAKE_CHANCE + SINK_CHANCE) { // 3% chance to place a sink
          newGrid[row][col] = { piece: 'sink', powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: false };
        }
      }
    }
    setGrid(newGrid);
    setScore(INITIAL_CREDITS); // Reset score to INITIAL_CREDITS
    setOutages(0); // Reset outages to 0
    setTornadoes([]); // Remove all tornadoes
    setGameState('start'); // Set game state to 'start' to show the start modal
  };

  const addTornado = () => {
    const randomRow = Math.floor(Math.random() * GRID_SIZE);
    const randomCol = Math.floor(Math.random() * GRID_SIZE);
    const randomDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    setTornadoes(prevTornadoes => [...prevTornadoes, { row: randomRow, col: randomCol, direction: randomDirection }]);
  };

  const checkGameOver = () => {
    if (outages > 100 || score < -2000) {
      setGameState('gameOver');
    }
  };

  const startGame = () => {
    setGameState('playing');
  };

  const closeModal = () => {
    if (gameState === 'start') {
      startGame();
    } else if (gameState === 'gameOver') {
      setGameState('start');
      resetGrid();
    }
  };

  return (
    <div className="game-container">
      {gameState !== 'playing' && (
        <Modal
          title={gameState === 'start' ? 'Welcome to the ⚡ The Electric Co. ⚡' : 'Game Over'}
          message={gameState === 'start' ? 'Instructions: Place pieces to manage the energy flow. Avoid outages and negative scores.' : 'You lost! You had over 100 outages or a score below -2000.'}
          onClose={closeModal}
        />
      )}
      <div className="controls">
        <h1 className="game-title">⚡ The Electric Co. ⚡</h1>
        <div className="score-outages">
          <div className="score">Score: {Math.floor(score)}</div>
          <div className="outages">Outages: {outages}</div>
        </div>
        <div className="button-container">
          <button className={selectedPiece === 'source' ? 'selected' : ''} onClick={() => setSelectedPiece('source')}>Power Plant</button>
          <button className={selectedPiece === 'conduit' ? 'selected' : ''} onClick={() => setSelectedPiece('conduit')}>Power Line</button>
          {devMode && (
            <>
              <button className={selectedPiece === 'sink' ? 'selected' : ''} onClick={() => setSelectedPiece('sink')}>City</button>
              <button className={selectedPiece === 'switch' ? 'selected' : ''} onClick={() => setSelectedPiece('switch')}>Switch</button>
              <button className={selectedPiece === 'capacitor' ? 'selected' : ''} onClick={() => setSelectedPiece('capacitor')}>Capacitor</button>
              <button className={selectedPiece === 'forest' ? 'selected' : ''} onClick={() => setSelectedPiece('forest')}>Tree</button>
              <button className={selectedPiece === 'lake' ? 'selected' : ''} onClick={() => setSelectedPiece('lake')}>Lake</button>
              <button className={selectedPiece === 'remove' ? 'selected' : ''} onClick={() => setSelectedPiece('remove')}>Remove</button>
              <button className={selectedPiece === 'toggle' ? 'selected' : ''} onClick={() => setSelectedPiece('toggle')}>Toggle</button>
              <button onClick={addTornado}>Add Tornado</button>
              <button onClick={clearGrid}>Clear</button>
              <button onClick={resetGrid}>Reset</button>
            </>
          )}
          <button onClick={() => setDevMode(!devMode)}>Dev Mode</button>
        </div>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              piece={tornadoes.some(t => t.row === rowIndex && t.col === colIndex) ? 'tornado' : tile.piece}
              powered={tile.powered}
              powerLevel={tile.powerLevel}
              wasPowered={tile.wasPowered}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;