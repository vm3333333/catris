export const CONFIG = {
  title: 'Catris: Neon Inferno',
  board: { width: 10, height: 20, spawnX: 3, spawnY: -1 },
  drop: {
    baseInterval: 900,
    minInterval: 120,
    levelStep: 60,
  },
  scoring: {
    lines: [0, 100, 300, 500, 800],
    comboBonus: 80,
    softDrop: 1,
    hardDrop: 2,
    laserBonus: 180,
  },
  level: {
    threshold: 10,
  },
  flame: {
    baseRise: 0.01,
    holePenalty: 0.015,
    droughtPenalty: 0.02,
    clearReward: 0.08,
    multiReward: 0.12,
    clamp: [0, 1],
  },
  laser: {
    chargePerLine: 0.28,
    cost: 1,
  },
  palette: {
    normal: {
      I: '#6bffea',
      O: '#ffd35a',
      T: '#ff6ad5',
      S: '#7cff6b',
      Z: '#ff7b3f',
      J: '#84b6ff',
      L: '#ffa5ff',
      special: '#ffffff',
      bg: '#0b0f1c',
    },
    colorblind: {
      I: '#2de1fc',
      O: '#f0c808',
      T: '#ff4365',
      S: '#4cd964',
      Z: '#ff7733',
      J: '#5c7aff',
      L: '#ff9f1c',
      special: '#ffffff',
      bg: '#0b0f1c',
    },
  },
  story: [
    { id: 'intro', trigger: { lines: 0 }, text: 'Nova online. Flames rising below the neon sea. Stack fast, keep the grid sealed.' },
    { id: 'first-clear', trigger: { lines: 4 }, text: 'Good clear! The city lasers are syncing with your rhythm.' },
    { id: 'laser-ready', trigger: { level: 2 }, text: 'Laser capacitors charged. Press L to vaporize a messy row.' },
    { id: 'flame-warning', trigger: { flame: 0.6 }, text: 'Heat spikes! Cover the holes or the lava kisses our paws.' },
    { id: 'district-shift', trigger: { level: 4 }, text: 'District swap. Neon skyline flickers, but cats stay sharp.' },
  ],
};

export const SHAPES = {
  I: [
    [ [0,1], [1,1], [2,1], [3,1] ],
    [ [2,0], [2,1], [2,2], [2,3] ],
    [ [0,2], [1,2], [2,2], [3,2] ],
    [ [1,0], [1,1], [1,2], [1,3] ],
  ],
  O: [
    [ [1,0], [2,0], [1,1], [2,1] ],
  ],
  T: [
    [ [1,0], [0,1], [1,1], [2,1] ],
    [ [1,0], [1,1], [2,1], [1,2] ],
    [ [0,1], [1,1], [2,1], [1,2] ],
    [ [1,0], [0,1], [1,1], [1,2] ],
  ],
  S: [
    [ [1,0], [2,0], [0,1], [1,1] ],
    [ [1,0], [1,1], [2,1], [2,2] ],
    [ [1,1], [2,1], [0,2], [1,2] ],
    [ [0,0], [0,1], [1,1], [1,2] ],
  ],
  Z: [
    [ [0,0], [1,0], [1,1], [2,1] ],
    [ [2,0], [1,1], [2,1], [1,2] ],
    [ [0,1], [1,1], [1,2], [2,2] ],
    [ [1,0], [0,1], [1,1], [0,2] ],
  ],
  J: [
    [ [0,0], [0,1], [1,1], [2,1] ],
    [ [1,0], [2,0], [1,1], [1,2] ],
    [ [0,1], [1,1], [2,1], [2,2] ],
    [ [1,0], [1,1], [0,2], [1,2] ],
  ],
  L: [
    [ [2,0], [0,1], [1,1], [2,1] ],
    [ [1,0], [1,1], [1,2], [2,2] ],
    [ [0,1], [1,1], [2,1], [0,2] ],
    [ [0,0], [1,0], [1,1], [1,2] ],
  ],
};
