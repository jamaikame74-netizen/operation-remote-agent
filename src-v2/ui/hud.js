// ui/hud.js — HUD overlay: HP, inventory, minimap, area name, prompts

import { VIEWPORT_W, VIEWPORT_H, drawRect, drawText, drawRectOutline } from '../engine/core.js';
import { ITEM_DEFS } from '../data/content.js';

export class HUD {
  constructor() {
    this.message = null;
    this.messageTimer = 0;
    this.interactPrompt = null;  // { text } shown near player
  }

  showMessage(text, duration = 180) {
    this.message = text;
    this.messageTimer = duration;
  }

  showInteract(text) {
    this.interactPrompt = text;
  }

  clearInteract() {
    this.interactPrompt = null;
  }

  update() {
    if (this.messageTimer > 0) {
      this.messageTimer--;
      if (this.messageTimer <= 0) this.message = null;
    }
  }

  draw(ctx, player, questProgress, areaName) {
    // ─── HP Bar (top-left) ──────────────────────────────────
    drawRect(ctx, 4, 4, 52, 10, 'rgba(10,14,20,0.8)');
    drawRectOutline(ctx, 4, 4, 52, 10, '#1a2a1e');
    drawText(ctx, 'HP', 6, 5, '#ef4444', 6);
    const hpW = 34;
    drawRect(ctx, 16, 6, hpW, 6, '#1a2a1e');
    const hpPct = player.hp / player.maxHp;
    const hpColor = hpPct > 0.5 ? '#00ff41' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
    drawRect(ctx, 16, 6, Math.round(hpW * hpPct), 6, hpColor);

    // ─── Inventory (top-right) ──────────────────────────────
    const invX = VIEWPORT_W - 4;
    const items = player.inventory;
    for (let i = items.length - 1; i >= 0; i--) {
      const ix = invX - (items.length - i) * 18;
      const isEquipped = items[i] === player.equippedWeapon;
      drawRect(ctx, ix - 14, 4, 16, 16, 'rgba(10,14,20,0.8)');
      drawRectOutline(ctx, ix - 14, 4, 16, 16, isEquipped ? '#00ff41' : '#1a2a1e');

      // Mini icon (just first letter)
      const def = ITEM_DEFS[items[i]];
      const label = def ? def.name[0] : '?';
      const color = isEquipped ? '#00ff41' : '#5a7a60';
      drawText(ctx, label, ix - 6, 7, color, 8, 'center');
    }

    // Artifacts count
    if (player.artifacts.length > 0) {
      drawText(ctx, `★${player.artifacts.length}`, invX - items.length * 18 - 24, 7, '#a855f7', 7);
    }

    // ─── Area Name (top-center) ─────────────────────────────
    drawText(ctx, areaName, VIEWPORT_W / 2, 5, '#06d6a0', 7, 'center');

    // ─── Quest Progress (bottom-left) ───────────────────────
    const { done, total } = questProgress;
    drawRect(ctx, 4, VIEWPORT_H - 14, 80, 10, 'rgba(10,14,20,0.8)');
    drawText(ctx, `QUESTS ${done}/${total}`, 6, VIEWPORT_H - 13, '#5a7a60', 6);
    // Mini progress bar
    const qbW = 40;
    drawRect(ctx, 44, VIEWPORT_H - 12, qbW, 4, '#1a2a1e');
    drawRect(ctx, 44, VIEWPORT_H - 12, Math.round(qbW * (done / total)), 4, '#00ff41');

    // ─── Controls Hint (bottom-right) ───────────────────────
    drawText(ctx, 'WASD:Move E:Act ␣:Atk', VIEWPORT_W - 4, VIEWPORT_H - 8, '#3a5a40', 5, 'right');

    // ─── Interact Prompt ────────────────────────────────────
    if (this.interactPrompt) {
      const pw = this.interactPrompt.length * 4 + 12;
      const px = VIEWPORT_W / 2 - pw / 2;
      const py = VIEWPORT_H - 28;
      drawRect(ctx, px, py, pw, 12, 'rgba(10,14,20,0.9)');
      drawRectOutline(ctx, px, py, pw, 12, '#00ff41');
      drawText(ctx, this.interactPrompt, VIEWPORT_W / 2, py + 3, '#00ff41', 6, 'center');
    }

    // ─── Toast Message ──────────────────────────────────────
    if (this.message) {
      const alpha = Math.min(1, this.messageTimer / 30);
      ctx.globalAlpha = alpha;
      const mw = this.message.length * 4.5 + 16;
      const mx = VIEWPORT_W / 2 - mw / 2;
      const my = 24;
      drawRect(ctx, mx, my, mw, 14, 'rgba(0,255,65,0.15)');
      drawRectOutline(ctx, mx, my, mw, 14, '#00ff41');
      drawText(ctx, this.message, VIEWPORT_W / 2, my + 4, '#00ff41', 7, 'center');
      ctx.globalAlpha = 1;
    }
  }
}
