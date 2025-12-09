export class Input {
  constructor(actions) {
    this.actions = actions;
    this.enabled = true;
    this.keyHandler = (e) => this.onKey(e);
  }

  attach() {
    window.addEventListener('keydown', this.keyHandler);
  }

  detach() {
    window.removeEventListener('keydown', this.keyHandler);
  }

  setEnabled(flag) {
    this.enabled = flag;
  }

  onKey(event) {
    if (!this.enabled) return;
    const key = event.code;
    switch (key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.actions.move?.(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.actions.move?.(1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.actions.softDrop?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.actions.rotate?.(1);
        break;
      case 'Space':
        event.preventDefault();
        this.actions.hardDrop?.();
        break;
      case 'KeyL':
        event.preventDefault();
        this.actions.fireLaser?.();
        break;
      case 'Escape':
        this.actions.pause?.();
        break;
      default:
        break;
    }
  }
}
