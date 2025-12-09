# Catris: Neon Inferno

Neon Tetris with cats, flames, and lasers. Stack cat-shaped tetrominoes, keep the flame meter low, and charge up lasers to purge messy rows.

## Play it locally

- Clone the repo.
- Open `index.html` directly in a modern browser **or** serve the folder:
  - `python3 -m http.server 8000`
  - visit `http://localhost:8000`
- Desktop controls: ←/→ move, ↑ rotate, ↓ soft drop, **Space** hard drop, **L** fire laser, **Esc** pause.
- Use the main menu overlay to choose Story, Endless, or Tutorial. Toggle the colorblind palette in the menu.

## Game systems

- **Grid & bag RNG:** Standard 10×20 well with 7-piece bag.
- **Flame meter:** Rises on holes/droughts, drops on clears; game over at max heat.
- **Laser meter:** Charges on line clears; press **L** to vaporize the densest row and cool the grid.
- **Scoring/level:** Line clears + combos + drops; speed increases with level; ghost piece and hold slot included.
- **Story beats:** Lightweight dialog triggers on milestones (disabled in Endless).

## Notes

- Built with vanilla HTML/CSS/JS and a single canvas for the playfield.
- Best on desktop; shows a small warning on very small viewports.
- Color palettes and tuning live in `src/config.js` for easy tweaking.
