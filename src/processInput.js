import { screenToGame } from './draw';
import { clamp, throttle } from './util';
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

export default (state) => {
  if (isMouseDown()) {
    state = click(state);
  }
  const keyDown = getKeyDown();
  if (keyDown['=']) {
    state.camera.zoom *= 1.1;
  }
  if (keyDown['-']) {
    state.camera.zoom /= 1.1;
  }
  if (keyDown.ArrowLeft) {
    state.camera.x -= 10 / state.camera.zoom;
  }
  if (keyDown.ArrowRight) {
    state.camera.x += 10 / state.camera.zoom;
  }
  if (keyDown.ArrowUp) {
    state.camera.y -= 10 / state.camera.zoom;
  }
  if (keyDown.ArrowDown) {
    state.camera.y += 10 / state.camera.zoom;
  }
  state.camera.zoom = clamp(state.camera.zoom, 1, 256);

  state.camera.x = state.world.agents[0].x;
  state.camera.y = state.world.agents[0].y;
  return state;
};
