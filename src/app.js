// src/app.js — Application init: OS selector → briefing → HUD

import { QUESTS } from './data/quests.js';
import { QUESTS_WINDOWS } from './data/quests-windows.js';
import { GameState } from './state.js';
import { Renderer } from './renderer.js';

// ─── Initialize ─────────────────────────────────────────────────
let state = null;
let renderer = null;

function getQuests() {
  return state.os === 'windows' ? QUESTS_WINDOWS : QUESTS;
}

function boot() {
  const quests = getQuests();
  state = new GameState(quests.length);

  // Re-read OS after state load (state constructor reads from localStorage)
  renderer = new Renderer(state);

  route();
  wireButtons();

  // Re-route when OS is selected
  state.events.on('osSelected', () => {
    // Rebuild state with correct quest count for the chosen OS
    const newQuests = getQuests();
    state.totalQuests = newQuests.length;
    renderer.renderBriefing();
    renderer.showScreen('briefingScreen');
  });

  state.events.on('reset', () => {
    renderer.showScreen('osSelectorScreen');
    renderer.renderOSSelector();
  });
}

function route() {
  if (!state.os) {
    renderer.showScreen('osSelectorScreen');
    renderer.renderOSSelector();
  } else if (state.isGameComplete()) {
    renderer.renderVictory();
    renderer.showScreen('victoryScreen');
  } else if (!state.briefingSeen) {
    renderer.showScreen('briefingScreen');
    renderer.renderBriefing();
  } else {
    renderer.showScreen('hudScreen');
    renderer.renderHUD();
  }
}

function wireButtons() {
  document.getElementById('beginBtn')?.addEventListener('click', () => {
    state.markBriefingSeen();
    renderer.showScreen('hudScreen');
    renderer.renderHUD();
  });

  document.getElementById('restartBtn')?.addEventListener('click', () => {
    state.reset();
  });

  document.getElementById('resetLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Reset all progress and OS selection? This cannot be undone.')) {
      state.reset();
    }
  });
}

// ─── Boot ───────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
