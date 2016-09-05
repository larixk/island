import { rand, times, generateAccessbilityGrid, isoToScreen } from './util';
import terrain from './terrain';
import worker from './worker';
import tree from './tree';
import { setGrid } from './astar';

const worldSize = 512;

function findJob() {
  if (!this.jobs.length) {
    return null;
  }
  return this.jobs.shift();
}

export default () => {
  const world = {
    terrain: terrain(worldSize),
    entities: [],
    agents: [],
    jobs: [],
    findJob,
  };
  world.accessibility = generateAccessbilityGrid(world);
  times((worldSize * worldSize) / 10, () => {
    const thisTree = tree({
      x: Math.floor(rand(worldSize)),
      y: Math.floor(rand(worldSize)),
      world,
    });
    return thisTree;
  });
  times(10, () => {
    const thisWorker = worker({
      x: worldSize / 2,
      y: worldSize / 2,
      world,
    });
    return thisWorker;
  });

  setGrid(world.accessibility);

  const startCameraLocation = isoToScreen({
    x: worldSize / 2,
    y: worldSize / 2,
  });

  return {
    world,
    time: 0,
    camera: {
      x: startCameraLocation.x,
      y: startCameraLocation.y,
      zoom: 1,
    },
  };
};
