// data/maps.js — Tile map data for all 3 areas
// Legend: 0=empty 1=floor 2=floor2 3=wall 4=computer 5=server 6=door 7=desk 8=phone 9=netnode 10=boss 11=display
// Each area: { tiles[][], width, height, playerStart{x,y}, doors[], items[], npcs[], enemies[] }

const W = 3, F = 1, F2 = 2, C = 4, S = 5, D = 6, DK = 7, P = 8, N = 9, B = 10, DS = 11;

// ─── AREA 0: MAC LAB (30x20) ──────────────────────────────────
export const MAC_LAB = {
  id: 'mac-lab',
  name: 'Mac Lab',
  width: 30,
  height: 20,
  playerStart: { x: 3, y: 10 },
  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, S, F, S, F, W, F, F2, F, F, F, F, F, F, F, F, F, F, F, W, F, F, DS, F, F, DS, F, F, W],
    [W, F, F, F, F, F, W, F, F, F, F, DK, C, F, F, DK, C, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, S, F, S, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, DK, C, F, F, DK, C, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, W, W, W, W, W, F, F, F2, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F2, F, F, W, W, W, W, W, W, F, F, D, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W, W, W, F, F, D, W],
    [W, W, W, W, W, W, F, F, F, F, F, DK, C, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, DK, DK, F, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, W, F, F2, F, F, DK, C, F, F, DK, C, F, F, F, W, F, F, P, F, F, P, F, F, W],
    [W, F, F, F, F, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, W, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  ],
  doors: [
    { x: 28, y: 9, target: 'bridge', spawnX: 1, spawnY: 5 },
    { x: 28, y: 11, target: 'bridge', spawnX: 1, spawnY: 5 },
  ],
  items: [
    { x: 2, y: 9, type: 'tmux', questId: 'install-tmux' },
    { x: 14, y: 13, type: 'sshkey', questId: 'enable-ssh' },
    { x: 25, y: 5, type: 'artifact', id: 'config-file' },
  ],
  npcs: [
    { x: 10, y: 9, sprite: 'guide', name: 'SysAdmin', dialog: 'guide-intro' },
  ],
  enemies: [
    { x: 18, y: 14, type: 'bug', hp: 2, label: 'Connection Refused' },
  ],
  quests: {
    'install-tmux': { computerX: 12, computerY: 4, computerX2: 12, computerY2: 7 },
    'enable-ssh':   { computerX: 16, computerY: 4, computerX2: 16, computerY2: 7 },
    'setup-tailscale-mac': { computerX: 12, computerY: 16, computerX2: 16, computerY2: 16 },
  },
};

// ─── AREA 1: NETWORK BRIDGE (30x14) ───────────────────────────
export const BRIDGE = {
  id: 'bridge',
  name: 'Network Bridge',
  width: 30,
  height: 14,
  playerStart: { x: 1, y: 5 },
  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, N, F, F, F, F, N, F, F, F, F, N, F, F, F, F, N, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [D, F, F, F, F, F, F2, F, F, F, F, F2, F, F, F, F, F2, F, F, F, F, F2, F, F, F, F, F, F, F, W],
    [D, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, P, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, C, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, D, W],
    [W, F, F, F, F, N, F, F, F, F, N, F, F, F, F, N, F, F, F, F, N, F, F, F, F, F, F, F, D, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  ],
  doors: [
    { x: 0, y: 4, target: 'mac-lab', spawnX: 27, spawnY: 9 },
    { x: 0, y: 5, target: 'mac-lab', spawnX: 27, spawnY: 11 },
    { x: 28, y: 9, target: 'command', spawnX: 1, spawnY: 10 },
    { x: 28, y: 10, target: 'command', spawnX: 1, spawnY: 10 },
  ],
  items: [
    { x: 14, y: 6, type: 'tailscale', questId: 'tailscale-iphone' },
    { x: 7, y: 8, type: 'termius', questId: 'setup-termius' },
    { x: 22, y: 3, type: 'artifact', id: 'vpn-cert' },
    { x: 12, y: 11, type: 'repair' },
  ],
  npcs: [
    { x: 14, y: 3, sprite: 'guide', name: 'NetOps', dialog: 'bridge-guide' },
  ],
  enemies: [
    { x: 8, y: 5, type: 'ghost', hp: 3, label: 'No Route' },
    { x: 20, y: 7, type: 'bug', hp: 2, label: 'Timeout' },
  ],
  quests: {
    'tailscale-iphone': { computerX: 3, computerY: 8 },
    'setup-termius':    { computerX: 3, computerY: 8 },
    'start-tmux-claude': { computerX: 23, computerY: 8 },
  },
};

// ─── AREA 2: COMMAND CENTER (30x20) ───────────────────────────
export const COMMAND = {
  id: 'command',
  name: 'Command Center',
  width: 30,
  height: 20,
  playerStart: { x: 1, y: 10 },
  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, DS, F, F, DS, F, F, DS, F, F, F, F, F, F, F, F, F, DS, F, F, DS, F, F, DS, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, F, F, F, F, W],
    [W, F, F, C, F, F, W, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, W, F, F, C, F, F, W],
    [W, F, F, F, F, F, W, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, W, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, F, F, F, F, F, F, W],
    [D, F, F, F, F, F, F, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, F, F, F, F, F, F, W],
    [W, F, F, P, F, F, W, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, W, F, F, P, F, F, W],
    [W, F, F, F, F, F, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, DK, C, F, F, F, F, DK, C, F, F, F, F, F, F, F, F, DK, C, F, F, F, F, DK, C, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  ],
  doors: [
    { x: 0, y: 10, target: 'bridge', spawnX: 27, spawnY: 9 },
  ],
  items: [
    { x: 15, y: 1, type: 'artifact', id: 'master-key' },
    { x: 4, y: 15, type: 'repair' },
    { x: 25, y: 15, type: 'artifact', id: 'field-manual' },
  ],
  npcs: [
    { x: 15, y: 4, sprite: 'guide', name: 'Commander', dialog: 'command-guide' },
  ],
  enemies: [
    { x: 12, y: 9, type: 'bug', hp: 3, label: 'Session Lost' },
    { x: 18, y: 9, type: 'ghost', hp: 4, label: 'Mac Sleep' },
    { x: 15, y: 11, type: 'bug', hp: 5, label: 'FINAL BUG' },
  ],
  quests: {
    'phone-connect':  { computerX: 3, computerY: 6, computerX2: 26, computerY2: 6 },
    'final-boss-roundtrip': { computerX: 4, computerY: 17, computerX2: 10, computerY2: 17 },
    'troubleshoot':   { computerX: 19, computerY: 17, computerX2: 25, computerY2: 17 },
  },
};

export const AREAS = { 'mac-lab': MAC_LAB, 'bridge': BRIDGE, 'command': COMMAND };
export const AREA_ORDER = ['mac-lab', 'bridge', 'command'];
