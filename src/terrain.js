import PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import { lerp, times } from './util';
import { addToStage } from './draw';

const simplex = new SimplexNoise(Math.random);

const terrainSprite = new PIXI.Container();

const tileW = 128;
const tileH = 64;

const screenToIso = ({ x, y }) => ({
  x: (y / tileH) + (x / (2 * tileW)),
  y: (y / tileH) - (x / (2 * tileW)),
});


const isoToScreen = ({ x, y }) => ({
  x: (x - y) * (tileW / 2),
  y: (x + y) * (tileH / 2),
});


const createTileSprite = (x, y, type) => {
  if (type === 'water-deep') {
    return null;
  }
  const resourceKey = `images/${type}.png`;
  const sprite = new PIXI.Sprite(PIXI.loader.resources[resourceKey].texture);
  const screenCoords = isoToScreen({ x, y });
  sprite.x = screenCoords.x;
  sprite.y = screenCoords.y;
  sprite.width = tileW;
  sprite.height = tileH;
  terrainSprite.addChild(sprite);
  return sprite;
};

export default (size) => {
  const terrain = times(
    size,
    (x) => times(
      size,
      (y) => {
        const noise = (simplex.noise2D(x / (size * 0.25), y / (size * 0.25)) + 1) / 2;
        const distanceFromCenter = 1 - (Math.sqrt(
          Math.pow((size / 2) - x, 2) +
          Math.pow((size / 2) - y, 2)
        ) / size);
        const noiseMedium = (simplex.noise2D(x / (size * 0.125), y / (size * 0.125)) + 1) / 2;
        const noiseSmall = lerp(
          (simplex.noise2D(x / (size * 0.03), y / (size * 0.03)) + 1) / 2,
          1,
          0.1
        );
        return Math.pow(distanceFromCenter - 0.25, 4) *
          Math.pow(noise, 2) *
          noiseMedium *
          noiseSmall;
      }
    ).map((altitude) => {
      if (altitude < 0.001) {
        return 'water-deep';
      }
      if (altitude < 0.0035) {
        return 'water';
      }
      if (altitude < 0.0045) {
        return 'beach';
      }
      if (altitude < 0.015) {
        return 'grass';
      }
      if (altitude < 0.06) {
        return 'grass-high';
      }
      if (altitude < 0.09) {
        return 'rock';
      }
      return 'snow';
    }).map((type, y) => ({
      x,
      y,
      accessible: (['rock', 'snow', 'water-deep'].includes(type)) ? 0 : 1,
      type,
    })));

  terrain.forEach((row, x) => row.forEach((cell, y) => {
    createTileSprite(x, y, cell.type);

    const smoothing = {};
    const neighbours = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];
    neighbours.forEach((neighbourCoord, i) => {
      const neighbourX = neighbourCoord.x;
      const neighbourY = neighbourCoord.y;
      if (neighbourY >= terrain.length || neighbourX >= terrain.length) {
        return;
      }
      if (neighbourY < 0 || neighbourX < 0) {
        return;
      }

      const neighbour = terrain[neighbourX][neighbourY];
      const neighbourType = neighbour.type;
      if (neighbourType === cell.type) {
        return;
      }
      if (!smoothing[neighbourType]) {
        smoothing[neighbourType] = 0;
      }
      smoothing[neighbour.type] += Math.pow(2, i);
    });

    Object.keys(smoothing).forEach((type) => {
      createTileSprite(x, y, `${type}-${smoothing[type]}`);
    });
  }));
  // terrainSprite.cacheAsBitmap = true;
  addToStage(terrainSprite);
  return terrain;
};
