// GameBoardV2.tsx
import React, { useReducer } from 'react';
import Modal from './Modal';
import Controls from './Controls';
import Map from './Map';
import { gameBoardReducer, initialState } from './gameBoardReducer';
import { useGameLoop } from './useGameLoop';
import './App.css';

const GameBoardV2: React.FC = () => {
  const [state, dispatch] = useReducer(gameBoardReducer, initialState);

  useGameLoop(state, dispatch);

  const handleTileClick = (row: number, col: number) => {
    dispatch({ type: 'HANDLE_TILE_CLICK', row, col });
  };

  const closeModal = () => {
    if (state.gameState === 'start') {
      dispatch({ type: 'START_GAME' });
    } else if (state.gameState === 'gameOver') {
      dispatch({ type: 'RESET_GRID' });
    }
  };

  return (
    <>
        {state.gameState !== 'playing' && (
          <Modal
            title={state.gameState === 'start' ? 'Welcome to the ⚡ The Electric Co. ⚡' : 'Game Over'}
            message={state.gameState === 'start' ? 'Instructions: Place pieces to manage the energy flow. Avoid outages and negative scores.' : 'You lost! You had over 100 outages or a score below -2000.'}
            onClose={closeModal}
          />
        )}
        <Map grid={state.grid} handleTileClick={handleTileClick} />
      <Controls
        score={state.score}
        outages={state.outages}
        selectedPiece={state.selectedPiece}
        devMode={state.devMode}
        dispatch={dispatch}
      />
    </>  
  );
};

export default GameBoardV2;