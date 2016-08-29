import { lerp } from './util.js';
import { findPath } from './astar';

const distance = (start, end) =>
  Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

function moveStep(maxDistance) {
  const d = distance(this, this.nextPosition);
  const t = Math.min(1, maxDistance / d);
  this.x = lerp(this.x, this.nextPosition.x, t);
  this.y = lerp(this.y, this.nextPosition.y, t);
  if (t === 1) {
    this.nextPosition = undefined;
    if (this.route && this.route.length) {
      this.nextPosition = this.route.shift();
      this.moveStep(maxDistance - d);
    }
  }
}

function update(dt) {
  let state;
  if (this.calculating) {
    state = 'calculating';
  } else if (this.nextPosition) {
    state = 'walking';
    this.moveStep(this.maxSpeedPerMs * dt);
  } else if (this.route && this.route.length) {
    state = 'walking';
    this.nextPosition = this.route.shift();
    this.moveStep(this.maxSpeedPerMs * dt);
  } else {
    state = 'idle';
  }
  this.state = state;
  return this;
}

function goto({ x, y }) {
  const calculationTarget = `${x},${y}`;
  this.route = undefined;
  this.calculating = calculationTarget;
  findPath(
    {
      x: Math.round(this.x),
      y: Math.round(this.y),
    },
    {
      x: Math.round(x),
      y: Math.round(y),
    },
    (route) => {
      if (this.calculating !== calculationTarget) {
        console.log('outdated route calculation result');
        return;
      }
      this.calculating = false;
      if (!route || !route.length) {
        this.route = undefined;
        return;
      }
      // Remove first element, since that's where we already are.
      route.shift();
      this.route = route;
    }
  );
}

export default (options) => Object.assign({
  hp: 100,
  x: 0,
  y: 0,
  maxSpeedPerMs: 0.001,
  update,
  goto,
  moveStep,
}, options);
