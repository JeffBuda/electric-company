import React from 'react';
import GamePiece from './GamePiece';
import TreeIcon from './TreeIcon'; // Import the TreeIcon component
import LakeIcon from './LakeIcon'; // Import the LakeIcon component
import SourceIcon from './SourceIcon'; // Import the SourceIcon component
import ConduitIcon from './ConduitIcon'; // Import the ConduitIcon component
import SinkIcon from './SinkIcon'; // Import the SinkIcon component

type TileProps = {
  piece: 'source' | 'conduit' | 'sink' | 'switch' | 'capacitor' | 'forest' | 'lake' | null;
  powered: boolean;
  onClick: () => void;
};

const Tile: React.FC<TileProps> = ({ piece, powered, onClick }) => {
  return (
    <div className={`tile ${powered ? 'powered' : ''}`} onClick={onClick}>
      {piece === 'forest' ? (
        <TreeIcon />
      ) : piece === 'lake' ? (
        <LakeIcon />
      ) : piece === 'source' ? (
        <SourceIcon />
      ) : piece === 'conduit' ? (
        <ConduitIcon />
      ) : piece === 'sink' ? (
        <SinkIcon />
      ) : (
        piece && <GamePiece type={piece} powered={powered} />
      )}
    </div>
  );
};

export default Tile;