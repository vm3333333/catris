import { SHAPES } from './config.js';

export class PieceBag {
  constructor(random = Math.random) {
    this.random = random;
    this.bag = [];
  }

  next() {
    if (this.bag.length === 0) {
      this.bag = shuffle(Object.keys(SHAPES), this.random);
    }
    return this.bag.pop();
  }
}

function shuffle(arr, rnd) {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function createPiece(type, palette, spawnX, spawnY) {
  return {
    type,
    rotation: 0,
    x: spawnX,
    y: spawnY,
    color: palette[type] || palette.special,
  };
}

export function getCells(piece, rotation = piece.rotation) {
  const shape = SHAPES[piece.type];
  const rot = shape[rotation % shape.length];
  return rot.map(([dx, dy]) => ({ x: piece.x + dx, y: piece.y + dy }));
}

export function rotateIndex(piece, dir = 1) {
  const shape = SHAPES[piece.type];
  const len = shape.length;
  if (len === 1) return 0;
  return (piece.rotation + dir + len) % len;
}
