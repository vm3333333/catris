export class FlameSystem {
  constructor(config) {
    this.config = config;
    this.level = 0;
  }

  reset() {
    this.level = 0;
  }

  onPieceLocked({ holes, linesCleared, droughtPieces }) {
    let delta = this.config.baseRise;
    if (linesCleared > 0) {
      delta -= this.config.clearReward;
      if (linesCleared > 1) {
        delta -= this.config.multiReward * (linesCleared - 1);
      }
    } else {
      delta += holes * this.config.holePenalty;
      delta += Math.min(droughtPieces, 4) * this.config.droughtPenalty;
    }
    this.level = clamp(this.level + delta, this.config.clamp[0], this.config.clamp[1]);
    return this.level;
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
