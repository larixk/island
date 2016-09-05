import { screenToIso, clamp, throttle } from './util';
import { getKeyDown, getMousePosition, isMouseDown } from './input';

let previousHover;

const hover = (mouse, state) => {
  const hoverX = Math.round(mouse.x);
  const hoverY = Math.round(mouse.y);

  previousHover = state.world.terrain[hoverX][hoverY].sprite;
  if (previousHover) {
    previousHover.alpha = 0.8;
  }
};

const click = throttle((mouse, state) => {
  state.world.jobs.push({
    location: mouse,
    wp: 10,
  });
  state.world.terrain[mouse.x][mouse.y].sprite.alpha = 0.3;
  return state;
}, 500);

let dZoom = 0;
let dX = 0;
let dY = 0;

const processMouse = (state) => {
  if (previousHover) {
    previousHover.alpha = 1;
  }

  const mouse = screenToIso(getMousePosition(), state.camera);
  if (!mouse.x || !mouse.y) {
    return;
  }
  if (mouse.x >= state.world.terrain.length || mouse.x < 0) {
    return;
  }
  if (mouse.y >= state.world.terrain.length || mouse.y < 0) {
    return;
  }

  hover(mouse, state);
  if (isMouseDown()) {
    click(mouse, state);
  }
};

export default (state) => {
  processMouse(state);
  const keyDown = getKeyDown();
  if (keyDown['=']) {
    dZoom += 0.01;
  }
  if (keyDown['-']) {
    dZoom -= 0.01;
  }
  if (keyDown.ArrowLeft) {
    dX -= 0.1;
    // state.camera.x -= 10 / state.camera.zoom;
  }
  if (keyDown.ArrowRight) {
    dX += 0.1;
    // state.camera.x += 10 / state.camera.zoom;
  }
  if (keyDown.ArrowUp) {
    dY -= 0.1;
    // state.camera.y -= 10 / state.camera.zoom;
  }
  if (keyDown.ArrowDown) {
    dY += 0.1;
    // state.camera.y += 10 / state.camera.zoom;
  }

  dX *= 0.9;
  dX = clamp(dX, -1, 1);
  state.camera.x += (20 * dX) / state.camera.zoom;

  dY *= 0.9;
  dY = clamp(dY, -1, 1);
  state.camera.y += (20 * dY) / state.camera.zoom;

  dZoom *= 0.9;
  dZoom = clamp(dZoom, -0.01, 1);

  state.camera.zoom *= 1 + dZoom;

  state.camera.zoom = clamp(state.camera.zoom, 0.001, 1);

  // if(state.world.agents.length) {
  //   state.camera.x = isoToScreen(state.world.agents[0]).x;
  //   state.camera.y = isoToScreen(state.world.agents[0]).y;
  // }

  return state;
};
