import { getCells } from './piece.js';

export class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  reset() {
    this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(null));
  }

  inside(x, y) {
    return x >= 0 && x < this.width && y < this.height;
  }

  isEmpty(x, y) {
    if (y < 0) return true;
    return this.inside(x, y) && !this.grid[y][x];
  }

  collides(piece, next) {
    const x = next?.x ?? piece.x;
    const y = next?.y ?? piece.y;
    const rotation = next?.rotation ?? piece.rotation;
    const cells = getCells({ ...piece, x, y, rotation });
    for (const cell of cells) {
      if (!this.inside(cell.x, cell.y)) return true;
      if (cell.y >= 0 && this.grid[cell.y][cell.x]) return true;
    }
    return false;
  }

  place(piece) {
    const cells = getCells(piece);
    for (const { x, y } of cells) {
      if (y >= 0 && this.inside(x, y)) {
        this.grid[y][x] = { color: piece.color, type: piece.type };
      }
    }
  }

  clearLines() {
    const newRows = [];
    let cleared = 0;
    for (let y = this.height - 1; y >= 0; y -= 1) {
      const row = this.grid[y];
      if (row.every(Boolean)) {
        cleared += 1;
      } else {
        newRows.push(row);
      }
    }
    while (newRows.length < this.height) {
      newRows.push(Array(this.width).fill(null));
    }
    newRows.reverse();
    this.grid = newRows;
    return cleared;
  }

  clearRow(rowIndex) {
    if (rowIndex < 0 || rowIndex >= this.height) return 0;
    this.grid.splice(rowIndex, 1);
    this.grid.unshift(Array(this.width).fill(null));
    return this.width;
  }

  countHoles() {
    let holes = 0;
    for (let x = 0; x < this.width; x += 1) {
      let seenBlock = false;
      for (let y = 0; y < this.height; y += 1) {
        if (this.grid[y][x]) {
          seenBlock = true;
        } else if (seenBlock) {
          holes += 1;
        }
      }
    }
    return holes;
  }

  rowOccupancy() {
    return this.grid.map((row) => row.filter(Boolean).length);
  }
}
