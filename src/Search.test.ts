// bfs.test.ts
import { describe, it, expect } from 'vitest';
import { bfs } from './Search';

describe('bfs', () => {
  it('should power a simple source-sink network', () => {
    const grid = Array(5).fill(null).map(() => Array(5).fill({ piece: null, powered: false, on: true, remainingPower: 10, wasPowered: false }));
    grid[2][2] = { piece: 'source', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][3] = { piece: 'conduit', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][4] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };

    bfs(2, 2, grid, 50);

    expect(grid[2][2].powered).toBe(true);
    expect(grid[2][3].powered).toBe(true);
    expect(grid[2][4].powered).toBe(true);
  });

  it('should not power sinks if the source capacity is insufficient', () => {
    const grid = Array(5).fill(null).map(() => Array(5).fill({ piece: null, powered: false, on: true, remainingPower: 10, wasPowered: false }));
    grid[2][2] = { piece: 'source', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][3] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][4] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][5] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][6] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][7] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };

    bfs(2, 2, grid, 10);

    expect(grid[2][2].powered).toBe(true);
    expect(grid[2][3].powered).toBe(true);
    expect(grid[2][4].powered).toBe(true);
    expect(grid[2][5].powered).toBe(true);
    expect(grid[2][6].powered).toBe(true);
    expect(grid[2][7].powered).toBe(false);
  });

  it('should power multiple sinks if the source capacity is sufficient', () => {
    const grid = Array(5).fill(null).map(() => Array(5).fill({ piece: null, powered: false, on: true, remainingPower: 10, wasPowered: false }));
    grid[2][2] = { piece: 'source', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][3] = { piece: 'conduit', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[2][4] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };
    grid[3][4] = { piece: 'sink', powered: false, on: true, remainingPower: 10, wasPowered: false };

    bfs(2, 2, grid, 30);

    expect(grid[2][2].powered).toBe(true);
    expect(grid[2][3].powered).toBe(true);
    expect(grid[2][4].powered).toBe(true);
    expect(grid[3][4].powered).toBe(true);
  });
});