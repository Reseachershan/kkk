export type Levels = 'elite' | 'explorer' | 'ultra' | 'master' | 'klimber';
export const getLevelImage = (level?: Levels) => {
  if (level === 'elite') {
    return require('../assets/home/elite-icon.png');
  }
  if (level === 'explorer') {
    return require('../assets/home/explorer-icon.png');
  }
  if (level === 'ultra') {
    return require('../assets/home/ultra-icon.png');
  }
  if (level === 'master') {
    return require('../assets/home/master-icon.png');
  }
  if (level === 'klimber') {
    return require('../assets/home/klimber-icon.png');
  }
  return require('../assets/home/explorer-icon.png');
};
export const getNextLevelImage = (level?: Levels) => {
  if (level === 'elite') {
    return require('../assets/home/ultra-icon.png');
  }
  if (level === 'explorer') {
    return require('../assets/home/master-icon.png');
  }
  if (level === 'master') {
    return require('../assets/home/elite-icon.png');
  }
  if (level === 'klimber') {
    return require('../assets/home/explorer-icon.png');
  }
  return require('../assets/home/ultra-icon.png');
};
export const getNextKlimberLevelValue = (totalKlimbs?: number) => {
  if (!totalKlimbs || totalKlimbs <= 5) {
    return 4 - Number(totalKlimbs || 0);
  }
  if (totalKlimbs <= 14) {
    return 15 - Number(totalKlimbs || 0);
  }
  if (totalKlimbs <= 39) {
    return 40 - Number(totalKlimbs || 0);
  }
  if (totalKlimbs <= 74) {
    return 75 - Number(totalKlimbs || 0);
  }
  return 0;
};
export const getNextKlimberLevelPercent = (totalKlimbs?: number) => {
  if (!totalKlimbs || totalKlimbs <= 5) {
    return Number(totalKlimbs || 0) / 4;
  }
  if (totalKlimbs <= 14) {
    return Number(totalKlimbs || 0) / 15;
  }
  if (totalKlimbs <= 39) {
    return Number(totalKlimbs || 0) / 40;
  }
  if (totalKlimbs <= 74) {
    return Number(totalKlimbs || 0) / 75;
  }
  return 1;
};
export const getNextKlimberLevelText = (totalKlimbs?: number) => {
  const nextValue = getNextKlimberLevelValue(totalKlimbs);
  if (!totalKlimbs || totalKlimbs <= 5) {
    return `${nextValue} more Klimbs until EXPLORER!`;
  }
  if (totalKlimbs <= 14) {
    return `${nextValue} more Klimbs until MASTER!`;
  }
  if (totalKlimbs <= 39) {
    return `${nextValue} more Klimbs until ELITE!`;
  }
  if (totalKlimbs <= 74) {
    return `${nextValue} more Klimbs until ULTRA!`;
  }
  return 'You have all Klimb levels';
};
