import SimplexNoise from 'simplex-noise';
import { times } from './util';

const simplex = new SimplexNoise(Math.random);

export default (size) => times(
  size,
  (x) => times(
    size,
    (y) => {
      const noise = (simplex.noise2D(x / (size * 0.25), y / (size * 0.25)) + 1) / 2;
      const distanceFromCenter = 1 - (Math.sqrt(
        Math.pow((size / 2) - x, 2) +
        Math.pow((size / 2) - y, 2)
      ) / size);
      const noiseSmall = (simplex.noise2D(x / (size * 0.06), y / (size * 0.06)) + 1) / 2;
      return Math.pow(distanceFromCenter - 0.25, 4) * Math.pow(noise, 2) * noiseSmall;
    }
  ).map((altitude) => {
    if (altitude < 0.003) {
      return 'water-deep';
    }
    if (altitude < 0.005) {
      return 'water';
    }
    if (altitude < 0.01) {
      return 'beach';
    }
    if (altitude < 0.02) {
      return 'grass';
    }
    if (altitude < 0.1) {
      return 'grass-high';
    }
    if (altitude < 0.2) {
      return 'rock';
    }
    return 'snow';
  }).map((type, y) => ({
    x,
    y,
    accessible: (type === 'water-deep') ? 0 : 1,
    type,
  }))
);
