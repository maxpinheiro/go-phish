function roundHalf(num: number) {
  return Math.round(num * 2) / 2;
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z / 3));
}

const FREQUENCY_MIN = 3.009;
const POINTS_SCALE = 14;
const POINTS_SHIFT = 7.25;

export const songPointsByFrequency = (frequency: number) =>
  roundHalf(sigmoid(frequency / FREQUENCY_MIN) * POINTS_SCALE - POINTS_SHIFT);
