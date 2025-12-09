export class UI {
  constructor() {
    this.scoreEl = document.getElementById('score');
    this.levelEl = document.getElementById('level');
    this.linesEl = document.getElementById('lines');
    this.flameBar = document.getElementById('flame-bar');
    this.laserBar = document.getElementById('laser-bar');
    this.overlay = document.getElementById('overlay');
    this.pauseOverlay = document.getElementById('pause');
    this.storyLog = document.getElementById('story-log');
    this.dialog = document.getElementById('dialog');
    this.dialogText = document.getElementById('dialog-text');
    this.dialogClose = document.getElementById('dialog-close');
    this.warning = document.getElementById('warning');
    this.tinyWarning = document.getElementById('tiny-warning');

    this.dialogClose.addEventListener('click', () => this.hideDialog());
  }

  bindMenu(handler) {
    this.overlay.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => handler(btn.dataset.action));
    });
    this.pauseOverlay.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => handler(btn.dataset.action));
    });
  }

  updateHUD({ score, level, lines, flame, laser }) {
    this.scoreEl.textContent = score;
    this.levelEl.textContent = level;
    this.linesEl.textContent = lines;
    this.flameBar.style.width = `${Math.min(1, flame) * 100}%`;
    this.laserBar.style.width = `${Math.min(1, laser) * 100}%`;
  }

  showOverlay(show = true) {
    this.overlay.classList.toggle('show', show);
  }

  showPause(show = true) {
    this.pauseOverlay.classList.toggle('show', show);
  }

  showDialog(text) {
    this.dialogText.textContent = text;
    this.dialog.classList.remove('hidden');
    requestAnimationFrame(() => this.dialog.classList.add('show'));
  }

  hideDialog() {
    this.dialog.classList.remove('show');
    setTimeout(() => this.dialog.classList.add('hidden'), 150);
  }

  logStory(text) {
    if (!text) return;
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `<strong>Nova:</strong> ${text}`;
    this.storyLog.appendChild(div);
    this.storyLog.scrollTop = this.storyLog.scrollHeight;
  }

  setWarning(text) {
    if (!text) {
      this.warning.style.display = 'none';
      return;
    }
    this.warning.textContent = text;
    this.warning.style.display = 'block';
  }

  setTinyWarning(show) {
    this.tinyWarning.classList.toggle('hidden', !show);
  }
}
