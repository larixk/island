import EasyStar from 'easystarjs';

const easystar = new EasyStar.js();

export default {
  findPath: (grid, start, end) => {
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([1]);
    easystar.enableDiagonals();

    console.log(start);
    console.log(end);

    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;

    return new Promise((resolve) => {
      easystar.findPath(startX, startY, endX, endY, resolve);
    });
  },
  calculate: () => {
    easystar.calculate();
  },
};
