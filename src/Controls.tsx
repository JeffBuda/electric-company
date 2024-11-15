// Controls.tsx
import React from 'react';
import ButtonContainer from './ButtonContainer';
import { GameBoardAction } from './gameBoardReducer';

interface ControlsProps {
  score: number;
  outages: number;
  selectedPiece: string | null;
  devMode: boolean;
  dispatch: React.Dispatch<GameBoardAction>;
}

const Controls: React.FC<ControlsProps> = ({ score, outages, selectedPiece, devMode, dispatch }) => {
  return (
    <div className="controls">
      <div className="score-outages">
        <div className="score">Score: {Math.floor(score)}</div>
        <div className="outages">Outages: {outages}</div>
      </div>
      <ButtonContainer selectedPiece={selectedPiece} devMode={devMode} dispatch={dispatch} />
    </div>
  );
};

export default Controls;