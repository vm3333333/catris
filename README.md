# Catris: Neon Inferno

Neon Tetris with cats, flames, and lasers. Stack cat-shaped tetrominoes, keep the flame meter low, and charge up lasers to purge messy rows.

## Play it locally

- Clone the repo.
- Open `index.html` directly in a modern browser **or** serve the folder:
  - `python3 -m http.server 8000`
  - visit `http://localhost:8000`
- Desktop controls: ←/→ move, ↑ rotate, ↓ soft drop, **Space** hard drop, **L** fire laser, **Esc** pause.
- Use the main menu overlay to choose Story, Endless, or Tutorial. Toggle the colorblind palette in the menu.

## Deploy to Vercel (static)

This is a static site; no build step required.

1) Install the Vercel CLI if you want to deploy from terminal: `npm i -g vercel`  
2) From the repo root, run: `vercel --prod`  
   - When prompted, set **framework** to “Other” / static, and root to `.`.  
   - Vercel will serve `index.html` with `styles.css` and `src/` as-is.  
3) Or use the Vercel dashboard: “Add New Project” → “Import” this repo → Framework “Other” → Output Directory `.` → Deploy.

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

## Roadmap / next steps (from original concept)

- Add audio: line-clear/laser/flame cues plus mute toggle in settings.
- Improve onboarding: guided tutorial tasks, on-screen controls for touch.
- Expand story mode: more chapters, background swaps, and laser upgrades.
- Refine flame/laser balancing: tweak holes/drought penalties and rewards.
- Persistence: localStorage for highscores, settings, last mode played.
- Visual polish: icon-based HUD accents, SVG cats, subtle animations on overlays.
