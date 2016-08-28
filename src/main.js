import game from './gameloop';
import { clamp, throttle, rand, times } from './util';
import { draw, screenToGame } from './draw';
import terrain from './terrain';
import { getKeyDown, getMousePosition, isMouseDown } from './input';

import astar from './astar';

const worldSize = 256;

const isAgentAlive = (agent) => agent.hp > 0;
const updateAgent = (agent, dt) => {
  if (agent.nextPosition) {
    agent.x = agent.nextPosition.x;
    agent.y = agent.nextPosition.y;
    agent.nextPosition = undefined;
  }
  if (agent.route) {
    if (agent.route.length) {
      agent.nextPosition = agent.route.shift();
    } else {
      agent.route = undefined;
    }
  }
  return agent;
  agent.ddirection += rand(-0.01, 0.01) * dt;
  agent.ddirection = clamp(agent.ddirection, -0.1, 0.1);
  agent.direction += agent.ddirection;

  agent.acceleration = rand(-0.01, 0.01);
  agent.acceleration = clamp(agent.acceleration, -0.1, 0.1);
  agent.speed += agent.acceleration;
  agent.speed = clamp(agent.speed, 0, 0.02);

  agent.x += Math.cos(agent.direction) * agent.speed * dt;
  agent.y += Math.sin(agent.direction) * agent.speed * dt;
  return agent;
};

const findRoute = (grid, start, end) => astar.findPath(
  grid,
  {
    x: Math.round(start.x),
    y: Math.round(start.y),
  },
  {
    x: Math.round(end.x),
    y: Math.round(end.y),
  }
);

function goto(grid, { x, y }) {
  this.route = undefined;
  return findRoute(grid, this, { x, y }).then((route) => {
    this.route = route;
  });
}

const createAgent = () => ({
  hp: 100,
  x: worldSize / 2,
  y: worldSize / 2,
  direction: rand(Math.PI * 2),
  ddirection: 0,
  speed: 0,
  acceleration: 0,
  goto,
});

const generateAccessbilityGrid = ({ terrain }) => {
  const grid = times(terrain.length, () => times(terrain.length, () => 0));
  terrain
    .forEach((row, y) => {
      row.forEach((cell, x) => {
        grid[x][y] = cell.accessible;
      });
    });
  return grid;
};

const click = throttle((state) => {
  const mouse = screenToGame(getMousePosition(), state);
  if (mouse.x > state.terrain.length || mouse.x < 0) {
    return state;
  }
  if (mouse.y > state.terrain.length || mouse.y < 0) {
    return state;
  }
  // state.terrain[Math.round(mouse.x)][Math.round(mouse.y)].type = 'snow';
  // return state;

  const me = state.agents[0];

  const grid = generateAccessbilityGrid(state);
  me.goto(grid, mouse);

  return state;
}, 500);

const processInput = (state) => {
  if (isMouseDown()) {
    state = click(state);
  }
  const keyDown = getKeyDown();
  if (keyDown['=']) {
    state.camera.zoom += 1;
  }
  if (keyDown['-']) {
    state.camera.zoom -= 1;
  }
  if (keyDown.ArrowLeft) {
    state.camera.x -= 10;
  }
  if (keyDown.ArrowRight) {
    state.camera.x += 10;
  }
  if (keyDown.ArrowUp) {
    state.camera.y -= 10;
  }
  if (keyDown.ArrowDown) {
    state.camera.y += 10;
  }
  state.camera.zoom = clamp(state.camera.zoom, 4, 16);
  return state;
};

const update = (state, dt) => {
  state = processInput(state);
  state.agents = state.agents
    .map((agent) => updateAgent(agent, dt))
    .filter(isAgentAlive);
  state.time += dt / 1000;
  astar.calculate();
  return state;
};


const initialState = () => {
  const agents = times(1, createAgent);

  return {
    terrain: terrain(worldSize),
    agents,
    time: 0,
    camera: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  };
};

game({
  state: initialState(),
  msPerUpdate: 1000 / 120,
  update,
  draw,
});
