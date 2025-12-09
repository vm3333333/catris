export class StoryManager {
  constructor(script = []) {
    this.script = script;
    this.seen = new Set();
  }

  reset() {
    this.seen.clear();
  }

  check(state) {
    const unlocked = [];
    for (const item of this.script) {
      if (this.seen.has(item.id)) continue;
      if (meetsTrigger(item.trigger, state)) {
        this.seen.add(item.id);
        unlocked.push(item);
      }
    }
    return unlocked;
  }
}

function meetsTrigger(trigger, state) {
  if (!trigger) return false;
  if (trigger.lines !== undefined && state.lines < trigger.lines) return false;
  if (trigger.level !== undefined && state.level < trigger.level) return false;
  if (trigger.flame !== undefined && state.flame < trigger.flame) return false;
  return true;
}
