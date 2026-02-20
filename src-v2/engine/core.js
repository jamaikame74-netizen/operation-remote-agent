// engine/core.js — Canvas setup, sprite baking, rendering utils, camera, input

import { PALETTE, TILES, TILE_SPRITES, PLAYER, ITEMS, ENEMIES, NPCS, PROJECTILES } from '../data/sprites.js';

export const TILE_SIZE = 16;
export const VIEWPORT_W = 320;  // 20 tiles wide
export const VIEWPORT_H = 240;  // 15 tiles tall
export const SCALE = 2;         // CSS scale for crisp pixels

// ─── Sprite Cache (baked to ImageData) ─────────────────────────

const spriteCache = new Map();
const offCanvas = document.createElement('canvas');
offCanvas.width = 16;
offCanvas.height = 16;
const offCtx = offCanvas.getContext('2d');

/** Bake a string[] sprite definition into an ImageBitmap. */
function bakeSprite(rows) {
  const h = rows.length;
  const w = rows[0].length;
  offCanvas.width = w;
  offCanvas.height = h;
  offCtx.clearRect(0, 0, w, h);
  const imgData = offCtx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      const color = PALETTE[ch];
      if (!color) continue;
      const idx = (y * w + x) * 4;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      imgData.data[idx] = r;
      imgData.data[idx + 1] = g;
      imgData.data[idx + 2] = b;
      imgData.data[idx + 3] = 255;
    }
  }

  offCtx.putImageData(imgData, 0, 0);
  // Return the canvas content as a pattern source
  const baked = document.createElement('canvas');
  baked.width = w;
  baked.height = h;
  baked.getContext('2d').drawImage(offCanvas, 0, 0);
  return baked;
}

/** Get or bake a cached sprite. */
export function getSprite(key, rows) {
  if (!spriteCache.has(key)) {
    spriteCache.set(key, bakeSprite(rows));
  }
  return spriteCache.get(key);
}

/** Pre-bake all sprites on init. */
export function bakeAllSprites() {
  // Tiles
  for (const [id, key] of Object.entries(TILE_SPRITES)) {
    const data = TILES[key];
    if (data) getSprite('tile_' + id, data);
  }
  // Player
  for (const [dir, frames] of Object.entries(PLAYER)) {
    frames.forEach((frame, i) => getSprite(`player_${dir}_${i}`, frame));
  }
  // Items
  for (const [key, data] of Object.entries(ITEMS)) {
    getSprite('item_' + key, data);
  }
  // Enemies
  for (const [key, frames] of Object.entries(ENEMIES)) {
    frames.forEach((frame, i) => getSprite(`enemy_${key}_${i}`, frame));
  }
  // NPCs
  for (const [key, data] of Object.entries(NPCS)) {
    getSprite('npc_' + key, data);
  }
  // Projectiles
  for (const [key, data] of Object.entries(PROJECTILES)) {
    getSprite('proj_' + key, data);
  }
}

// ─── Camera ────────────────────────────────────────────────────

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  follow(targetX, targetY, mapW, mapH) {
    // Center on target
    this.x = targetX - VIEWPORT_W / 2 + TILE_SIZE / 2;
    this.y = targetY - VIEWPORT_H / 2 + TILE_SIZE / 2;
    // Clamp to map bounds
    this.x = Math.max(0, Math.min(this.x, mapW * TILE_SIZE - VIEWPORT_W));
    this.y = Math.max(0, Math.min(this.y, mapH * TILE_SIZE - VIEWPORT_H));
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }
}

// ─── Input Handler ─────────────────────────────────────────────

export class Input {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this._prev = {};

    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      // Prevent scrolling on arrow keys and space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  update() {
    // Calculate justPressed (true only on the frame the key first goes down)
    for (const key of Object.keys(this.keys)) {
      this.justPressed[key] = this.keys[key] && !this._prev[key];
    }
    this._prev = { ...this.keys };
  }

  isDown(key) { return !!this.keys[key.toLowerCase()]; }
  isJust(key) { return !!this.justPressed[key.toLowerCase()]; }

  // Directional helpers
  get moveX() {
    let x = 0;
    if (this.isDown('a') || this.isDown('arrowleft')) x -= 1;
    if (this.isDown('d') || this.isDown('arrowright')) x += 1;
    return x;
  }
  get moveY() {
    let y = 0;
    if (this.isDown('w') || this.isDown('arrowup')) y -= 1;
    if (this.isDown('s') || this.isDown('arrowdown')) y += 1;
    return y;
  }
  get interact() { return this.isJust('e'); }
  get attack()   { return this.isJust(' '); }
  get escape()   { return this.isJust('escape'); }
}

// ─── Canvas Setup ──────────────────────────────────────────────

export function createCanvas() {
  const canvas = document.getElementById('gameCanvas');
  canvas.width = VIEWPORT_W;
  canvas.height = VIEWPORT_H;
  canvas.style.width = (VIEWPORT_W * SCALE) + 'px';
  canvas.style.height = (VIEWPORT_H * SCALE) + 'px';
  canvas.style.imageRendering = 'pixelated';

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  return { canvas, ctx };
}

// ─── Draw Helpers ──────────────────────────────────────────────

export function drawSpriteAt(ctx, spriteKey, x, y, cam) {
  const sprite = spriteCache.get(spriteKey);
  if (!sprite) return;
  ctx.drawImage(sprite, Math.round(x - cam.x), Math.round(y - cam.y));
}

export function drawText(ctx, text, x, y, color = '#00ff41', size = 8, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${size}px monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
}

export function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

export function drawRectOutline(ctx, x, y, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, w - 1, h - 1);
}
