export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const lerp = (a, b, t) => a + (t * (b - a));

export const noop = (a) => a;

export const now = () => new Date().getTime();

export const rand = (from, to = 0) => from + (Math.random() * (to - from));

export const throttle = (f, t) => {
  let lastCall = 0;
  return (...args) => {
    const currentCall = now();
    if (currentCall - lastCall < t) {
      return args[0];
    }
    lastCall = currentCall;
    return f(...args);
  };
};

export const times = (n, f) => {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(f(i));
  }
  return results;
};

