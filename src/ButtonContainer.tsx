// ButtonContainer.tsx
import React from 'react';
import { GameBoardAction } from './gameBoardReducer';

interface ButtonContainerProps {
  selectedPiece: string | null;
  devMode: boolean;
  dispatch: React.Dispatch<GameBoardAction>;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ selectedPiece, devMode, dispatch }) => {
  return (
    <div className="button-container">
      <button className={selectedPiece === 'source' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'source' })}>Power Plant</button>
      <button className={selectedPiece === 'conduit' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'conduit' })}>Power Line</button>
      {devMode && (
        <>
          <button className={selectedPiece === 'sink' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'sink' })}>City</button>
          <button className={selectedPiece === 'switch' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'switch' })}>Switch</button>
          <button className={selectedPiece === 'capacitor' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'capacitor' })}>Capacitor</button>
          <button className={selectedPiece === 'forest' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'forest' })}>Tree</button>
          <button className={selectedPiece === 'lake' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'lake' })}>Lake</button>
          <button className={selectedPiece === 'remove' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'remove' })}>Remove</button>
          <button className={selectedPiece === 'toggle' ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_SELECTED_PIECE', piece: 'toggle' })}>Toggle</button>
          <button onClick={() => dispatch({ type: 'ADD_TORNADO' })}>Add Tornado</button>
          <button onClick={() => dispatch({ type: 'CLEAR_GRID' })}>Clear</button>
          <button onClick={() => dispatch({ type: 'RESET_GRID' })}>Reset</button>
        </>
      )}
      <button onClick={() => dispatch({ type: 'SET_DEV_MODE', devMode: !devMode })}>Dev Mode</button>
    </div>
  );
};

export default ButtonContainer;