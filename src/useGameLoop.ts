// useGameLoop.ts
import { useEffect } from 'react';
import { GameBoardAction, GameBoardState } from './gameBoardReducer';

export const useGameLoop = (state: GameBoardState, dispatch: React.Dispatch<GameBoardAction>) => {
  useEffect(() => {
    if (state.gameState === 'playing') {
      const interval = setInterval(() => {
        dispatch({ type: 'MOVE_TORNADOES' });
        dispatch({ type: 'UPDATE_POWER_STATUS' });
        dispatch({ type: 'UPDATE_SCORE' });
        dispatch({ type: 'CHECK_GAME_OVER' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.gameState, dispatch]);
};