// world.js — Tile map rendering, collision detection, area management

import { TILE_SIZE, VIEWPORT_W, VIEWPORT_H, drawSpriteAt } from './engine/core.js';
import { AREAS, AREA_ORDER } from './data/maps.js';
import { SOLID_TILES, INTERACTIVE_TILES, TILE_INDEX } from './data/sprites.js';

export class World {
  constructor() {
    this.currentArea = null;
    this.areaData = null;
  }

  loadArea(areaId) {
    this.areaData = AREAS[areaId];
    this.currentArea = areaId;
    return this.areaData;
  }

  // ─── Rendering ────────────────────────────────────────────────

  draw(ctx, cam) {
    if (!this.areaData) return;
    const { tiles, width, height } = this.areaData;

    // Only draw visible tiles (culling)
    const startCol = Math.max(0, Math.floor(cam.x / TILE_SIZE) - 1);
    const endCol = Math.min(width, Math.ceil((cam.x + VIEWPORT_W) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(cam.y / TILE_SIZE) - 1);
    const endRow = Math.min(height, Math.ceil((cam.y + VIEWPORT_H) / TILE_SIZE) + 1);

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tileId = tiles[row]?.[col];
        if (tileId === undefined || tileId === 0) continue;

        const px = col * TILE_SIZE;
        const py = row * TILE_SIZE;
        drawSpriteAt(ctx, 'tile_' + tileId, px, py, cam);
      }
    }
  }

  // ─── Collision ────────────────────────────────────────────────

  isSolid(tileX, tileY) {
    if (!this.areaData) return true;
    const { tiles, width, height } = this.areaData;
    if (tileX < 0 || tileX >= width || tileY < 0 || tileY >= height) return true;
    const tileId = tiles[tileY]?.[tileX];
    return SOLID_TILES.has(tileId);
  }

  /** Check if a pixel-based bounding box collides with solid tiles. */
  canMove(x, y, w, h) {
    // Check all 4 corners of the bounding box
    const margin = 2; // small collision margin
    const left = x + margin;
    const right = x + w - margin - 1;
    const top = y + margin;
    const bottom = y + h - margin - 1;

    const tl = this.isSolid(Math.floor(left / TILE_SIZE), Math.floor(top / TILE_SIZE));
    const tr = this.isSolid(Math.floor(right / TILE_SIZE), Math.floor(top / TILE_SIZE));
    const bl = this.isSolid(Math.floor(left / TILE_SIZE), Math.floor(bottom / TILE_SIZE));
    const br = this.isSolid(Math.floor(right / TILE_SIZE), Math.floor(bottom / TILE_SIZE));

    return !tl && !tr && !bl && !br;
  }

  // ─── Interaction ──────────────────────────────────────────────

  /** Get the tile in front of the player (based on facing direction). */
  getFacingTile(px, py, dir) {
    const cx = Math.floor((px + TILE_SIZE / 2) / TILE_SIZE);
    const cy = Math.floor((py + TILE_SIZE / 2) / TILE_SIZE);

    let tx = cx, ty = cy;
    if (dir === 'up') ty -= 1;
    if (dir === 'down') ty += 1;
    if (dir === 'left') tx -= 1;
    if (dir === 'right') tx += 1;

    const tileId = this.areaData?.tiles[ty]?.[tx];
    return { tx, ty, tileId, interactive: INTERACTIVE_TILES.has(tileId) };
  }

  /** Check if player is on a door tile. */
  getDoor(px, py) {
    const tx = Math.floor((px + TILE_SIZE / 2) / TILE_SIZE);
    const ty = Math.floor((py + TILE_SIZE / 2) / TILE_SIZE);

    if (!this.areaData) return null;
    return this.areaData.doors.find(d => d.x === tx && d.y === ty) || null;
  }

  // ─── Queries ──────────────────────────────────────────────────

  getMapPixelSize() {
    if (!this.areaData) return { w: 0, h: 0 };
    return {
      w: this.areaData.width * TILE_SIZE,
      h: this.areaData.height * TILE_SIZE,
    };
  }

  getAreaName() {
    return this.areaData?.name || '';
  }
}
