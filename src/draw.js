import PIXI from 'pixi.js';

let width = 0;
let height = 0;

const renderer = new PIXI.WebGLRenderer(800, 600);
renderer.autoResize = true;

renderer.view.style.display = 'block';
renderer.backgroundColor = 0x01112a;
document.body.appendChild(renderer.view);
document.body.style.margin = 0;

const stretchToFillScreen = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.resize(width, height);
};
window.addEventListener('resize', stretchToFillScreen);
stretchToFillScreen();

const stage = new PIXI.Container();

// const drawAgent = (agent) => {
//   const size = 0.1;
//   ctx.fillStyle = colors[agent.state];
//   ctx.fillRect(
//     agent.x - (size / 2),
//     agent.y - (size / 2),
//     size,
//     size
//   );
// };

// const drawCell = ({ x, y, type }) => {
//   const drawX = x - 0.5;
//   const drawY = y - 0.5;
//   ctx.fillStyle = colors[type];
//   ctx.fillRect(drawX, drawY, 1, 1);
// };

// const drawRow = (row) => row.forEach(drawCell);

// const drawTerrain = (terrain) => {
//   ctx.beginPath();
//   terrain.forEach(drawRow);
// };

// const drawEntity = (entity) => {
//   const size = 0.5;
//   ctx.fillStyle = '#0f2b07';
//   ctx.fillRect(
//     entity.x - (size / 2),
//     entity.y - (size / 2),
//     size,
//     size
//   );
// };

export const addToStage = (child) => {
  // stage.cacheAsBitmap = false;
  stage.addChild(child);
  // stage.cacheAsBitmap = true;
};

export const draw = ({ camera }) => {
  stage.x = width / 2 - camera.x * camera.zoom;
  stage.y = height / 2 - camera.y * camera.zoom;
  stage.scale.x = stage.scale.y = camera.zoom;
  renderer.render(stage);
};

export const screenToGame = ({ x, y }, { camera }) => ({
  x: ((x - (width / 2)) / camera.zoom) + camera.x,
  y: ((y - (height / 2)) / camera.zoom) + camera.y,
});
