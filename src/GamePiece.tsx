// GamePiece.tsx
import React from 'react';

type GamePieceProps = {
  type: 'source' | 'conduit' | 'sink' | 'switch' | 'capacitor';
  powered: boolean;
  on?: boolean; // Optional prop for source, switch, and capacitor state
};

const GamePiece: React.FC<GamePieceProps> = ({ type, powered, on }) => {
  const getClassName = () => {
    let className = `game-piece ${type}`;
    if (powered) {
      className += ' powered';
    }
    if ((type === 'source' || type === 'switch' || type === 'capacitor') && on === false) {
      className += ' off';
    }
    return className;
  };

  return <div className={getClassName()} />;
};

export default GamePiece;