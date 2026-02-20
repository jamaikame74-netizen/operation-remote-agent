// entities.js — NPCs, items, enemies for the current area

import { TILE_SIZE, drawSpriteAt, drawText, drawRect } from './engine/core.js';
import { ITEM_DEFS } from './data/content.js';

// ─── Items (ground pickups) ─────────────────────────────────────

export class ItemEntity {
  constructor(data) {
    this.x = data.x * TILE_SIZE;
    this.y = data.y * TILE_SIZE;
    this.type = data.type;
    this.questId = data.questId || null;
    this.artifactId = data.id || null;
    this.collected = false;
    this.bobTimer = Math.random() * 100;
    this.def = ITEM_DEFS[this.type] || { name: this.type, desc: '' };
  }

  update() {
    this.bobTimer += 0.05;
  }

  draw(ctx, cam) {
    if (this.collected) return;
    const bob = Math.sin(this.bobTimer) * 2;
    const spriteKey = 'item_' + this.type;
    drawSpriteAt(ctx, spriteKey, this.x, this.y + bob, cam);

    // Glow effect
    const gx = this.x - cam.x + TILE_SIZE / 2;
    const gy = this.y - cam.y + TILE_SIZE / 2 + bob;
    const glow = 4 + Math.sin(this.bobTimer * 2) * 2;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(gx, gy, glow + 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff41';
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  overlaps(px, py, pw, ph) {
    if (this.collected) return false;
    return px < this.x + TILE_SIZE && px + pw > this.x &&
           py < this.y + TILE_SIZE && py + ph > this.y;
  }
}

// ─── NPC (interactive) ──────────────────────────────────────────

export class NPCEntity {
  constructor(data) {
    this.x = data.x * TILE_SIZE;
    this.y = data.y * TILE_SIZE;
    this.sprite = data.sprite;
    this.name = data.name;
    this.dialogId = data.dialog;
    this.bobTimer = Math.random() * 100;
  }

  update() {
    this.bobTimer += 0.02;
  }

  draw(ctx, cam) {
    drawSpriteAt(ctx, 'npc_' + this.sprite, this.x, this.y, cam);

    // Name label
    const nx = this.x - cam.x + TILE_SIZE / 2;
    const ny = this.y - cam.y - 6;
    drawText(ctx, this.name, nx, ny, '#06d6a0', 6, 'center');

    // Interaction prompt (bouncing exclamation)
    const bounce = Math.sin(this.bobTimer * 3) * 2;
    drawText(ctx, '!', nx, ny - 8 + bounce, '#f59e0b', 7, 'center');
  }

  isNear(px, py, range = TILE_SIZE * 1.5) {
    const dx = (px + TILE_SIZE / 2) - (this.x + TILE_SIZE / 2);
    const dy = (py + TILE_SIZE / 2) - (this.y + TILE_SIZE / 2);
    return Math.sqrt(dx * dx + dy * dy) < range;
  }
}

// ─── Enemy ──────────────────────────────────────────────────────

export class EnemyEntity {
  constructor(data) {
    this.x = data.x * TILE_SIZE;
    this.y = data.y * TILE_SIZE;
    this.startX = this.x;
    this.startY = this.y;
    this.type = data.type;
    this.hp = data.hp;
    this.maxHp = data.hp;
    this.label = data.label;
    this.dead = false;
    this.frame = 0;
    this.animTimer = 0;

    // Simple patrol behavior
    this.patrolDir = 1;
    this.patrolDist = 0;
    this.patrolMax = 32 + Math.random() * 32;
    this.speed = 0.3 + Math.random() * 0.3;
    this.moveAxis = Math.random() > 0.5 ? 'x' : 'y';
    this.aggroRange = TILE_SIZE * 4;
    this.attackCooldown = 0;
  }

  update(playerX, playerY) {
    if (this.dead) return;

    // Animation
    this.animTimer++;
    if (this.animTimer >= 20) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % 2;
    }

    // Attack cooldown
    if (this.attackCooldown > 0) this.attackCooldown--;

    // Simple AI: patrol or chase
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.aggroRange) {
      // Chase player
      const nx = dx / dist * this.speed;
      const ny = dy / dist * this.speed;
      this.x += nx;
      this.y += ny;
    } else {
      // Patrol
      if (this.moveAxis === 'x') {
        this.x += this.patrolDir * this.speed * 0.5;
      } else {
        this.y += this.patrolDir * this.speed * 0.5;
      }
      this.patrolDist += this.speed * 0.5;
      if (this.patrolDist >= this.patrolMax) {
        this.patrolDist = 0;
        this.patrolDir *= -1;
      }
    }
  }

  draw(ctx, cam) {
    if (this.dead) return;

    const spriteKey = `enemy_${this.type}_${this.frame}`;
    drawSpriteAt(ctx, spriteKey, this.x, this.y, cam);

    // HP bar
    const bx = this.x - cam.x;
    const by = this.y - cam.y - 5;
    const bw = TILE_SIZE;
    const bh = 2;
    drawRect(ctx, bx, by, bw, bh, '#1a2a1e');
    const hpPct = this.hp / this.maxHp;
    drawRect(ctx, bx, by, Math.round(bw * hpPct), bh, hpPct > 0.3 ? '#ef4444' : '#ff0000');

    // Label
    const lx = this.x - cam.x + TILE_SIZE / 2;
    const ly = this.y - cam.y - 10;
    drawText(ctx, this.label, lx, ly, '#ef4444', 5, 'center');
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
    }
  }

  overlaps(px, py, pw, ph) {
    if (this.dead) return false;
    return px < this.x + TILE_SIZE && px + pw > this.x &&
           py < this.y + TILE_SIZE && py + ph > this.y;
  }

  overlapsRect(rx, ry, rw, rh) {
    if (this.dead) return false;
    return rx < this.x + TILE_SIZE && rx + rw > this.x &&
           ry < this.y + TILE_SIZE && ry + rh > this.y;
  }

  canAttack() {
    return !this.dead && this.attackCooldown <= 0;
  }

  doAttack() {
    this.attackCooldown = 60; // 1 second cooldown
  }
}

// ─── Entity Manager ─────────────────────────────────────────────

export class EntityManager {
  constructor() {
    this.items = [];
    this.npcs = [];
    this.enemies = [];
  }

  loadArea(areaData, collectedItems, defeatedEnemies) {
    this.items = (areaData.items || []).map(d => {
      const item = new ItemEntity(d);
      const key = `${areaData.id}_${d.x}_${d.y}`;
      if (collectedItems.has(key)) item.collected = true;
      return item;
    });

    this.npcs = (areaData.npcs || []).map(d => new NPCEntity(d));

    this.enemies = (areaData.enemies || []).map(d => {
      const enemy = new EnemyEntity(d);
      const key = `${areaData.id}_${d.x}_${d.y}`;
      if (defeatedEnemies.has(key)) enemy.dead = true;
      return enemy;
    });
  }

  update(playerX, playerY) {
    this.items.forEach(i => i.update());
    this.npcs.forEach(n => n.update());
    this.enemies.forEach(e => e.update(playerX, playerY));
  }

  draw(ctx, cam) {
    this.items.forEach(i => i.draw(ctx, cam));
    this.npcs.forEach(n => n.draw(ctx, cam));
    this.enemies.forEach(e => e.draw(ctx, cam));
  }
}
