import React from 'react';
import GamePiece from './GamePiece';
import TreeIcon from './TreeIcon'; // Import the TreeIcon component

type TileProps = {
  piece: 'source' | 'conduit' | 'sink' | 'switch' | 'capacitor' | 'forest' | null;
  powered: boolean;
  onClick: () => void;
};

const Tile: React.FC<TileProps> = ({ piece, powered, onClick }) => {
  return (
    <div className="tile" onClick={onClick}>
      {piece === 'forest' ? (
        <TreeIcon />
      ) : (
        piece && <GamePiece type={piece} powered={powered} />
      )}
    </div>
  );
};

export default Tile;