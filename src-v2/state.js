// state.js — Game state: quest progress, inventory, area state, persistence

const STORAGE_KEY = 'remoteAgentV2';

export class GameState {
  constructor() {
    this.completedQuests = new Set();
    this.currentQuestIdx = 0;
    this.questChecks = {};       // questId → { checkIdx: bool }
    this.terminalProgress = {};  // questId → next cmd index
    this.collectedItems = new Set(); // 'areaId_x_y'
    this.defeatedEnemies = new Set(); // 'areaId_x_y'
    this.currentArea = 'mac-lab';
    this.playerItems = [];
    this.playerArtifacts = [];
    this.playerHp = 5;
    this.briefingSeen = false;
    this.gameComplete = false;
    this._load();
  }

  // ─── Persistence ──────────────────────────────────────────────

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      this.completedQuests = new Set(d.completedQuests || []);
      this.currentQuestIdx = d.currentQuestIdx ?? 0;
      this.questChecks = d.questChecks || {};
      this.terminalProgress = d.terminalProgress || {};
      this.collectedItems = new Set(d.collectedItems || []);
      this.defeatedEnemies = new Set(d.defeatedEnemies || []);
      this.currentArea = d.currentArea || 'mac-lab';
      this.playerItems = d.playerItems || [];
      this.playerArtifacts = d.playerArtifacts || [];
      this.playerHp = d.playerHp ?? 5;
      this.briefingSeen = d.briefingSeen ?? false;
      this.gameComplete = d.gameComplete ?? false;
    } catch (e) { /* fresh start */ }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedQuests: [...this.completedQuests],
      currentQuestIdx: this.currentQuestIdx,
      questChecks: this.questChecks,
      terminalProgress: this.terminalProgress,
      collectedItems: [...this.collectedItems],
      defeatedEnemies: [...this.defeatedEnemies],
      currentArea: this.currentArea,
      playerItems: this.playerItems,
      playerArtifacts: this.playerArtifacts,
      playerHp: this.playerHp,
      briefingSeen: this.briefingSeen,
      gameComplete: this.gameComplete,
    }));
  }

  // ─── Quest Management ─────────────────────────────────────────

  toggleCheck(questId, checkIdx) {
    if (!this.questChecks[questId]) this.questChecks[questId] = {};
    this.questChecks[questId][checkIdx] = !this.questChecks[questId][checkIdx];
    this.save();
  }

  advanceTerminal(questId) {
    this.terminalProgress[questId] = (this.terminalProgress[questId] || 0) + 1;
    this.save();
  }

  completeQuest(questId) {
    this.completedQuests.add(questId);
    this.currentQuestIdx = Math.max(this.currentQuestIdx, this._getQuestOrder(questId) + 1);
    this.save();
  }

  _getQuestOrder(questId) {
    const order = [
      'install-tmux', 'enable-ssh', 'setup-tailscale-mac',
      'tailscale-iphone', 'setup-termius', 'start-tmux-claude',
      'phone-connect', 'final-boss-roundtrip', 'troubleshoot'
    ];
    return order.indexOf(questId);
  }

  isQuestAvailable(questId) {
    const idx = this._getQuestOrder(questId);
    return idx <= this.currentQuestIdx;
  }

  getProgress() {
    return { done: this.completedQuests.size, total: 9 };
  }

  // ─── Area & Entity State ──────────────────────────────────────

  markItemCollected(areaId, x, y) {
    this.collectedItems.add(`${areaId}_${x}_${y}`);
    this.save();
  }

  markEnemyDefeated(areaId, x, y) {
    this.defeatedEnemies.add(`${areaId}_${x}_${y}`);
    this.save();
  }

  // ─── Reset ────────────────────────────────────────────────────

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.completedQuests = new Set();
    this.currentQuestIdx = 0;
    this.questChecks = {};
    this.terminalProgress = {};
    this.collectedItems = new Set();
    this.defeatedEnemies = new Set();
    this.currentArea = 'mac-lab';
    this.playerItems = [];
    this.playerArtifacts = [];
    this.playerHp = 5;
    this.briefingSeen = false;
    this.gameComplete = false;
  }
}
