import { CONFIG } from './config.js';
import { Game } from './game.js';
import { Input } from './input.js';
import { Renderer } from './renderer.js';
import { UI } from './ui.js';

const canvas = document.getElementById('game-canvas');
const nextCanvas = document.getElementById('next-canvas');
const holdCanvas = document.getElementById('hold-canvas');
const ui = new UI();
const renderer = new Renderer(canvas, nextCanvas, holdCanvas, CONFIG.palette.normal);
const game = new Game(renderer, ui, { config: CONFIG });

const input = new Input({
  move: (dx) => game.move(dx),
  rotate: () => game.rotate(1),
  softDrop: () => game.softDrop(),
  hardDrop: () => game.hardDrop(),
  fireLaser: () => game.fireLaser(),
  pause: () => {
    if (game.status === 'running') game.pause();
    else if (game.status === 'paused') game.resume();
  },
});
input.attach();

ui.bindMenu((action) => {
  switch (action) {
    case 'story':
      game.start('story');
      break;
    case 'endless':
      game.start('endless');
      break;
    case 'tutorial':
      game.start('tutorial');
      break;
    case 'resume':
      game.resume();
      break;
    case 'restart':
      game.start(game.mode || 'story');
      break;
    case 'menu':
      game.pause();
      ui.showPause(false);
      ui.showOverlay(true);
      break;
    default:
      break;
  }
});

const colorblindToggle = document.getElementById('toggle-colorblind');
colorblindToggle.addEventListener('change', () => {
  game.togglePalette(colorblindToggle.checked);
});

const audioToggle = document.getElementById('toggle-audio');
audioToggle.addEventListener('change', () => {
  ui.setWarning(audioToggle.checked ? '' : 'Sound muted. (No audio yet, placeholder)');
});

window.addEventListener('resize', () => checkViewport());
checkViewport();

function checkViewport() {
  const minWidth = 1024;
  const minHeight = 600;
  const show = window.innerWidth < minWidth || window.innerHeight < minHeight;
  ui.setTinyWarning(show);
}

// Pause on tab blur
window.addEventListener('visibilitychange', () => {
  if (document.hidden && game.status === 'running') {
    game.pause();
  }
});

ui.logStory('Nova online. Tap a mode to start.');
