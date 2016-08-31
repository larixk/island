import PIXI from 'pixi.js';
import game from './gameloop';
import { draw } from './draw';
import processInput from './processInput';
import generateInitialState from './initialState';
import { setGrid, calculate } from './astar';
import { times } from './util';

const generateAccessbilityGrid = ({ terrain, entities }) => {
  const grid = times(terrain.length, () => times(terrain.length, () => 0));
  terrain
    .forEach((row, y) => {
      row.forEach((cell, x) => {
        grid[x][y] = cell.accessible;
      });
    });

  entities.forEach((entity) => {
    grid[entity.y][entity.x] = 0;
  });

  return grid;
};

const checkHpAgent = (agent) => agent.hp > 0;

const update = (state, dt) => {
  const newState = processInput(state);
  newState.world.agents = newState.world.agents
    .map((agent) => agent.update(dt))
    .filter(checkHpAgent);
  newState.time += dt / 1000;
  calculate();
  return newState;
};

const init = () => {
  const initialState = generateInitialState();

  game({
    state: initialState,
    msPerUpdate: 1000 / 30,
    update,
    draw,
  });

  setGrid(generateAccessbilityGrid(initialState.world));
};

PIXI.loader
  .add('images/water.png')
  .add('images/water-1.png')
  .add('images/water-2.png')
  .add('images/water-3.png')
  .add('images/water-4.png')
  .add('images/water-5.png')
  .add('images/water-6.png')
  .add('images/water-7.png')
  .add('images/water-8.png')
  .add('images/water-9.png')
  .add('images/water-10.png')
  .add('images/water-11.png')
  .add('images/water-12.png')
  .add('images/water-13.png')
  .add('images/water-14.png')
  .add('images/water-15.png')
  .add('images/water-16.png')
  .add('images/grass-high.png')
  .add('images/grass.png')
  .add('images/beach.png')
  .add('images/rock.png')
  .add('images/snow.png')
  .load(init);
