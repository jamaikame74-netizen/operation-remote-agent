// player.js — Player character: movement, animation, interaction, combat

import { TILE_SIZE, drawSpriteAt, drawRect, drawRectOutline } from './engine/core.js';

const SPEED = 1.5;          // pixels per frame
const ANIM_SPEED = 10;      // frames per animation frame
const ATTACK_DURATION = 12;  // frames
const ATTACK_RANGE = 20;    // pixels
const IFRAME_DURATION = 40;  // invincibility frames after hit

export class Player {
  constructor(x, y) {
    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;
    this.w = TILE_SIZE;
    this.h = TILE_SIZE;
    this.dir = 'down';
    this.frame = 0;
    this.animTimer = 0;
    this.moving = false;

    this.hp = 5;
    this.maxHp = 5;
    this.attacking = false;
    this.attackTimer = 0;
    this.iframes = 0;

    this.inventory = [];      // item type strings
    this.artifacts = [];      // collected artifact IDs
    this.equippedWeapon = null;
  }

  // ─── Movement ─────────────────────────────────────────────────

  update(input, world) {
    // Invincibility cooldown
    if (this.iframes > 0) this.iframes--;

    // Attack cooldown
    if (this.attacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) this.attacking = false;
      return; // can't move while attacking
    }

    const dx = input.moveX;
    const dy = input.moveY;
    this.moving = (dx !== 0 || dy !== 0);

    if (this.moving) {
      // Update direction
      if (dx < 0) this.dir = 'left';
      else if (dx > 0) this.dir = 'right';
      else if (dy < 0) this.dir = 'up';
      else if (dy > 0) this.dir = 'down';

      // Try move X
      const newX = this.x + dx * SPEED;
      if (world.canMove(newX, this.y, this.w, this.h)) {
        this.x = newX;
      }

      // Try move Y
      const newY = this.y + dy * SPEED;
      if (world.canMove(this.x, newY, this.w, this.h)) {
        this.y = newY;
      }

      // Animation
      this.animTimer++;
      if (this.animTimer >= ANIM_SPEED) {
        this.animTimer = 0;
        this.frame = (this.frame + 1) % 2;
      }
    } else {
      this.frame = 0;
      this.animTimer = 0;
    }
  }

  // ─── Combat ───────────────────────────────────────────────────

  startAttack() {
    if (this.attacking) return;
    this.attacking = true;
    this.attackTimer = ATTACK_DURATION;
  }

  getAttackHitbox() {
    if (!this.attacking) return null;
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    let ax = cx, ay = cy;
    if (this.dir === 'up') ay -= ATTACK_RANGE;
    if (this.dir === 'down') ay += ATTACK_RANGE;
    if (this.dir === 'left') ax -= ATTACK_RANGE;
    if (this.dir === 'right') ax += ATTACK_RANGE;
    return { x: ax - 6, y: ay - 6, w: 12, h: 12 };
  }

  getDamage() {
    let dmg = 1;
    if (this.equippedWeapon === 'sshkey') dmg = 3;
    else if (this.equippedWeapon === 'tmux') dmg = 2;
    else if (this.equippedWeapon === 'termius') dmg = 2;
    return dmg;
  }

  takeDamage(amount) {
    if (this.iframes > 0) return;
    const defense = this.inventory.includes('tailscale') ? 1 : 0;
    const dmg = Math.max(1, amount - defense);
    this.hp = Math.max(0, this.hp - dmg);
    this.iframes = IFRAME_DURATION;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  isDead() {
    return this.hp <= 0;
  }

  // ─── Inventory ────────────────────────────────────────────────

  addItem(type) {
    if (!this.inventory.includes(type)) {
      this.inventory.push(type);
      // Auto-equip weapons
      if (type === 'sshkey' || type === 'tmux' || type === 'termius') {
        if (!this.equippedWeapon || type === 'sshkey') {
          this.equippedWeapon = type;
        }
      }
    }
  }

  addArtifact(id) {
    if (!this.artifacts.includes(id)) {
      this.artifacts.push(id);
    }
  }

  hasItem(type) {
    return this.inventory.includes(type);
  }

  // ─── Rendering ────────────────────────────────────────────────

  draw(ctx, cam) {
    // Flash during iframes
    if (this.iframes > 0 && Math.floor(this.iframes / 3) % 2 === 0) return;

    const spriteKey = `player_${this.dir}_${this.frame}`;
    drawSpriteAt(ctx, spriteKey, this.x, this.y, cam);

    // Draw attack effect
    if (this.attacking) {
      const hitbox = this.getAttackHitbox();
      if (hitbox) {
        const alpha = this.attackTimer / ATTACK_DURATION;
        ctx.globalAlpha = alpha * 0.7;
        drawRect(ctx, hitbox.x - cam.x, hitbox.y - cam.y, hitbox.w, hitbox.h, '#00ff41');
        ctx.globalAlpha = 1;
      }
    }
  }

  // ─── Position Helpers ─────────────────────────────────────────

  getTileX() { return Math.floor((this.x + this.w / 2) / TILE_SIZE); }
  getTileY() { return Math.floor((this.y + this.h / 2) / TILE_SIZE); }

  setPosition(tileX, tileY) {
    this.x = tileX * TILE_SIZE;
    this.y = tileY * TILE_SIZE;
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}
