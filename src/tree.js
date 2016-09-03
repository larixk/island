import PIXI from 'pixi.js';
import { addToStage } from './draw';
import { isoToScreen, tileH, noop, rand, isAccessible } from './util';

export default (options) => {
  const tree = Object.assign({
    hp: 100,
    x: 0,
    y: 0,
    update: noop,
  }, options);

  if (tree.world.accessibility[tree.y][tree.x] === 0) {
    return null;
  }

  const groundType = tree.world.terrain[tree.x][tree.y].type;
  if (groundType !== 'grass' && groundType !== 'grass-high') {
    return null;
  }

  const resourceKey = 'images/tree.png';
  const sprite = new PIXI.Sprite(PIXI.loader.resources[resourceKey].texture);
  const screenCoords = isoToScreen({ x: tree.x, y: tree.y });
  sprite.anchor.x = 0;
  sprite.anchor.y = 1;
  sprite.x = screenCoords.x;
  sprite.y = screenCoords.y + tileH;
  sprite.scale.x = sprite.scale.y = rand(0.8, 1.2);
  if (Math.round(rand(1))) {
    sprite.scale.x *= -1;
    sprite.x += sprite.width;
  }
  addToStage(sprite);

  tree.world.accessibility[tree.y][tree.x] = 0;

  return tree;
};
