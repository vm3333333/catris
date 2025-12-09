import { Board } from './board.js';
import { CONFIG } from './config.js';
import { FlameSystem } from './flameSystem.js';
import { LaserSystem } from './laserSystem.js';
import { PieceBag, createPiece, getCells, rotateIndex } from './piece.js';
import { StoryManager } from './storyManager.js';

export class Game {
  constructor(renderer, ui, options = {}) {
    this.renderer = renderer;
    this.ui = ui;
    this.config = { ...CONFIG, ...(options.config || {}) };
    this.palette = this.config.palette.normal;
    this.mode = 'menu';
    this.status = 'menu';
    this.loopHandle = null;
    this.lastTime = 0;
    this._setup();
  }

  _setup() {
    this.board = new Board(this.config.board.width, this.config.board.height);
    this.flames = new FlameSystem(this.config.flame);
    this.laser = new LaserSystem(this.config.laser);
    this.story = new StoryManager(this.config.story);
    this.bag = new PieceBag();

    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.piecesSinceClear = 0;
    this.combo = 0;
    this.nextPiece = null;
    this.holdPiece = null;
    this.holdUsed = false;
    this.activePiece = null;
    this.ghostPiece = null;
    this.dropInterval = this.config.drop.baseInterval;
    this.dropTimer = 0;
  }

  start(mode = 'story') {
    if (this.loopHandle) cancelAnimationFrame(this.loopHandle);
    this.mode = mode;
    this.status = 'running';
    this._setup();
    if (mode === 'tutorial') {
      this.dropInterval += 300;
    }
    this.spawnPiece();
    this.ui.showOverlay(false);
    this.ui.showPause(false);
    this.ui.setWarning('');
    this.story.reset();
    this.checkStory();
    this.render();
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  _loop = (timestamp) => {
    if (this.status !== 'running') return;
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.update(delta);
    this.render();
    this.loopHandle = requestAnimationFrame(this._loop);
  };

  pause() {
    if (this.status !== 'running') return;
    this.status = 'paused';
    this.ui.showPause(true);
    if (this.loopHandle) cancelAnimationFrame(this.loopHandle);
  }

  resume() {
    if (this.status !== 'paused') return;
    this.status = 'running';
    this.ui.showPause(false);
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  update(delta) {
    this.dropTimer += delta;
    if (this.dropTimer >= this.dropInterval) {
      this.softDrop();
      this.dropTimer = 0;
    }
  }

  render() {
    this.renderer.render({
      board: this.board,
      activePiece: this.decoratePiece(this.activePiece),
      ghostPiece: this.ghostPiece,
      nextPiece: this.decoratePiece(this.nextPiece, true),
      holdPiece: this.decoratePiece(this.holdPiece, true),
      flame: this.flames.level,
      laserCharge: this.laser.charge,
    });
    this.ui.updateHUD({
      score: this.score,
      level: this.level,
      lines: this.lines,
      flame: this.flames.level,
      laser: this.laser.charge,
    });
  }

  decoratePiece(piece, miniature = false) {
    if (!piece) return null;
    const cells = getCells(piece);
    return { ...piece, cells: cells.map((c) => ({ ...c })) };
  }

  spawnPiece() {
    const type = this.nextPiece?.type || this.bag.next();
    const spawn = createPiece(type, this.palette, this.config.board.spawnX, this.config.board.spawnY);
    this.activePiece = spawn;
    const nextType = this.bag.next();
    this.nextPiece = createPiece(nextType, this.palette, 1, 1);
    this.holdUsed = false;
    this.updateGhost();
    if (this.board.collides(this.activePiece)) {
      this.gameOver();
    }
  }

  updateGhost() {
    if (!this.activePiece) return;
    const ghost = { ...this.activePiece };
    while (!this.board.collides(ghost, { y: ghost.y + 1 })) {
      ghost.y += 1;
    }
    this.ghostPiece = { ...ghost, cells: getCells(ghost) };
  }

  move(dx) {
    if (this.status !== 'running' || !this.activePiece) return;
    const candidate = { ...this.activePiece, x: this.activePiece.x + dx };
    if (!this.board.collides(candidate)) {
      this.activePiece = candidate;
      this.updateGhost();
      this.dropTimer = 0;
    }
  }

  rotate(dir = 1) {
    if (this.status !== 'running' || !this.activePiece) return;
    const rotation = rotateIndex(this.activePiece, dir);
    const candidate = { ...this.activePiece, rotation };
    if (!this.board.collides(candidate)) {
      this.activePiece = candidate;
    } else if (!this.board.collides(candidate, { x: candidate.x - 1 })) {
      candidate.x -= 1;
      this.activePiece = candidate;
    } else if (!this.board.collides(candidate, { x: candidate.x + 1 })) {
      candidate.x += 1;
      this.activePiece = candidate;
    }
    this.updateGhost();
  }

  softDrop() {
    if (!this.activePiece) return;
    const candidate = { ...this.activePiece, y: this.activePiece.y + 1 };
    if (!this.board.collides(candidate)) {
      this.activePiece = candidate;
      this.score += this.config.scoring.softDrop;
      this.updateGhost();
    } else {
      this.lockPiece();
    }
  }

  hardDrop() {
    if (!this.activePiece) return;
    let dropped = 0;
    while (!this.board.collides(this.activePiece, { y: this.activePiece.y + 1 })) {
      this.activePiece.y += 1;
      dropped += 1;
    }
    this.score += dropped * this.config.scoring.hardDrop;
    this.lockPiece();
  }

  lockPiece() {
    this.board.place(this.activePiece);
    const cleared = this.board.clearLines();
    const holes = this.board.countHoles();
    if (cleared > 0) {
      this.lines += cleared;
      this.score += this.config.scoring.lines[cleared] || 0;
      this.score += this.combo * this.config.scoring.comboBonus;
      this.combo += 1;
      this.piecesSinceClear = 0;
    } else {
      this.combo = 0;
      this.piecesSinceClear += 1;
    }

    this.flames.onPieceLocked({
      holes,
      linesCleared: cleared,
      droughtPieces: this.piecesSinceClear,
    });

    this.laser.addLines(cleared);

    this.level = 1 + Math.floor(this.lines / this.config.level.threshold);
    this.dropInterval = Math.max(
      this.config.drop.minInterval,
      this.config.drop.baseInterval - (this.level - 1) * this.config.drop.levelStep,
    );

    this.spawnPiece();
    this.checkStory();
    this.updateHeatWarning();
    this.dropTimer = 0;
    this.render();
  }

  fireLaser() {
    if (this.status !== 'running') return;
    if (!this.laser.canFire()) {
      this.ui.setWarning('Laser not charged. Clear lines to power up.');
      return;
    }
    const result = this.laser.fire(this.board);
    if (result) {
      this.score += this.config.scoring.laserBonus;
      this.lines += 1;
      this.level = 1 + Math.floor(this.lines / this.config.level.threshold);
      this.dropInterval = Math.max(
        this.config.drop.minInterval,
        this.config.drop.baseInterval - (this.level - 1) * this.config.drop.levelStep,
      );
      this.flames.level = Math.max(0, this.flames.level - 0.15);
      this.ui.setWarning('');
      this.checkStory();
      this.updateHeatWarning();
    }
    this.render();
  }

  checkStory() {
    if (this.mode === 'endless') return;
    const unlocked = this.story.check({ lines: this.lines, level: this.level, flame: this.flames.level });
    unlocked.forEach((item) => {
      this.ui.logStory(item.text);
      this.ui.showDialog(item.text);
    });
  }

  togglePalette(colorblind) {
    this.palette = colorblind ? this.config.palette.colorblind : this.config.palette.normal;
    this.renderer.setPalette(this.palette);
    if (this.activePiece) this.activePiece.color = this.palette[this.activePiece.type];
    if (this.nextPiece) this.nextPiece.color = this.palette[this.nextPiece.type];
    if (this.holdPiece) this.holdPiece.color = this.palette[this.holdPiece.type];
    this.render();
  }

  setMode(mode) {
    this.mode = mode;
  }

  gameOver() {
    this.status = 'over';
    this.ui.showOverlay(true);
    this.ui.setWarning('Grid overflow. The flames breach the skyline.');
  }

  updateHeatWarning() {
    if (this.flames.level >= 0.99) {
      this.gameOver();
      this.ui.setWarning('Flames breached the skyline. Nova lost this round.');
      return;
    }
    if (this.flames.level > 0.7) {
      this.ui.setWarning('Heat critical! Clear lines or fire the laser.');
    } else {
      this.ui.setWarning('');
    }
  }
}
