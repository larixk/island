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
    console.log(entity.x, entity.y);
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


const initialState = generateInitialState();

game({
  state: initialState,
  msPerUpdate: 1000 / 30,
  update,
  draw,
});

setGrid(generateAccessbilityGrid(initialState.world));
