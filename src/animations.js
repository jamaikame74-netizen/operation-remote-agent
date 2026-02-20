// src/animations.js — Typewriter, transitions, glow effects

/**
 * Typewriter effect: types text line-by-line into an element.
 * @param {HTMLElement} container — target element
 * @param {string[]} lines — lines to type
 * @param {object} opts
 * @param {number} [opts.charDelay=25] — ms per character
 * @param {number} [opts.lineDelay=100] — ms pause between lines
 * @param {function} [opts.onLineComplete] — called after each line (lineIndex)
 * @param {function} [opts.onComplete] — called when all lines typed
 * @returns {{ cancel: Function }} — call cancel() to abort
 */
export function typewriter(container, lines, opts = {}) {
  const {
    charDelay = 25,
    lineDelay = 100,
    onLineComplete,
    onComplete
  } = opts;

  let cancelled = false;
  let cursor = null;

  // Add blinking cursor
  function ensureCursor() {
    if (!cursor) {
      cursor = document.createElement('span');
      cursor.className = 'cursor';
    }
    container.appendChild(cursor);
  }

  function removeCursor() {
    if (cursor && cursor.parentNode) {
      cursor.parentNode.removeChild(cursor);
    }
  }

  async function run() {
    for (let li = 0; li < lines.length; li++) {
      if (cancelled) return;

      const line = lines[li];

      // Empty lines = just a line break
      if (line === '') {
        removeCursor();
        container.appendChild(document.createElement('br'));
        ensureCursor();
        await delay(lineDelay);
        continue;
      }

      // Type each character
      const span = document.createElement('span');
      container.insertBefore(span, cursor);

      for (let ci = 0; ci < line.length; ci++) {
        if (cancelled) return;
        span.textContent += line[ci];
        removeCursor();
        ensureCursor();
        await delay(charDelay);
      }

      // End of line
      removeCursor();
      container.appendChild(document.createElement('br'));
      ensureCursor();

      if (onLineComplete) onLineComplete(li);
      await delay(lineDelay);
    }

    // Done — keep cursor blinking
    if (!cancelled && onComplete) {
      onComplete();
    }
  }

  ensureCursor();
  run();

  return {
    cancel() {
      cancelled = true;
      removeCursor();
    },
    skip() {
      cancelled = true;
      removeCursor();
      container.innerHTML = '';
      lines.forEach((line, i) => {
        if (line === '') {
          container.appendChild(document.createElement('br'));
        } else {
          const span = document.createElement('span');
          span.textContent = line;
          container.appendChild(span);
          container.appendChild(document.createElement('br'));
        }
      });
      if (onComplete) onComplete();
    }
  };
}

/**
 * Fade in an element with optional delay.
 */
export function fadeIn(el, durationMs = 500, delayMs = 0) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';
  el.style.transition = `opacity ${durationMs}ms ease ${delayMs}ms, transform ${durationMs}ms ease ${delayMs}ms`;

  // Force reflow
  el.offsetHeight;

  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
}

/**
 * Show a level transition overlay for a set duration.
 * @param {string} title
 * @param {string} subtitle
 * @param {number} [durationMs=2000]
 * @returns {Promise<void>}
 */
export function showLevelTransition(title, subtitle, durationMs = 2000) {
  return new Promise(resolve => {
    const overlay = document.getElementById('levelTransition');
    if (!overlay) { resolve(); return; }

    const titleEl = overlay.querySelector('.level-trans-title');
    const subtitleEl = overlay.querySelector('.level-trans-subtitle');
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;

    overlay.classList.add('active');

    setTimeout(() => {
      overlay.classList.remove('active');
      setTimeout(resolve, 400); // wait for fade-out
    }, durationMs);
  });
}

/**
 * Glow-pulse an element once.
 */
export function glowPulse(el) {
  el.style.transition = 'text-shadow 0.3s ease';
  el.style.textShadow = '0 0 12px rgba(0,255,65,0.6), 0 0 24px rgba(0,255,65,0.3)';
  setTimeout(() => {
    el.style.textShadow = '';
  }, 800);
}

// ─── Utils ──────────────────────────────────────────────────────
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
