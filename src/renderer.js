// src/renderer.js — DOM rendering engine: quests, progress, arch diagram, screens

import { QUESTS } from './data/quests.js';
import { LEVELS } from './data/levels.js';
import { BRIEFING, VICTORY } from './data/narrative.js';
import { Terminal } from './terminal.js';
import { typewriter, fadeIn, showLevelTransition, glowPulse } from './animations.js';

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class Renderer {
  constructor(state) {
    this.state = state;
    this.terminals = {};      // questIdx → Terminal instance
    this._typewriterCtrl = null;
    this._expandedQuest = null; // currently expanded quest index
  }

  // ─── Screen Management ──────────────────────────────────────
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(screenId);
    if (el) el.classList.add('active');
  }

  // ─── Mission Briefing ───────────────────────────────────────
  renderBriefing() {
    const doc = document.getElementById('briefingDoc');
    const arch = document.getElementById('briefingArch');
    const btn = document.getElementById('beginBtn');
    if (!doc) return;

    doc.innerHTML = '';

    // Set date
    const dateEl = document.querySelector('.briefing-date');
    if (dateEl) dateEl.textContent = BRIEFING.date;

    // Typewriter the briefing text
    this._typewriterCtrl = typewriter(doc, BRIEFING.lines, {
      charDelay: 18,
      lineDelay: 60,
      onComplete: () => {
        // Show architecture diagram
        arch.textContent = BRIEFING.archDiagram.join('\n');
        arch.classList.add('visible');

        // Show begin button after a beat
        setTimeout(() => btn.classList.add('visible'), 600);
      }
    });

    // Click to skip typewriter
    doc.addEventListener('click', () => {
      if (this._typewriterCtrl) {
        this._typewriterCtrl.skip();
        this._typewriterCtrl = null;
        arch.textContent = BRIEFING.archDiagram.join('\n');
        arch.classList.add('visible');
        setTimeout(() => btn.classList.add('visible'), 200);
      }
    }, { once: true });
  }

  // ─── Operations HUD ─────────────────────────────────────────
  renderHUD() {
    this.updateProgress();
    this.renderArchDiagram();
    this.renderQuests();
  }

  updateProgress() {
    const { done, total, pct } = this.state.getProgress();
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    const pctEl = document.getElementById('progressPct');
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = `${done} / ${total} quests`;
    if (pctEl) pctEl.textContent = pct + '%';
  }

  renderArchDiagram() {
    const container = document.getElementById('archDiagram');
    if (!container) return;

    // All node IDs that can be highlighted
    const allNodes = [
      'archMac', 'archPhone', 'archTmux', 'archTermius',
      'archClaude', 'archCode', 'archSSH', 'archClient'
    ];

    // Determine which nodes to highlight based on current quest
    const quest = QUESTS[this.state.currentQuest];
    const activeNodes = quest ? quest.archHighlight : [];

    // Collect all nodes that are "complete" (from completed quests)
    const completeNodes = new Set();
    for (const idx of this.state.completed) {
      (QUESTS[idx].archHighlight || []).forEach(n => completeNodes.add(n));
    }

    allNodes.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active', 'complete');
      if (activeNodes.includes(id)) {
        el.classList.add('active');
      } else if (completeNodes.has(id)) {
        el.classList.add('complete');
      }
    });
  }

  renderQuests() {
    const container = document.getElementById('questContainer');
    if (!container) return;
    container.innerHTML = '';

    // Determine which quest should be auto-expanded
    const autoExpand = this._expandedQuest ?? this.state.currentQuest;

    LEVELS.forEach((level, li) => {
      // Level section
      const section = document.createElement('div');
      section.className = 'level-section';

      // Level header
      const header = document.createElement('div');
      header.className = 'level-header';
      header.innerHTML = `
        <span class="level-badge ${level.phase}">${level.badge}</span>
        <span class="level-title">${level.name}</span>
        <span class="level-tagline">${level.tagline}</span>
      `;
      section.appendChild(header);

      // Quest cards for this level
      const [startIdx, endIdx] = level.questRange;
      for (let qi = startIdx; qi <= endIdx; qi++) {
        section.appendChild(this._renderQuestCard(qi, autoExpand));
      }

      container.appendChild(section);
    });
  }

  _renderQuestCard(questIdx, autoExpand) {
    const quest = QUESTS[questIdx];
    const status = this.state.getQuestStatus(questIdx);
    const isExpanded = questIdx === autoExpand;

    const card = document.createElement('div');
    card.className = 'quest-card';
    card.dataset.quest = questIdx;

    if (status === 'active') card.classList.add('active');
    if (status === 'complete') card.classList.add('completed');
    if (status === 'locked') card.classList.add('locked');
    if (isExpanded && status !== 'locked') card.classList.add('expanded');

    // Status icon
    let statusIcon, statusClass;
    if (status === 'complete') {
      statusIcon = '\u2713';
      statusClass = 'done';
    } else if (status === 'active') {
      statusIcon = '\u25b6';
      statusClass = 'active-status';
    } else {
      statusIcon = String(questIdx + 1);
      statusClass = 'pending';
    }

    // Quest header
    const headerEl = document.createElement('div');
    headerEl.className = 'quest-header';
    headerEl.innerHTML = `
      <div class="quest-status ${statusClass}">${statusIcon}</div>
      <div class="quest-info">
        <div class="quest-name">${escapeHtml(quest.name)}</div>
        <div class="quest-desc">${escapeHtml(quest.desc)}</div>
      </div>
      <div class="quest-chevron">\u25b6</div>
    `;
    headerEl.addEventListener('click', () => this._toggleQuest(questIdx));
    card.appendChild(headerEl);

    // Quest body (expandable content)
    const body = document.createElement('div');
    body.className = 'quest-body';

    // Quest content HTML
    body.innerHTML = quest.body;

    // Terminal simulator (if quest has one)
    if (quest.terminal) {
      const term = new Terminal(quest.terminal, questIdx, this.state);
      this.terminals[questIdx] = term;
      const h3 = document.createElement('h3');
      h3.textContent = 'Terminal';
      body.appendChild(h3);
      body.appendChild(term.render());
    }

    // Hint box
    if (quest.hint) {
      const hint = document.createElement('div');
      hint.className = 'hint-box';
      hint.innerHTML = `<strong>Hint:</strong> ${quest.hint}`;
      body.appendChild(hint);
    }

    // Validation section
    const valH3 = document.createElement('h3');
    valH3.textContent = 'Validation';
    body.appendChild(valH3);

    const valDiv = document.createElement('div');
    valDiv.className = 'validation';
    quest.checks.forEach((check, ci) => {
      const checked = this.state.isCheckChecked(questIdx, ci);
      const item = document.createElement('div');
      item.className = 'val-item';
      item.innerHTML = `
        <div class="val-check ${checked ? 'checked' : ''}">${checked ? '\u2713' : ''}</div>
        <span>${escapeHtml(check)}</span>
      `;
      item.querySelector('.val-check').addEventListener('click', (e) => {
        e.stopPropagation();
        this.state.toggleCheck(questIdx, ci);
        this._refreshQuestCard(questIdx);
      });
      valDiv.appendChild(item);
    });
    body.appendChild(valDiv);

    // Complete button
    const allChecked = this.state.allChecksComplete(questIdx, quest.checks.length);
    const btn = document.createElement('button');
    btn.className = 'complete-btn';

    if (status === 'complete') {
      btn.className += ' done';
      btn.textContent = '\u2713 Quest Complete';
      btn.disabled = true;
    } else if (allChecked) {
      btn.className += ' ready';
      btn.textContent = 'COMPLETE QUEST';
      btn.addEventListener('click', () => this._onCompleteQuest(questIdx));
    } else {
      btn.className += ' disabled';
      btn.textContent = 'Complete all checks first';
      btn.disabled = true;
    }
    body.appendChild(btn);

    card.appendChild(body);
    return card;
  }

  _toggleQuest(questIdx) {
    const status = this.state.getQuestStatus(questIdx);
    if (status === 'locked') return;

    if (this._expandedQuest === questIdx) {
      this._expandedQuest = null;
    } else {
      this._expandedQuest = questIdx;
    }
    this.renderQuests();
  }

  _refreshQuestCard(questIdx) {
    // Re-render just the affected card's validation and button
    const card = document.querySelector(`.quest-card[data-quest="${questIdx}"]`);
    if (!card) return;

    const quest = QUESTS[questIdx];
    const status = this.state.getQuestStatus(questIdx);

    // Update check marks
    card.querySelectorAll('.val-item').forEach((item, ci) => {
      const check = item.querySelector('.val-check');
      const checked = this.state.isCheckChecked(questIdx, ci);
      check.className = `val-check ${checked ? 'checked' : ''}`;
      check.textContent = checked ? '\u2713' : '';
    });

    // Update button
    const allChecked = this.state.allChecksComplete(questIdx, quest.checks.length);
    const btn = card.querySelector('.complete-btn');
    if (btn && status !== 'complete') {
      if (allChecked) {
        btn.className = 'complete-btn ready';
        btn.textContent = 'COMPLETE QUEST';
        btn.disabled = false;
        btn.onclick = () => this._onCompleteQuest(questIdx);
      } else {
        btn.className = 'complete-btn disabled';
        btn.textContent = 'Complete all checks first';
        btn.disabled = true;
        btn.onclick = null;
      }
    }
  }

  async _onCompleteQuest(questIdx) {
    const quest = QUESTS[questIdx];
    if (!this.state.allChecksComplete(questIdx, quest.checks.length)) return;

    // Check if we're crossing a level boundary
    const currentLevel = QUESTS[questIdx].level;
    const nextQuest = QUESTS[questIdx + 1];
    const crossingLevel = nextQuest && nextQuest.level !== currentLevel;

    this.state.completeQuest(questIdx);

    if (this.state.isGameComplete()) {
      this.renderVictory();
      this.showScreen('victoryScreen');
      return;
    }

    // Level transition if crossing boundary
    if (crossingLevel) {
      const nextLevel = LEVELS.find(l => {
        const [s, e] = l.questRange;
        return questIdx + 1 >= s && questIdx + 1 <= e;
      });
      if (nextLevel) {
        await showLevelTransition(
          nextLevel.badge + ': ' + nextLevel.name,
          nextLevel.tagline
        );
      }
    }

    this._expandedQuest = this.state.currentQuest;
    this.renderHUD();
  }

  // ─── Victory Screen ─────────────────────────────────────────
  renderVictory() {
    const banner = document.getElementById('victoryBanner');
    const arch = document.getElementById('victoryArch');
    const stats = document.getElementById('victoryStats');
    const closing = document.getElementById('victoryClosing');
    const meta = document.getElementById('victoryMeta');

    if (banner) {
      banner.textContent = VICTORY.banner.join('\n');
      fadeIn(banner, 800);
    }

    if (arch) {
      // Full architecture diagram — all nodes lit
      arch.innerHTML = BRIEFING.archDiagram.map(line =>
        `<span style="color:var(--green)">${escapeHtml(line)}</span>`
      ).join('\n');
      fadeIn(arch, 800, 400);
    }

    if (stats) {
      stats.innerHTML = '';
      VICTORY.stats.components.forEach((comp, i) => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
          <div class="stat-name">${escapeHtml(comp.name)}</div>
          <div class="stat-value">${escapeHtml(comp.status)}</div>
          <div class="stat-desc">${escapeHtml(comp.desc)}</div>
        `;
        card.style.opacity = '0';
        stats.appendChild(card);
        fadeIn(card, 500, 600 + i * 150);
      });
    }

    if (closing) {
      closing.textContent = VICTORY.closingLine;
      fadeIn(closing, 600, 1400);
    }

    if (meta) {
      const { pct } = this.state.getProgress();
      meta.textContent = `CAPABILITY: ${VICTORY.stats.capability}  |  RANGE: ${VICTORY.stats.range}  |  COST: ${VICTORY.stats.cost}`;
      fadeIn(meta, 600, 1600);
    }
  }
}
