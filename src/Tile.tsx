import React from 'react';
import GamePiece from './GamePiece';
import TreeIcon from './TreeIcon'; // Import the TreeIcon component
import LakeIcon from './LakeIcon'; // Import the LakeIcon component
import SourceIcon from './SourceIcon'; // Import the SourceIcon component

type TileProps = {
  piece: 'source' | 'conduit' | 'sink' | 'switch' | 'capacitor' | 'forest' | 'lake' | null;
  powered: boolean;
  onClick: () => void;
};

const Tile: React.FC<TileProps> = ({ piece, powered, onClick }) => {
  return (
    <div className="tile" onClick={onClick}>
      {piece === 'forest' ? (
        <TreeIcon />
      ) : piece === 'lake' ? (
        <LakeIcon />
      ) : piece === 'source' ? (
        <SourceIcon />
      ) : (
        piece && <GamePiece type={piece} powered={powered} />
      )}
    </div>
  );
};

export default Tile;