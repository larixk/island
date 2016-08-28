import { noop, now } from './util';

let playing = false;
let lastUpdateTime;

const defaults = {
  msPerUpdate: 10,
  update: noop,
  draw: noop,
};

let options;

const resume = () => {
  playing = true;
  lastUpdateTime = now();
};

const pause = () => {
  playing = false;
};

const gameControls = {
  resume,
  pause,
};

const tick = () => {
  if (playing) {
    const dt = options.msPerUpdate;
    const currentTime = now();
    while (lastUpdateTime < currentTime) {
      lastUpdateTime = now();
      options.state = options.update(options.state, dt, gameControls);
    }
  }
  options.draw(options.state);
  requestAnimationFrame(tick);
};

export default (parameters) => {
  options = Object.assign({}, defaults, parameters);
  resume();
  tick();
  return gameControls;
};
