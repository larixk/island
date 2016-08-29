import EasyStar from 'easystarjs';

const easystar = new EasyStar.js();
easystar.enableDiagonals();
easystar.setIterationsPerCalculation(10000);

export const findPath = (start, end, callback) => {
  const startX = start.x;
  const startY = start.y;
  const endX = end.x;
  const endY = end.y;

  easystar.findPath(startX, startY, endX, endY, callback);

  return easystar;
};

export const setGrid = (grid) => {
  easystar.setGrid(grid);
  easystar.setAcceptableTiles([1]);
};

export const calculate = () => {
  easystar.calculate();
};
