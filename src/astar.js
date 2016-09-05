import EasyStar from 'easystarjs';

const easystar = new EasyStar.js();
easystar.setIterationsPerCalculation(1000);
easystar.enableDiagonals();

export const findPath = (start, end, callback) => {
  const startX = start.x;
  const startY = start.y;
  const endX = end.x;
  const endY = end.y;

  easystar.findPath(startX, startY, endX, endY, callback, true);

  return easystar;
};

export const setGrid = (grid) => {
  easystar.setGrid(grid);
  easystar.setAcceptableTiles([1]);
};

export const calculate = () => {
  easystar.calculate();
};
