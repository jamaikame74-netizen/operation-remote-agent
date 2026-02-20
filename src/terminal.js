// src/terminal.js — Interactive terminal simulator component

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeCmd(cmd) {
  return cmd.trim().toLowerCase().replace(/\s+/g, ' ');
}

export class Terminal {
  /**
   * @param {object} terminalData — { title, commands: [{ cmd, output, successMsg }] }
   * @param {number} questIdx
   * @param {import('./state.js').GameState} state
   */
  constructor(terminalData, questIdx, state) {
    this.data = terminalData;
    this.questIdx = questIdx;
    this.state = state;
    this.el = null;
    this.bodyEl = null;
    this.inputEl = null;
  }

  render() {
    const cmdIdx = this.state.getTerminalCmdIndex(this.questIdx);
    const allDone = cmdIdx >= this.data.commands.length;
    const nextCmd = this.data.commands[cmdIdx];

    const el = document.createElement('div');
    el.className = 'terminal';

    el.innerHTML = `
      <div class="terminal-bar">
        <div class="terminal-dot r"></div>
        <div class="terminal-dot y"></div>
        <div class="terminal-dot g"></div>
        <div class="terminal-title">${escapeHtml(this.data.title)}</div>
      </div>
      <div class="terminal-body">
        ${!allDone && nextCmd
          ? `<div class="term-line term-info">\u25b8 Type: ${escapeHtml(nextCmd.cmd)}</div>`
          : allDone
            ? `<div class="term-line term-info">\u25b8 Terminal objectives complete.</div>`
            : ''
        }
      </div>
      <div class="terminal-input-area">
        <div class="terminal-input-row">
          <span class="term-prompt">~ % </span>
          <input type="text" class="terminal-input"
            placeholder="${allDone ? 'All commands completed' : 'Type command here...'}"
            ${allDone ? 'disabled' : ''}
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        </div>
      </div>
    `;

    this.el = el;
    this.bodyEl = el.querySelector('.terminal-body');
    this.inputEl = el.querySelector('.terminal-input');

    if (!allDone) {
      this.inputEl.addEventListener('keydown', (e) => this._onKeydown(e));
    }

    return el;
  }

  focus() {
    if (this.inputEl && !this.inputEl.disabled) {
      this.inputEl.focus();
    }
  }

  _onKeydown(e) {
    if (e.key !== 'Enter') return;
    const cmd = this.inputEl.value.trim();
    if (!cmd) return;

    const cmdIdx = this.state.getTerminalCmdIndex(this.questIdx);
    const expected = this.data.commands[cmdIdx];

    // Echo the typed command
    this._appendLine('term-line', `<span class="term-prompt">~ % </span>${escapeHtml(cmd)}`);

    if (expected && normalizeCmd(cmd) === normalizeCmd(expected.cmd)) {
      // Correct command
      this._appendLine('term-line term-output', expected.output);
      this._appendLine('term-line term-success', '\u2713 ' + expected.successMsg);

      this.state.advanceTerminal(this.questIdx);

      const newIdx = this.state.getTerminalCmdIndex(this.questIdx);
      if (newIdx >= this.data.commands.length) {
        // All terminal commands done
        this._appendLine('term-line term-info', '\n\u25b8 Terminal objectives complete.');
        this.inputEl.disabled = true;
        this.inputEl.placeholder = 'All commands completed';
      } else {
        // Show next hint
        const next = this.data.commands[newIdx];
        this._appendLine('term-line term-info', `\n\u25b8 Type: ${next.cmd}`);
      }
    } else {
      // Wrong command
      const hint = expected
        ? `\u2717 Try: ${expected.cmd}`
        : '\u2717 Unknown command';
      this._appendLine('term-line term-error', hint);
    }

    this.inputEl.value = '';
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  _appendLine(className, content) {
    const div = document.createElement('div');
    div.className = className;
    // If content contains HTML spans, use innerHTML; otherwise textContent
    if (content.includes('<span')) {
      div.innerHTML = content;
    } else {
      div.textContent = content;
    }
    this.bodyEl.appendChild(div);
  }
}
