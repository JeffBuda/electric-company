// bfs.ts
const GRID_SIZE = 50;
const SINK_POWER_REQUIREMENT = 10;

export const bfs = (startRow: number, startCol: number, newGrid: any[][], powerCapacity: number) => {
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  const queue = [[startRow, startCol]];
  newGrid[startRow][startCol].powered = true;
  newGrid[startRow][startCol].powerLevel = powerCapacity;

  while (queue.length > 0 && powerCapacity > 0) {
    const [row, col] = queue.shift()!;
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
        const neighbor = newGrid[newRow][newCol];
        if (!neighbor.powered && (neighbor.piece === 'conduit' || neighbor.piece === 'sink' || (neighbor.piece === 'switch' && neighbor.on) || (neighbor.piece === 'capacitor' && neighbor.remainingPower > 0))) {
          if (neighbor.piece === 'sink') {
            if (powerCapacity >= SINK_POWER_REQUIREMENT) {
              neighbor.powered = true;
              neighbor.powerLevel = powerCapacity;
              powerCapacity -= SINK_POWER_REQUIREMENT;
            }
          } else {
            neighbor.powered = true;
            neighbor.powerLevel = powerCapacity;
          }
          queue.push([newRow, newCol]);
        }
      }
    }
  }
};