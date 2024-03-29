export const getPercent = (num: number, total: number) => {
  return ((num || 0) * 100) / (total || 1);
};
