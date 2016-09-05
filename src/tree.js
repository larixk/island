import PIXI from 'pixi.js';
import { addToStage } from './draw';
import { isoToScreen, tileH, noop, rand } from './util';

function updateSprite() {
  this.sprite.position = isoToScreen(this);
  this.sway += this.swaySpeed;
  this.sprite.rotation = -0.05 + 0.2 * Math.sin(this.sway);
}

export default (options) => {
  const tree = Object.assign({
    hp: 100,
    x: 0,
    y: 0,
    sway: Math.random(),
    swaySpeed: rand(0.01) + 0.005,
    update: () => { tree.updateSprite()
    },
    updateSprite,
  }, options);

  if (tree.world.accessibility[tree.y][tree.x] === 0) {
    return;
  }

  const groundType = tree.world.terrain[tree.x][tree.y].type;
  if (groundType !== 'grass' && groundType !== 'grass-high') {
    return;
  }

  const index = (groundType === 'grass-high') ? 0 : Math.floor(rand(1, 3));
  const resourceKey = `images/tree-${index}.png`;
  const sprite = new PIXI.Sprite(PIXI.loader.resources[resourceKey].texture);
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 1;
  sprite.scale.x = sprite.scale.y = rand(0.7, 1.3);
  sprite.rotation = rand(-0.1, 0.1);
  if (Math.round(rand(1))) {
    sprite.scale.x *= -1;
    sprite.x += sprite.width;
  }
  addToStage(sprite);
  tree.sprite = sprite;
  tree.updateSprite();

  tree.world.accessibility[tree.y][tree.x] = 0;

  tree.world.entities.push(tree);
};
