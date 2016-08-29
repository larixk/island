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
      const noiseMedium = (simplex.noise2D(x / (size * 0.125), y / (size * 0.125)) + 1) / 2;
      const noiseSmall = (simplex.noise2D(x / (size * 0.03), y / (size * 0.03)) + 1) / 2;
      return Math.pow(distanceFromCenter - 0.25, 4) * Math.pow(noise, 2) * noiseMedium * noiseSmall;
    }
  ).map((altitude) => {
    if (altitude < 0.002) {
      return 'water-deep';
    }
    if (altitude < 0.005) {
      return 'water';
    }
    if (altitude < 0.007) {
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
  }))
);
