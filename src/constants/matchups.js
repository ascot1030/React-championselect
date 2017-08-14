export const LANES = [
  'all',
  'general',
  'top',
  'middle',
  'bottom',
  'jungle'
];

export const TYPES = [
  'counter',
  'strongpick',
  'synergy',
  'tie'
];

// Temporary until API is updated.
export const CHAMPIONS_COUNT = 133;

export const MATCHUPS_COUNT = (CHAMPIONS_COUNT - 1) * (LANES.length - 1);
