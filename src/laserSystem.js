export class LaserSystem {
  constructor(config) {
    this.config = config;
    this.charge = 0;
  }

  reset() {
    this.charge = 0;
  }

  addLines(lines) {
    if (lines <= 0) return this.charge;
    this.charge = Math.min(1, this.charge + lines * this.config.chargePerLine);
    return this.charge;
  }

  canFire() {
    return this.charge >= this.config.cost;
  }

  fire(board) {
    if (!this.canFire()) return null;
    const occupancy = board.rowOccupancy();
    let target = -1;
    let best = -1;
    occupancy.forEach((filled, idx) => {
      if (filled > best) {
        best = filled;
        target = idx;
      }
    });
    if (target === -1 || best === 0) return null;
    const cleared = board.clearRow(target);
    this.charge = 0;
    return { row: target, cleared };
  }
}
