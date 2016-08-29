import { times } from './util';
import terrain from './terrain';
import worker from './worker';

const worldSize = 512;

export default () => {
  const world = {
    terrain: terrain(worldSize),
  };
  world.agents = times(10, () => {
    const thisWorker = worker({
      x: worldSize / 2,
      y: worldSize / 2,
    });
    thisWorker.world = world;
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
