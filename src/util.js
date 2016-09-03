export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const lerp = (a, b, t) => a + (t * (b - a));

export const noop = (a) => a;

export const now = () => new Date().getTime();

export const rand = (from, to = 0) => from + (Math.random() * (to - from));

export const throttle = (f, t) => {
  let lastCall = 0;
  return (...args) => {
    const currentCall = now();
    if (currentCall - lastCall < t) {
      return args[0];
    }
    lastCall = currentCall;
    return f(...args);
  };
};

export const times = (n, f) => {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(f(i));
  }
  return results;
};


export const tileW = 128;
export const tileH = 64;

export const screenToIso = ({ x, y }) => ({
  x: (y / tileH) + (x / (2 * tileW)),
  y: (y / tileH) - (x / (2 * tileW)),
});

export const isoToScreen = ({ x, y }) => ({
  x: (x - y) * (tileW / 2),
  y: (x + y) * (tileH / 2),
});

export const generateAccessbilityGrid = ({ terrain, entities }) => {
  const grid = times(terrain.length, () => times(terrain.length, () => 0));
  terrain
    .forEach((row, y) => {
      row.forEach((cell, x) => {
        grid[x][y] = cell.accessible;
      });
    });

  if (entities) {
    entities.forEach((entity) => {
      grid[entity.y][entity.x] = 0;
    });
  }

  return grid;
};

export const isAccessible = (x, y, world) => {
  const grid = generateAccessbilityGrid(world);
  if (y < 0 || y >= grid.length) {
    return 0;
  }
  const row = grid[y];
  if (x < 0 || x >= row.length) {
    return 0;
  }
  return row[x];
};
