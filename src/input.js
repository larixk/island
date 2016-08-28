let mouseX;
let mouseY;
let mouseDown;
const keyDown = {};

document.body.addEventListener('mousedown', () => {
  mouseDown = true;
});

document.body.addEventListener('mouseup', () => {
  mouseDown = false;
});

document.body.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.body.addEventListener('keydown', (e) => {
  console.log(e.key);
  keyDown[e.key] = true;
});

document.body.addEventListener('keyup', (e) => {
  keyDown[e.key] = false;
});

export const getMousePosition = () => ({
  x: mouseX,
  y: mouseY,
});

export const isMouseDown = () => mouseDown;

export const getKeyDown = () => keyDown;
