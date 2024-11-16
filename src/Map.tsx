// Map.tsx
import React from 'react';
import Tile from './Tile';
import { Tile as TileType } from './gameBoardReducer';

interface MapProps {
  grid: TileType[][];
  tornadoes: { row: number; col: number }[];
  handleTileClick: (row: number, col: number) => void;
}

const Map: React.FC<MapProps> = ({ grid, tornadoes, handleTileClick }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            piece={tornadoes.some(t => t.row === rowIndex && t.col === colIndex) ? 'tornado' : tile.piece}
            powered={tile.powered}
            powerLevel={tile.powerLevel ?? 0}
            wasPowered={tile.wasPowered}
            onClick={() => handleTileClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Map;