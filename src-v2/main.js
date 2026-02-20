// main.js — Game boot, main loop, screen management, game logic

import { createCanvas, bakeAllSprites, Camera, Input, TILE_SIZE, VIEWPORT_W, VIEWPORT_H, drawRect, drawText } from './engine/core.js';
import { World } from './world.js';
import { Player } from './player.js';
import { EntityManager } from './entities.js';
import { HUD } from './ui/hud.js';
import { DialogUI } from './ui/dialog.js';
import { GameState } from './state.js';
import { QUESTS, ITEM_DEFS, NARRATIVE } from './data/content.js';
import { AREAS } from './data/maps.js';

// ─── Game State ─────────────────────────────────────────────────
let ctx, canvas;
let camera, input, world, player, entities, hud, dialog, state;
let screen = 'title'; // 'title' | 'game' | 'victory' | 'dead'
let titleTimer = 0;
let typewriterLine = 0;
let typewriterChar = 0;
let typewriterTimer = 0;
let typewriterDone = false;
let deathTimer = 0;

// ─── Init ───────────────────────────────────────────────────────
function init() {
  bakeAllSprites();
  ({ canvas, ctx } = createCanvas());

  camera = new Camera();
  input = new Input();
  world = new World();
  entities = new EntityManager();
  hud = new HUD();
  dialog = new DialogUI();
  state = new GameState();
  player = new Player(0, 0);

  // Restore player state from save
  player.inventory = [...state.playerItems];
  player.artifacts = [...state.playerArtifacts];
  player.hp = state.playerHp;
  if (player.inventory.includes('sshkey')) player.equippedWeapon = 'sshkey';
  else if (player.inventory.includes('tmux')) player.equippedWeapon = 'tmux';

  // Decide starting screen
  if (state.gameComplete) {
    screen = 'victory';
    document.getElementById('titleScreen').classList.remove('active');
    document.getElementById('victoryOverlay').classList.add('active');
  } else if (state.briefingSeen) {
    screen = 'game';
    document.getElementById('titleScreen').classList.remove('active');
    loadArea(state.currentArea);
  } else {
    screen = 'title';
  }

  // Wire overlay buttons
  document.getElementById('startBtn')?.addEventListener('click', startGame);
  document.getElementById('restartBtn2')?.addEventListener('click', resetGame);
  document.getElementById('respawnBtn')?.addEventListener('click', respawn);

  // Main loop
  requestAnimationFrame(loop);
}

function startGame() {
  state.briefingSeen = true;
  state.save();
  screen = 'game';
  document.getElementById('titleScreen').classList.remove('active');
  loadArea('mac-lab');
}

function resetGame() {
  state.reset();
  player = new Player(0, 0);
  screen = 'title';
  document.getElementById('victoryOverlay').classList.remove('active');
  document.getElementById('titleScreen').classList.add('active');
  typewriterLine = 0;
  typewriterChar = 0;
  typewriterDone = false;
}

function respawn() {
  player.hp = player.maxHp;
  state.playerHp = player.hp;
  state.save();
  screen = 'game';
  document.getElementById('deathOverlay').classList.remove('active');
  loadArea(state.currentArea);
}

// ─── Area Loading ───────────────────────────────────────────────
function loadArea(areaId) {
  const areaData = world.loadArea(areaId);
  if (!areaData) return;

  player.setPosition(areaData.playerStart.x, areaData.playerStart.y);
  entities.loadArea(areaData, state.collectedItems, state.defeatedEnemies);
  state.currentArea = areaId;
  state.save();

  hud.showMessage(areaData.name, 120);
}

function transitionArea(door) {
  state.playerHp = player.hp;
  state.playerItems = [...player.inventory];
  state.playerArtifacts = [...player.artifacts];
  state.save();

  const areaData = world.loadArea(door.target);
  if (!areaData) return;

  player.setPosition(door.spawnX, door.spawnY);
  entities.loadArea(areaData, state.collectedItems, state.defeatedEnemies);
  state.currentArea = door.target;
  state.save();

  hud.showMessage(areaData.name, 120);
}

// ─── Main Loop ──────────────────────────────────────────────────
function loop() {
  input.update();

  switch (screen) {
    case 'title':  updateTitle(); drawTitle(); break;
    case 'game':   updateGame();  drawGame();  break;
    case 'victory': drawVictory(); break;
    case 'dead':   updateDead(); break;
  }

  requestAnimationFrame(loop);
}

// ─── Title Screen ───────────────────────────────────────────────
function updateTitle() {
  titleTimer++;

  // Typewriter effect
  if (!typewriterDone) {
    typewriterTimer++;
    if (typewriterTimer >= 2) {
      typewriterTimer = 0;
      typewriterChar++;
      const line = NARRATIVE.intro[typewriterLine] || '';
      if (typewriterChar > line.length) {
        typewriterChar = 0;
        typewriterLine++;
        if (typewriterLine >= NARRATIVE.intro.length) {
          typewriterDone = true;
        }
      }
    }
  }

  if (input.isJust('e') || input.isJust('enter')) {
    if (typewriterDone) {
      // Show start button
      document.getElementById('startBtn').style.display = 'block';
    } else {
      // Skip typewriter
      typewriterDone = true;
      typewriterLine = NARRATIVE.intro.length;
    }
  }
}

function drawTitle() {
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);

  // Title
  drawText(ctx, NARRATIVE.title, VIEWPORT_W / 2, 16, '#00ff41', 10, 'center');
  drawText(ctx, NARRATIVE.subtitle, VIEWPORT_W / 2, 30, '#5a7a60', 6, 'center');

  // Typewriter text
  let y = 48;
  for (let i = 0; i <= typewriterLine && i < NARRATIVE.intro.length; i++) {
    const line = NARRATIVE.intro[i];
    if (i < typewriterLine) {
      drawText(ctx, line, 20, y, '#4ade80', 7);
    } else if (i === typewriterLine && !typewriterDone) {
      drawText(ctx, line.substring(0, typewriterChar), 20, y, '#4ade80', 7);
      // Cursor
      const cursorX = 20 + typewriterChar * 4.2;
      if (Math.floor(titleTimer / 15) % 2 === 0) {
        drawRect(ctx, cursorX, y, 4, 8, '#00ff41');
      }
    }
    y += 12;
  }

  if (typewriterDone) {
    if (Math.floor(titleTimer / 30) % 2 === 0) {
      drawText(ctx, '[ Press E to begin ]', VIEWPORT_W / 2, VIEWPORT_H - 20, '#00ff41', 7, 'center');
    }
  }
}

// ─── Game Update ────────────────────────────────────────────────
function updateGame() {
  if (dialog.isOpen) {
    // UI mode — only handle dialog/quest input
    if (input.isJust('e')) {
      if (dialog.mode === 'dialog') {
        dialog.advanceDialog();
      }
    }
    if (input.escape) {
      dialog.close();
    }
    return;
  }

  // Player movement
  player.update(input, world);

  // Attack
  if (input.attack) {
    player.startAttack();
  }

  // Camera follow
  const mapSize = world.getMapPixelSize();
  camera.follow(player.x, player.y, world.areaData.width, world.areaData.height);

  // Entity updates
  entities.update(player.x, player.y);
  hud.update();

  // ─── Item pickups ─────────────────────────────────────────
  const pb = player.getBounds();
  for (const item of entities.items) {
    if (item.collected) continue;
    if (item.overlaps(pb.x, pb.y, pb.w, pb.h)) {
      item.collected = true;
      const key = `${world.currentArea}_${item.x / TILE_SIZE}_${item.y / TILE_SIZE}`;
      state.markItemCollected(world.currentArea, item.x / TILE_SIZE, item.y / TILE_SIZE);

      if (item.type === 'artifact') {
        player.addArtifact(item.artifactId || 'unknown');
        hud.showMessage('Artifact found: ' + (item.artifactId || 'data fragment'), 120);
      } else if (item.type === 'repair') {
        player.heal(ITEM_DEFS.repair.heal);
        hud.showMessage('HP restored!', 90);
      } else {
        player.addItem(item.type);
        const def = ITEM_DEFS[item.type];
        hud.showMessage('Got ' + (def?.name || item.type) + '!', 120);
      }

      state.playerItems = [...player.inventory];
      state.playerArtifacts = [...player.artifacts];
      state.playerHp = player.hp;
      state.save();
    }
  }

  // ─── Enemy combat ─────────────────────────────────────────
  const hitbox = player.getAttackHitbox();
  for (const enemy of entities.enemies) {
    if (enemy.dead) continue;

    // Player attack hits enemy
    if (hitbox && enemy.overlapsRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h)) {
      enemy.takeDamage(player.getDamage());
      if (enemy.dead) {
        state.markEnemyDefeated(world.currentArea, enemy.startX / TILE_SIZE, enemy.startY / TILE_SIZE);
        hud.showMessage(enemy.label + ' defeated!', 120);
      }
    }

    // Enemy damages player
    if (enemy.overlaps(pb.x, pb.y, pb.w, pb.h) && enemy.canAttack()) {
      player.takeDamage(1);
      enemy.doAttack();
      state.playerHp = player.hp;
      state.save();

      if (player.isDead()) {
        screen = 'dead';
        deathTimer = 0;
        document.getElementById('deathOverlay').classList.add('active');
        return;
      }
    }
  }

  // ─── Interaction checks ───────────────────────────────────
  hud.clearInteract();
  const facing = world.getFacingTile(player.x, player.y, player.dir);

  // NPC interaction
  for (const npc of entities.npcs) {
    if (npc.isNear(player.x, player.y)) {
      hud.showInteract('E: Talk to ' + npc.name);
      if (input.interact) {
        dialog.openDialog(npc.dialogId);
        return;
      }
    }
  }

  // Computer/interactive tile interaction
  if (facing.interactive) {
    // Find which quest this computer serves
    const questId = findQuestForTile(facing.tx, facing.ty);
    if (questId) {
      if (state.isQuestAvailable(questId)) {
        const quest = QUESTS.find(q => q.id === questId);
        hud.showInteract('E: ' + (quest?.name || 'Quest'));
        if (input.interact) {
          dialog.openQuest(questId, state);
          return;
        }
      } else {
        hud.showInteract('LOCKED — complete previous quest');
      }
    }
  }

  // Door transition
  const door = world.getDoor(player.x, player.y);
  if (door) {
    transitionArea(door);
  }

  // ─── Victory check ────────────────────────────────────────
  if (state.completedQuests.size >= 9 && !state.gameComplete) {
    state.gameComplete = true;
    state.save();
    screen = 'victory';
    document.getElementById('victoryOverlay').classList.add('active');
  }
}

function findQuestForTile(tx, ty) {
  if (!world.areaData?.quests) return null;
  for (const [questId, positions] of Object.entries(world.areaData.quests)) {
    if ((positions.computerX === tx && positions.computerY === ty) ||
        (positions.computerX2 === tx && positions.computerY2 === ty)) {
      return questId;
    }
  }
  return null;
}

// ─── Game Draw ──────────────────────────────────────────────────
function drawGame() {
  // Clear
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);

  // World
  world.draw(ctx, camera);

  // Entities
  entities.draw(ctx, camera);

  // Player
  player.draw(ctx, camera);

  // HUD
  hud.draw(ctx, player, state.getProgress(), world.getAreaName());
}

// ─── Victory ────────────────────────────────────────────────────
function drawVictory() {
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);

  let y = 30;
  for (const line of NARRATIVE.victory) {
    drawText(ctx, line, VIEWPORT_W / 2, y, '#00ff41', 6, 'center');
    y += 10;
  }

  drawText(ctx, 'Quests: 9/9  Artifacts: ' + player.artifacts.length, VIEWPORT_W / 2, y + 20, '#06d6a0', 7, 'center');
  drawText(ctx, 'Items: ' + player.inventory.length, VIEWPORT_W / 2, y + 32, '#5a7a60', 7, 'center');
}

// ─── Death ──────────────────────────────────────────────────────
function updateDead() {
  deathTimer++;
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);
  drawText(ctx, 'SYSTEM CRASH', VIEWPORT_W / 2, VIEWPORT_H / 2 - 20, '#ef4444', 10, 'center');
  drawText(ctx, 'Connection lost...', VIEWPORT_W / 2, VIEWPORT_H / 2, '#5a7a60', 7, 'center');
}

// ─── Boot ───────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
