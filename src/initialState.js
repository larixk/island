import { rand, times } from './util';
import terrain from './terrain';
import worker from './worker';
import tree from './tree';

const worldSize = 256;

export default () => {
  const world = {
    terrain: terrain(worldSize),
  };
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
  });

  return {
    world,
    time: 0,
    camera: {
      x: worldSize / 2,
      y: worldSize / 2,
      zoom: 1,
    },
  };
};
