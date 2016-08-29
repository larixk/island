const colors = {
  'water-deep': '#01112a',
  water: '#123c67',
  beach: '#aea790',
  grass: '#495a34',
  'grass-high': '#324822',
  rock: 'grey',
  snow: 'white',

  idle: 'blue',
  walking: 'white',
  calculating: 'yellow',
  turning: 'purple',
};

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.style.display = 'block';
document.body.style.margin = 0;

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

const drawAgent = (agent) => {
  const size = 0.1;
  ctx.fillStyle = colors[agent.state];
  ctx.fillRect(
    agent.x - (size / 2),
    agent.y - (size / 2),
    size,
    size
  );
};

const drawCell = ({ x, y, type }) => {
  const drawX = x - 0.5;
  const drawY = y - 0.5;
  ctx.fillStyle = colors[type];
  ctx.fillRect(drawX, drawY, 1, 1);
};

const drawRow = (row) => row.forEach(drawCell);

const drawTerrain = (terrain) => {
  ctx.beginPath();
  terrain.forEach(drawRow);
};

const drawEntity = (entity) => {
  const size = 0.5;
  ctx.fillStyle = '#0f2b07';
  ctx.fillRect(
    entity.x - (size / 2),
    entity.y - (size / 2),
    size,
    size
  );
};

export const draw = (state) => {
  canvas.width = canvas.width;
  ctx.fillStyle = colors['water-deep'];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(state.camera.zoom, state.camera.zoom);
  ctx.translate(-state.camera.x, -state.camera.y);

  drawTerrain(state.world.terrain);
  state.world.entities.forEach(drawEntity);
  state.world.agents.forEach(drawAgent);

  ctx.restore();
};

export const screenToGame = ({ x, y }, { camera }) => ({
  x: ((x - (canvas.width / 2)) / camera.zoom) + camera.x,
  y: ((y - (canvas.height / 2)) / camera.zoom) + camera.y,
});
