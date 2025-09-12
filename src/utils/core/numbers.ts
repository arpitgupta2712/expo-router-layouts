// Number Utilities
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
