export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const roundProb = (prob: number) => Math.round(prob * 100) / 100;

export const randomInt = (from: number, to: number): number => {
  return Math.floor(Math.random() * (to - from) + from);
};
