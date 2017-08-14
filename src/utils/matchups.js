export function getTitle (championName, type) {
  switch (type) {
    case 'counter':
      return `${championName} is weak against`;
    case 'strongpick':
      return `${championName} is strong against`;
    case 'synergy':
      return `${championName} goes well with`;
    case 'tie':
      return `${championName} goes even with`;
  }
};
