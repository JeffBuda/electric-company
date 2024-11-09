import React from 'react';
import GamePiece from './GamePiece';

type TileProps = {
  piece: 'source' | 'conduit' | 'sink' | null;
  powered: boolean;
  onClick: () => void;
};

const Tile: React.FC<TileProps> = ({ piece, powered, onClick }) => {
  return (
    <div className="tile" onClick={onClick}>
      {piece && <GamePiece type={piece} powered={powered} />}
    </div>
  );
};

export default Tile;