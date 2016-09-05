import PIXI from 'pixi.js';
import game from './gameloop';
import { draw } from './draw';
import processInput from './processInput';
import generateInitialState from './initialState';
import { calculate } from './astar';

const checkHpAgent = (agent) => agent.hp > 0;

const update = (state, dt) => {
  const newState = processInput(state);
  newState.world.agents = newState.world.agents
    .map((agent) => agent.update(dt))
    .filter(checkHpAgent);
  newState.world.entities
    .forEach((entity) => entity.update(dt));
  newState.time += dt / 1000;
  calculate();
  return newState;
};

const init = () => {
  const initialState = generateInitialState();

  game({
    state: initialState,
    msPerUpdate: 1000 / 60,
    update,
    draw,
  });
};

PIXI.loader
  .add('images/tree-0.png')
  .add('images/tree-1.png')
  .add('images/tree-2.png')
  .add('images/water.png')
  .add('images/beach-0.png')
  .add('images/beach-1.png')
  .add('images/beach-2.png')
  .add('images/beach-3.png')
  .add('images/beach-4.png')
  .add('images/beach-5.png')
  .add('images/beach-6.png')
  .add('images/beach-7.png')
  .add('images/beach-8.png')
  .add('images/beach-9.png')
  .add('images/beach-10.png')
  .add('images/beach-11.png')
  .add('images/beach-12.png')
  .add('images/beach-13.png')
  .add('images/beach-14.png')
  .add('images/beach-15.png')
  .add('images/beach-16.png')
  .add('images/grass-high.png')
  .add('images/grass.png')
  .add('images/beach.png')
  .add('images/rock.png')
  .add('images/snow.png')
  .load(init);
