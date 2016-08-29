import { noop } from './util';

export default (options) => {
  const tree = Object.assign({
    hp: 100,
    x: 0,
    y: 0,
    update: noop,
  }, options);

  if (tree.world) {
    const groundType = tree.world.terrain[tree.x][tree.y].type;
    if (groundType !== 'grass' && groundType !== 'grass-high') {
      return null;
    }
  }

  return tree;
};
