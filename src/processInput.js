import { screenToGame } from './draw';
import { clamp, throttle, isoToScreen } from './util';
import { getKeyDown, getMousePosition, isMouseDown } from './input';

const click = throttle((state) => {
  const mouse = screenToGame(getMousePosition(), state);
  console.log(mouse);
  if (mouse.x > state.world.terrain.length || mouse.x < 0) {
    return state;
  }
  if (mouse.y > state.world.terrain.length || mouse.y < 0) {
    return state;
  }
  const me = state.world.agents.forEach((agent) => agent.goto(mouse));

  return state;
}, 500);

let dZoom = 0;
let dX = 0;
let dY = 0;

export default (state) => {
  if (isMouseDown()) {
    state = click(state);
  }
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
  dZoom = clamp(dZoom, -2, 2);

  state.camera.zoom *= 1 + dZoom;

  state.camera.zoom = clamp(state.camera.zoom, 0.01, 1);

  if(state.world.agents.length) {
    state.camera.x = isoToScreen(state.world.agents[0]).x;
    state.camera.y = isoToScreen(state.world.agents[0]).y;
  }

  return state;
};
