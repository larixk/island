import { rand, times, generateAccessbilityGrid } from './util';
import terrain from './terrain';
import worker from './worker';
import tree from './tree';
import { setGrid } from './astar';

const worldSize = 512;

export default () => {
  const world = {
    terrain: terrain(worldSize),
  };
  world.accessibility = generateAccessbilityGrid(world);
  world.entities = times((worldSize * worldSize) / 10, () => {
    const thisTree = tree({
      x: Math.floor(rand(worldSize)),
      y: Math.floor(rand(worldSize)),
      world,
    });
    return thisTree;
  }).filter((entity) => entity);
  world.agents = times(10, () => {
    const thisWorker = worker({
      x: worldSize / 2,
      y: worldSize / 2,
      world,
    });
    return thisWorker;
  }).filter((entity) => entity);

  setGrid(world.accessibility);

  return {
    world,
    time: 0,
    camera: {
      x: 0,
      y: 19000,
      zoom: 0.01,
    },
  };
};
