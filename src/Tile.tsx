import React from 'react';
import GamePiece from './GamePiece';
import TreeIcon from './TreeIcon'; // Import the TreeIcon component
import LakeIcon from './LakeIcon'; // Import the LakeIcon component
import SourceIcon from './SourceIcon'; // Import the SourceIcon component
import ConduitIcon from './ConduitIcon'; // Import the ConduitIcon component
import SinkIcon from './SinkIcon'; // Import the SinkIcon component
import TornadoIcon from './TornadoIcon'; // Import the TornadoIcon component
import './Tile.css';

type TileProps = {
  piece: string | null;
  powered: boolean;
  powerLevel: number;
  wasPowered: boolean;
  onClick: () => void;
};

const Tile: React.FC<TileProps> = ({ piece, powered, powerLevel, wasPowered, onClick }) => {
  let className = 'tile';
  if (powered) {
    className += ' powered';
  } else if (wasPowered && piece === 'sink') {
    className += ' unpowered';
  }

  // Calculate the border color based on the power level
  const borderColor = powered ? `rgba(255, 255, 0, ${powerLevel / 100})` : 'transparent';

  return (
    <div className={className} onClick={onClick} style={{ borderColor }}>
      {/* Render the piece */}
      {piece === 'forest' && <TreeIcon />}
      {piece === 'lake' && <LakeIcon />}
      {piece === 'source' && <SourceIcon />}
      {piece === 'conduit' && <ConduitIcon />}
      {piece === 'sink' && <SinkIcon />}
      {piece === 'tornado' && <TornadoIcon />}
    </div>
  );
};

export default Tile;