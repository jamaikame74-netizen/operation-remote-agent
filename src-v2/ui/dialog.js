// ui/dialog.js — Dialog box, quest panel with terminal simulator

import { QUESTS, DIALOGS } from '../data/content.js';

export class DialogUI {
  constructor() {
    this.overlay = document.getElementById('overlay');
    this.dialogBox = document.getElementById('dialogBox');
    this.questPanel = document.getElementById('questPanel');

    this.active = false;
    this.mode = null;  // 'dialog' | 'quest'

    // Dialog state
    this.dialogLines = [];
    this.dialogIndex = 0;

    // Quest state
    this.currentQuestId = null;
  }

  get isOpen() { return this.active; }

  // ─── Dialog Mode ──────────────────────────────────────────────

  openDialog(dialogId) {
    this.dialogLines = DIALOGS[dialogId] || [];
    if (this.dialogLines.length === 0) return;

    this.dialogIndex = 0;
    this.mode = 'dialog';
    this.active = true;
    this.overlay.classList.add('active');
    this.dialogBox.classList.add('active');
    this.questPanel.classList.remove('active');
    this._renderDialogLine();
  }

  advanceDialog() {
    this.dialogIndex++;
    if (this.dialogIndex >= this.dialogLines.length) {
      this.close();
      return;
    }
    this._renderDialogLine();
  }

  _renderDialogLine() {
    const line = this.dialogLines[this.dialogIndex];
    if (!line) return;
    this.dialogBox.innerHTML = `
      <div class="dialog-speaker">${line.speaker}</div>
      <div class="dialog-text">${line.text}</div>
      <div class="dialog-prompt">Press E to continue${this.dialogIndex < this.dialogLines.length - 1 ? '' : ' (close)'}</div>
    `;
  }

  // ─── Quest Mode ───────────────────────────────────────────────

  openQuest(questId, gameState) {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return;

    this.currentQuestId = questId;
    this.mode = 'quest';
    this.active = true;
    this.overlay.classList.add('active');
    this.questPanel.classList.add('active');
    this.dialogBox.classList.remove('active');
    this._renderQuest(quest, gameState);
  }

  _renderQuest(quest, gameState) {
    const isComplete = gameState.completedQuests.has(quest.id);
    const checks = gameState.questChecks[quest.id] || {};
    const termIdx = gameState.terminalProgress[quest.id] || 0;

    let html = `
      <div class="quest-panel-header">
        <span class="quest-panel-badge ${isComplete ? 'complete' : 'active'}">${isComplete ? 'COMPLETE' : 'ACTIVE'}</span>
        <span class="quest-panel-title">${quest.name}</span>
        <button class="quest-close-btn" id="questCloseBtn">✕</button>
      </div>
      <div class="quest-panel-body">
        ${quest.body}
    `;

    // Terminal simulator
    if (quest.terminal) {
      const allDone = termIdx >= quest.terminal.commands.length;
      const nextCmd = quest.terminal.commands[termIdx];
      html += `
        <h3>Terminal</h3>
        <div class="terminal">
          <div class="terminal-bar">
            <div class="terminal-dot r"></div>
            <div class="terminal-dot y"></div>
            <div class="terminal-dot g"></div>
            <div class="terminal-title">${quest.terminal.title}</div>
          </div>
          <div class="terminal-body" id="termBody">
            ${!allDone && nextCmd ? `<div class="term-line term-info">▸ Type: ${this._esc(nextCmd.cmd)}</div>` : ''}
            ${allDone ? '<div class="term-line term-info">▸ Terminal objectives complete.</div>' : ''}
          </div>
          <div class="terminal-input-area">
            <div class="terminal-input-row">
              <span class="term-prompt">~ % </span>
              <input type="text" class="terminal-input" id="termInput"
                placeholder="${allDone ? 'All commands completed' : 'Type command here...'}"
                ${allDone ? 'disabled' : ''}
                autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
            </div>
          </div>
        </div>
      `;
    }

    // Validation checks
    html += '<h3>Validation</h3><div class="validation">';
    quest.checks.forEach((check, ci) => {
      const checked = checks[ci] || false;
      html += `
        <div class="val-item">
          <div class="val-check ${checked ? 'checked' : ''}" data-quest="${quest.id}" data-check="${ci}">${checked ? '✓' : ''}</div>
          <span>${this._esc(check)}</span>
        </div>
      `;
    });
    html += '</div>';

    // Complete button
    const allChecked = quest.checks.every((_, ci) => checks[ci]);
    if (!isComplete) {
      html += `<button class="complete-btn ${allChecked ? 'ready' : 'disabled'}" id="questCompleteBtn" ${!allChecked ? 'disabled' : ''}>
        ${allChecked ? 'COMPLETE QUEST' : 'Complete all checks first'}
      </button>`;
    } else {
      html += '<button class="complete-btn done" disabled>✓ Quest Complete</button>';
    }

    html += '</div>';
    this.questPanel.innerHTML = html;

    // Wire events
    this.questPanel.querySelector('#questCloseBtn')?.addEventListener('click', () => this.close());

    // Check toggles
    this.questPanel.querySelectorAll('.val-check').forEach(el => {
      el.addEventListener('click', () => {
        const qid = el.dataset.quest;
        const ci = parseInt(el.dataset.check);
        gameState.toggleCheck(qid, ci);
        this._renderQuest(quest, gameState); // re-render
      });
    });

    // Complete button
    this.questPanel.querySelector('#questCompleteBtn')?.addEventListener('click', () => {
      if (allChecked && !isComplete) {
        gameState.completeQuest(quest.id);
        this._renderQuest(quest, gameState);
      }
    });

    // Terminal input
    const termInput = this.questPanel.querySelector('#termInput');
    if (termInput && !termInput.disabled) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const cmd = termInput.value.trim();
        if (!cmd) return;
        this._handleTerminal(quest, gameState, cmd, termInput);
      });
      // Focus terminal input
      setTimeout(() => termInput.focus(), 100);
    }
  }

  _handleTerminal(quest, gameState, cmd, inputEl) {
    const termIdx = gameState.terminalProgress[quest.id] || 0;
    const expected = quest.terminal.commands[termIdx];
    const body = this.questPanel.querySelector('#termBody');

    // Echo command
    this._appendTermLine(body, 'term-line', `<span class="term-prompt">~ % </span>${this._esc(cmd)}`);

    const normalize = s => s.trim().toLowerCase().replace(/\s+/g, ' ');

    if (expected && normalize(cmd) === normalize(expected.cmd)) {
      this._appendTermLine(body, 'term-line term-output', expected.output);
      this._appendTermLine(body, 'term-line term-success', '✓ ' + expected.successMsg);
      gameState.advanceTerminal(quest.id);

      const newIdx = gameState.terminalProgress[quest.id];
      if (newIdx >= quest.terminal.commands.length) {
        this._appendTermLine(body, 'term-line term-info', '\n▸ Terminal objectives complete.');
        inputEl.disabled = true;
        inputEl.placeholder = 'All commands completed';
      } else {
        const next = quest.terminal.commands[newIdx];
        this._appendTermLine(body, 'term-line term-info', `\n▸ Type: ${next.cmd}`);
      }
    } else {
      const hint = expected ? `✗ Try: ${expected.cmd}` : '✗ Unknown command';
      this._appendTermLine(body, 'term-line term-error', hint);
    }

    inputEl.value = '';
    body.scrollTop = body.scrollHeight;
  }

  _appendTermLine(body, cls, content) {
    const div = document.createElement('div');
    div.className = cls;
    if (content.includes('<span')) {
      div.innerHTML = content;
    } else {
      div.textContent = content;
    }
    body.appendChild(div);
  }

  _esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ─── Close ────────────────────────────────────────────────────

  close() {
    this.active = false;
    this.mode = null;
    this.overlay.classList.remove('active');
    this.dialogBox.classList.remove('active');
    this.questPanel.classList.remove('active');
  }
}
