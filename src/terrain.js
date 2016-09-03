import PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import { lerp, times, isoToScreen, tileW, tileH } from './util';
import { addToStage } from './draw';

const simplex = new SimplexNoise(Math.random);

const terrainSprite = new PIXI.Container();

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
        const noiseMedium = (simplex.noise2D(x / (size * 0.1), y / (size * 0.1)) + 1) / 2;
        const noiseSmall = lerp(
          (simplex.noise2D(x / (size * 0.025), y / (size * 0.025)) + 1) / 2,
          1,
          0.2
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
      if (altitude < 0.0015) {
        return 'water';
      }
      if (altitude < 0.002) {
        return 'beach';
      }
      if (altitude < 0.008) {
        return 'grass';
      }
      if (altitude < 0.03) {
        return 'grass-high';
      }
      if (altitude < 0.07) {
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
  }));
  addToStage(terrainSprite);
  return terrain;
};
