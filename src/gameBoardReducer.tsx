// gameBoardReducer.ts
import { bfs } from './Search'; // Import the bfs function

export type GameState = 'start' | 'playing' | 'gameOver';

export interface Tile {
  piece: string | null;
  powered: boolean;
  on: boolean;
  remainingPower: number;
  wasPowered: boolean;
  powerLevel?: number;
}

export interface GameBoardState {
  grid: Tile[][];
  selectedPiece: string | null;
  score: number;
  outages: number;
  tornadoes: { row: number; col: number; direction: { row: number; col: number } }[];
  gameState: GameState;
  devMode: boolean;
}

export type GameBoardAction =
  | { type: 'SET_SELECTED_PIECE'; piece: string | null }
  | { type: 'SET_GAME_STATE'; gameState: GameState }
  | { type: 'SET_SCORE'; score: number }
  | { type: 'SET_OUTAGES'; outages: number }
  | { type: 'SET_TORNADOES'; tornadoes: { row: number; col: number; direction: { row: number; col: number } }[] }
  | { type: 'SET_DEV_MODE'; devMode: boolean }
  | { type: 'UPDATE_GRID'; grid: Tile[][] }
  | { type: 'RESET_GRID' }
  | { type: 'CLEAR_GRID' }
  | { type: 'ADD_TORNADO' }
  | { type: 'MOVE_TORNADOES' }
  | { type: 'UPDATE_POWER_STATUS' }
  | { type: 'UPDATE_SCORE' }
  | { type: 'CHECK_GAME_OVER' }
  | { type: 'HANDLE_TILE_CLICK'; row: number; col: number }
  | { type: 'START_GAME' };

const GRID_SIZE = 50;
const CAPACITOR_DURATION = 10;
const INITIAL_CREDITS = 100;
const SINK_REWARD = 1;
const CONDUIT_COST = 10;
const SOURCE_COST = 1000;
const SOURCE_POWER_CAPACITY = 50;

const TREE_CHANCE = 0.10; // 10% chance to place a tree
const LAKE_CHANCE = 0.05; // 5% chance to place a lake
const SINK_CHANCE = 0.03; // 3% chance to place a sink

const DIRECTIONS = [
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
  { row: -1, col: -1 },
];

const createInitialGrid = (): Tile[][] => {
  const newGrid = Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE).fill({
        piece: null,
        powered: false,
        on: true,
        remainingPower: CAPACITOR_DURATION,
        wasPowered: false,
      })
    );

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const randomValue = Math.random();
      if (randomValue < TREE_CHANCE) {
        newGrid[row][col] = {
          piece: 'forest',
          powered: false,
          on: true,
          remainingPower: CAPACITOR_DURATION,
          wasPowered: false,
        };
      } else if (randomValue < TREE_CHANCE + LAKE_CHANCE) {
        newGrid[row][col] = {
          piece: 'lake',
          powered: false,
          on: true,
          remainingPower: CAPACITOR_DURATION,
          wasPowered: false,
        };
      } else if (randomValue < TREE_CHANCE + LAKE_CHANCE + SINK_CHANCE) {
        newGrid[row][col] = {
          piece: 'sink',
          powered: false,
          on: true,
          remainingPower: CAPACITOR_DURATION,
          wasPowered: false,
        };
      }
    }
  }

  return newGrid;
};

export const initialState: GameBoardState = {
  grid: createInitialGrid(),
  selectedPiece: null,
  score: INITIAL_CREDITS,
  outages: 0,
  tornadoes: [],
  gameState: 'start',
  devMode: false,
};

export const gameBoardReducer = (state: GameBoardState, action: GameBoardAction): GameBoardState => {
  switch (action.type) {
    case 'SET_SELECTED_PIECE':
      return { ...state, selectedPiece: action.piece };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.gameState };
    case 'SET_SCORE':
      return { ...state, score: action.score };
    case 'SET_OUTAGES':
      return { ...state, outages: action.outages };
    case 'SET_TORNADOES':
      return { ...state, tornadoes: action.tornadoes };
    case 'SET_DEV_MODE':
      return { ...state, devMode: action.devMode };
    case 'UPDATE_GRID':
      return { ...state, grid: action.grid };
    case 'RESET_GRID':
      const resetGrid = createInitialGrid();
      return { ...state, grid: resetGrid, score: INITIAL_CREDITS, outages: 0, tornadoes: [], gameState: 'start' };
    case 'CLEAR_GRID':
      const clearedGrid = Array(GRID_SIZE).fill(null).map(() =>
        Array(GRID_SIZE).fill({
          piece: null,
          powered: false,
          on: true,
          remainingPower: CAPACITOR_DURATION,
          wasPowered: false,
        })
      );
      return { ...state, grid: clearedGrid };
    case 'ADD_TORNADO':
      const randomRow = Math.floor(Math.random() * GRID_SIZE);
      const randomCol = Math.floor(Math.random() * GRID_SIZE);
      const randomDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      return { ...state, tornadoes: [...state.tornadoes, { row: randomRow, col: randomCol, direction: randomDirection }] };
    case 'MOVE_TORNADOES':
      const newGrid = [...state.grid];
      const newTornadoes = state.tornadoes.map(tornado => {
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

      return { ...state, grid: newGrid, tornadoes: newTornadoes };
    case 'UPDATE_POWER_STATUS':
      const updatedGrid = state.grid.map(row => row.map(tile => ({ ...tile, powered: false, powerLevel: 0 })));

      // Start BFS from each source
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (updatedGrid[row][col].piece === 'source' && updatedGrid[row][col].on) {
            bfs(row, col, updatedGrid, SOURCE_POWER_CAPACITY);
          }
        }
      }

      // Update capacitors' remaining power and propagate power from capacitors
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (updatedGrid[row][col].piece === 'capacitor') {
            if (updatedGrid[row][col].powered) {
              updatedGrid[row][col].remainingPower = CAPACITOR_DURATION;
            } else if (updatedGrid[row][col].remainingPower > 0) {
              updatedGrid[row][col].remainingPower -= 1;
              if (updatedGrid[row][col].remainingPower > 0) {
                bfs(row, col, updatedGrid, SOURCE_POWER_CAPACITY);
              }
            }
          }
        }
      }

      // Check if capacitors are adjacent to powered tiles and reset their power if they are
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (updatedGrid[row][col].piece === 'capacitor' && !updatedGrid[row][col].powered) {
            const directions = [
              [0, 1], [1, 0], [0, -1], [-1, 0]
            ];
            for (const [dx, dy] of directions) {
              const newRow = row + dx;
              const newCol = col + dy;
              if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                if (updatedGrid[newRow][newCol].powered) {
                  updatedGrid[row][col].powered = true;
                  updatedGrid[row][col].remainingPower = CAPACITOR_DURATION;
                  bfs(row, col, updatedGrid, SOURCE_POWER_CAPACITY);
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
          const tile = updatedGrid[row][col];
          if (tile.piece === 'sink') {
            if (tile.powered) {
              tile.wasPowered = true;
            } else if (tile.wasPowered) {
              newOutages += 1;
            }
          }
        }
      }

      return { ...state, grid: updatedGrid, outages: state.outages + newOutages };
    case 'UPDATE_SCORE':
      let additionalScore = 0;
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (state.grid[row][col].piece === 'sink' && state.grid[row][col].powered) {
            additionalScore += SINK_REWARD;
          }
        }
      }
      return { ...state, score: state.score + additionalScore };
    case 'CHECK_GAME_OVER':
      // Implement check game over logic
      return state;
    case 'HANDLE_TILE_CLICK':
      if (state.gameState !== 'playing') return state;

      const newGridClick = [...state.grid];
      const tile = newGridClick[action.row][action.col];

      // Prevent placing a source or conduit on an occupied tile
      if ((state.selectedPiece === 'source' || state.selectedPiece === 'conduit') && tile.piece) {
        return state;
      }

      if (state.selectedPiece === 'remove') {
        newGridClick[action.row][action.col] = { piece: null, powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: tile.wasPowered };
      } else if (state.selectedPiece === 'toggle') {
        if (tile.piece === 'source' || tile.piece === 'switch') {
          tile.on = !tile.on;
        }
      } else if (state.selectedPiece === 'tornado') {
        const tornadoIndex = state.tornadoes.findIndex(t => t.row === action.row && t.col === action.col);
        if (tornadoIndex !== -1) {
          const newTornadoes = [...state.tornadoes];
          newTornadoes.splice(tornadoIndex, 1);
          return { ...state, tornadoes: newTornadoes };
        }
      } else if (tile.piece === 'source' || tile.piece === 'switch' || tile.piece === 'capacitor') {
        tile.on = !tile.on;
        if (tile.piece === 'capacitor' && tile.on) {
          tile.remainingPower = CAPACITOR_DURATION;
        }
      } else if (state.selectedPiece) {
        newGridClick[action.row][action.col] = { piece: state.selectedPiece, powered: false, on: true, remainingPower: CAPACITOR_DURATION, wasPowered: tile.wasPowered };
        if (state.selectedPiece === 'conduit') {
          return { ...state, grid: newGridClick, score: state.score - CONDUIT_COST };
        } else if (state.selectedPiece === 'source') {
          return { ...state, grid: newGridClick, score: state.score - SOURCE_COST };
        }
      }

      return { ...state, grid: newGridClick };
    case 'START_GAME':
      return { ...state, gameState: 'playing' };
    default:
      return state;
  }
};