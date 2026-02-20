// src/app.js — Application init: wire state → renderer → screens

import { QUESTS } from './data/quests.js';
import { GameState } from './state.js';
import { Renderer } from './renderer.js';

// ─── Initialize ─────────────────────────────────────────────────
const state = new GameState(QUESTS.length);
const renderer = new Renderer(state);

function init() {
  // Decide which screen to show
  if (state.isGameComplete()) {
    renderer.renderVictory();
    renderer.showScreen('victoryScreen');
  } else if (!state.briefingSeen) {
    renderer.showScreen('briefingScreen');
    renderer.renderBriefing();
  } else {
    renderer.showScreen('hudScreen');
    renderer.renderHUD();
  }

  // ─── Wire Buttons ──────────────────────────────────────────
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
    if (confirm('Reset all progress? This cannot be undone.')) {
      state.reset();
    }
  });

  // ─── Wire State Events ────────────────────────────────────
  state.events.on('reset', () => {
    renderer.showScreen('briefingScreen');
    renderer.renderBriefing();
  });
}

// ─── Boot ───────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
