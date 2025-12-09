export class Renderer {
  constructor(canvas, nextCanvas, holdCanvas, palette) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nextCanvas = nextCanvas;
    this.holdCanvas = holdCanvas;
    this.palette = palette;
  }

  setPalette(palette) {
    this.palette = palette;
  }

  render(state) {
    if (!state) return;
    const { board, activePiece, ghostPiece, flame, laserCharge } = state;
    this.drawPlayfield(board, activePiece, ghostPiece, flame, laserCharge);
    this.drawMini(this.nextCanvas, state.nextPiece, board.width, board.height);
    this.drawMini(this.holdCanvas, state.holdPiece, board.width, board.height);
  }

  drawPlayfield(board, activePiece, ghostPiece, flameLevel, laserCharge) {
    const { ctx, canvas } = this;
    const cell = canvas.width / board.width;
    canvas.height = cell * board.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(107,255,234,0.08)');
    gradient.addColorStop(1, 'rgba(255,123,63,0.12)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const heatGlow = Math.min(0.4, flameLevel * 0.6);
    if (heatGlow > 0) {
      const heat = ctx.createLinearGradient(0, canvas.height * (1 - flameLevel), 0, canvas.height);
      heat.addColorStop(0, 'rgba(255, 123, 63, 0)');
      heat.addColorStop(1, `rgba(255, 123, 63, ${0.4 + heatGlow})`);
      ctx.fillStyle = heat;
      ctx.fillRect(0, canvas.height * (1 - flameLevel), canvas.width, canvas.height);
    }

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= board.width; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * cell + 0.5, 0);
      ctx.lineTo(x * cell + 0.5, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= board.height; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell + 0.5);
      ctx.lineTo(canvas.width, y * cell + 0.5);
      ctx.stroke();
    }

    // Settled blocks
    for (let y = 0; y < board.height; y += 1) {
      for (let x = 0; x < board.width; x += 1) {
        const cellData = board.grid[y][x];
        if (cellData) {
          this.drawCell(x, y, cellData.color, cell, flameLevel > 0.55);
        }
      }
    }

    if (ghostPiece) {
      ghostPiece.cells.forEach(({ x, y }) => {
        if (y < 0) return;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      });
    }

    if (activePiece) {
      const cells = activePiece.cells;
      cells.forEach(({ x, y }) => {
        if (y < 0) return;
        this.drawCell(x, y, activePiece.color, cell, false, true);
      });
    }

    if (laserCharge >= 1) {
      ctx.strokeStyle = 'rgba(107,255,234,0.5)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(107,255,234,0.8)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(canvas.width, 6);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  drawMini(canvas, piece, boardWidth, boardHeight) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!piece) return;
    const cells = piece.cells;
    const minX = Math.min(...cells.map((c) => c.x));
    const minY = Math.min(...cells.map((c) => c.y));
    const maxX = Math.max(...cells.map((c) => c.x));
    const maxY = Math.max(...cells.map((c) => c.y));
    const spanX = maxX - minX + 1;
    const spanY = maxY - minY + 1;
    const grid = 4;
    const cell = Math.floor(canvas.width / grid);
    const padX = (grid - spanX) / 2;
    const padY = (grid - spanY) / 2;
    cells.forEach(({ x, y }) => {
      const px = (x - minX + padX) * cell;
      const py = (y - minY + padY) * cell;
      this.drawCellMini(ctx, px, py, cell, piece.color);
    });
  }

  drawCellMini(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
  }

  drawCell(x, y, color, cell, hot, highlight = false) {
    const { ctx } = this;
    const px = x * cell;
    const py = y * cell;
    const gradient = ctx.createLinearGradient(px, py, px, py + cell);
    gradient.addColorStop(0, lighten(color, 0.2));
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;

    ctx.fillRect(px, py, cell, cell);
    ctx.strokeRect(px + 0.5, py + 0.5, cell - 1, cell - 1);

    // cat ears + eyes for theme
    ctx.fillStyle = lighten(color, 0.25);
    ctx.beginPath();
    ctx.moveTo(px + cell * 0.2, py + cell * 0.35);
    ctx.lineTo(px + cell * 0.32, py + cell * 0.08);
    ctx.lineTo(px + cell * 0.44, py + cell * 0.35);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(px + cell * 0.56, py + cell * 0.35);
    ctx.lineTo(px + cell * 0.68, py + cell * 0.08);
    ctx.lineTo(px + cell * 0.8, py + cell * 0.35);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(px + cell * 0.3, py + cell * 0.55, cell * 0.14, cell * 0.14);
    ctx.fillRect(px + cell * 0.56, py + cell * 0.55, cell * 0.14, cell * 0.14);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(px + cell * 0.32, py + cell * 0.57, cell * 0.06, cell * 0.06);
    ctx.fillRect(px + cell * 0.58, py + cell * 0.57, cell * 0.06, cell * 0.06);

    if (hot) {
      ctx.strokeStyle = 'rgba(255, 123, 63, 0.55)';
      ctx.strokeRect(px + 0.5, py + 0.5, cell - 1, cell - 1);
    }
    if (highlight) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = lighten(color, 0.25);
      ctx.strokeStyle = lighten(color, 0.3);
      ctx.strokeRect(px + 0.5, py + 0.5, cell - 1, cell - 1);
      ctx.shadowBlur = 0;
    }
  }
}

function lighten(color, amount) {
  const c = parseInt(color.slice(1), 16);
  const r = Math.min(255, ((c >> 16) & 255) + Math.floor(255 * amount));
  const g = Math.min(255, ((c >> 8) & 255) + Math.floor(255 * amount));
  const b = Math.min(255, (c & 255) + Math.floor(255 * amount));
  return `rgb(${r}, ${g}, ${b})`;
}
