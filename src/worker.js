import PIXI from 'pixi.js';
import { addToStage } from './draw';
import { findPath } from './astar';
import { isoToScreen, lerp, tileH, rand } from './util';

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

function updateSprite() {
  this.sprite.position = isoToScreen(this);
  this.sprite.alpha = this.state === 'idle' ? 0.5 : 1;
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
    this.goto({
      x: Math.random() * this.world.terrain.length,
      y: Math.random() * this.world.terrain.length,
    });
  }
  this.state = state;
  this.updateSprite();
  return this;
}

function goto({ x, y }) {
  const calculationTarget = `${x},${y}`;
  this.route = undefined;
  this.nextPosition = undefined;
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
      route.shift();
      this.route = route;
    }
  );
}

export default (options) => {
  const worker = Object.assign({
    hp: 100,
    x: 0,
    y: 0,
    maxSpeedPerMs: 0.001,
    update,
    updateSprite,
    goto,
    moveStep,
  }, options);

  if (worker.world.accessibility[worker.y][worker.x] === 0) {
    return null;
  }

  const resourceKey = 'images/snow.png';
  const sprite = new PIXI.Sprite(PIXI.loader.resources[resourceKey].texture);
  const screenCoords = isoToScreen({ x: worker.x, y: worker.y });
  sprite.x = screenCoords.x;
  sprite.y = screenCoords.y - sprite.height + tileH;
  addToStage(sprite);
  worker.sprite = sprite;

  return worker;
};
