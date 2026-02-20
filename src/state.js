// src/state.js — Game state management + localStorage persistence + event bus

const STORAGE_KEY = 'remoteAgentGame';

// ─── Simple Event Bus ───────────────────────────────────────────
class EventBus {
  constructor() {
    this._listeners = {};
  }

  on(event, fn) {
    (this._listeners[event] ||= []).push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    const list = this._listeners[event];
    if (list) this._listeners[event] = list.filter(f => f !== fn);
  }

  emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
  }
}

// ─── Game State ─────────────────────────────────────────────────
export class GameState {
  constructor(totalQuests) {
    this.totalQuests = totalQuests;
    this.events = new EventBus();
    this.completed = new Set();
    this.currentQuest = 0;
    this.checksState = {};       // 'questIdx-checkIdx' → boolean
    this.terminalCmdIndex = {};  // questIdx → next expected cmd index
    this.briefingSeen = false;
    this._load();
  }

  // ─── Persistence ────────────────────────────────────────────
  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      this.completed = new Set(data.completed || []);
      this.currentQuest = data.currentQuest ?? 0;
      this.checksState = data.checksState || {};
      this.terminalCmdIndex = data.terminalCmdIndex || {};
      this.briefingSeen = data.briefingSeen ?? false;
    } catch (e) {
      // corrupted state — start fresh
    }
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: [...this.completed],
      currentQuest: this.currentQuest,
      checksState: this.checksState,
      terminalCmdIndex: this.terminalCmdIndex,
      briefingSeen: this.briefingSeen,
    }));
  }

  // ─── Queries ────────────────────────────────────────────────
  getQuestStatus(idx) {
    if (this.completed.has(idx)) return 'complete';
    if (idx === this.currentQuest) return 'active';
    return 'locked';
  }

  isQuestComplete(idx) {
    return this.completed.has(idx);
  }

  isCheckChecked(questIdx, checkIdx) {
    return !!this.checksState[`${questIdx}-${checkIdx}`];
  }

  allChecksComplete(questIdx, totalChecks) {
    for (let i = 0; i < totalChecks; i++) {
      if (!this.checksState[`${questIdx}-${i}`]) return false;
    }
    return true;
  }

  getTerminalCmdIndex(questIdx) {
    return this.terminalCmdIndex[questIdx] || 0;
  }

  getProgress() {
    const done = this.completed.size;
    return {
      done,
      total: this.totalQuests,
      pct: Math.round((done / this.totalQuests) * 100)
    };
  }

  isGameComplete() {
    return this.completed.size >= this.totalQuests;
  }

  // ─── Mutations ──────────────────────────────────────────────
  markBriefingSeen() {
    this.briefingSeen = true;
    this._save();
  }

  toggleCheck(questIdx, checkIdx) {
    const key = `${questIdx}-${checkIdx}`;
    this.checksState[key] = !this.checksState[key];
    this._save();
    this.events.emit('checkToggled', { questIdx, checkIdx });
    this.events.emit('stateChange');
  }

  advanceTerminal(questIdx) {
    this.terminalCmdIndex[questIdx] = (this.terminalCmdIndex[questIdx] || 0) + 1;
    this._save();
    this.events.emit('terminalAdvanced', { questIdx });
  }

  completeQuest(questIdx) {
    this.completed.add(questIdx);
    // Advance to next uncompleted quest
    if (questIdx === this.currentQuest) {
      this.currentQuest = questIdx + 1;
    }
    this._save();
    this.events.emit('questComplete', { questIdx });
    this.events.emit('stateChange');

    if (this.isGameComplete()) {
      this.events.emit('gameComplete');
    }
  }

  reset() {
    this.completed = new Set();
    this.currentQuest = 0;
    this.checksState = {};
    this.terminalCmdIndex = {};
    this.briefingSeen = false;
    localStorage.removeItem(STORAGE_KEY);
    this.events.emit('reset');
    this.events.emit('stateChange');
  }
}
