const colors = {
  'water-deep': '#01112a',
  water: '#123c67',
  beach: '#aea790',
  grass: '#495a34',
  'grass-high': '#324822',
  rock: 'grey',
  snow: 'white',
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
  const size = 1;
  ctx.fillStyle = 'black';
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

export const draw = (state) => {
  canvas.width = canvas.width;
  ctx.fillStyle = colors['water-deep'];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-state.camera.x, -state.camera.y);
  ctx.scale(Math.round(state.camera.zoom), Math.round(state.camera.zoom));
  drawTerrain(state.terrain);

  state.agents.forEach(drawAgent);
  ctx.restore();
};

export const screenToGame = ({ x, y }, { camera }) => ({
  x: (x + camera.x) / camera.zoom,
  y: (y + camera.y) / camera.zoom,
});
