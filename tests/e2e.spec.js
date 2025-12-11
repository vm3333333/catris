const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { test, expect } = require('@playwright/test');

const ROOT = path.join(__dirname, '..');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}/index.html`;
let server;

test.beforeAll(async () => {
  server = spawn('python3', ['-m', 'http.server', PORT], { cwd: ROOT, stdio: 'ignore' });
  await waitForServer(BASE_URL);
});

test.afterAll(() => {
  if (server && !server.killed) server.kill();
});

test('start story hides overlay and shows HUD', async ({ page }) => {
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto(BASE_URL);

  await expect(page.locator('#overlay')).toBeVisible();
  await page.getByRole('button', { name: /start story mode/i }).click();

  await expect(page.locator('#overlay')).not.toHaveClass(/show/);
  await expect(page.locator('#game-canvas')).toBeVisible();
  await expect(page.locator('#score')).toHaveText(/\d/);
  await expect(page.locator('#story-log .entry').first()).toBeVisible();

  expect(errors).toEqual([]);
});

test('pause and resume from keyboard/menu', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('button', { name: /start endless/i }).click();

  await page.keyboard.press('Escape');
  await expect(page.locator('#pause')).toHaveClass(/show/);

  await page.getByRole('button', { name: /resume/i }).click();
  await expect(page.locator('#pause')).not.toHaveClass(/show/);
});

async function waitForServer(url) {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    const ok = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.destroy();
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
    });
    if (ok) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('Local server did not start in time');
}
