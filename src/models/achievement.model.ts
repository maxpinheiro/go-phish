export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: 'full-run',
    name: 'Something Full Run',
    description: 'Make guesses for every show of a single run.',
  },
  {
    id: 'hot-streak',
    name: 'Hot Streak',
    description: 'Correctly guess three (3) songs played in a row.',
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description:
      'Correctly guess all songs on a single night (including the encore in the correct position).',
  },
  {
    id: 'triple-nipple',
    name: 'Triple Nipple',
    description: 'Correctly guess Punch You in the Eye, Fee, and The Sloth.',
  },
];
