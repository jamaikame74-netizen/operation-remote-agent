// src/data/quests.js — All 9 quest definitions
// Each quest: id, level index, name, desc, archHighlight nodes,
// body HTML, terminal config (or null), validation checks, hint

export const QUESTS = [
  // ─── LEVEL 0: Mac Foundation ───────────────────────────────────
  {
    id: 'install-tmux',
    level: 0,
    name: 'Install tmux',
    desc: 'Your session bodyguard',
    archHighlight: ['archTmux'],
    body: `
      <h3>What is tmux?</h3>
      <p>tmux is a <strong>terminal multiplexer</strong>. It keeps your terminal sessions alive even when you close the window, disconnect SSH, or your phone goes to sleep. Without tmux, closing the connection kills Claude Code mid-thought.</p>
      <p>Think of it as a bodyguard for your terminal session — it stays running in the background no matter what.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Open <strong>Terminal</strong> on your Mac (Spotlight → "Terminal")</li>
        <li>Install tmux with Homebrew (run the command in the terminal below)</li>
        <li>Verify the installation by checking the version</li>
      </ol>

      <div class="info-box">
        <strong>No Homebrew?</strong> Install it first: <code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code>
      </div>
    `,
    terminal: {
      title: 'Terminal — tmux install',
      commands: [
        {
          cmd: 'brew install tmux',
          output: '==> Downloading tmux-3.6a\n==> Installing tmux\n==> Summary\n🍺  /opt/homebrew/Cellar/tmux/3.6a: 12 files, 1.2MB',
          successMsg: 'tmux installed successfully.'
        },
        {
          cmd: 'tmux -V',
          output: 'tmux 3.6a',
          successMsg: 'Version confirmed — tmux is ready.'
        }
      ]
    },
    checks: [
      'tmux is installed via Homebrew',
      'tmux -V shows a version number',
      'You understand tmux keeps sessions alive'
    ],
    hint: 'tmux must be installed before anything else — it\'s the foundation that keeps Claude alive when you disconnect.'
  },

  {
    id: 'enable-ssh',
    level: 0,
    name: 'Enable SSH (Remote Login)',
    desc: 'Open the door for remote connections',
    archHighlight: ['archSSH'],
    body: `
      <h3>What is Remote Login?</h3>
      <p>SSH (Secure Shell) lets other devices connect to your Mac's terminal remotely. macOS has an SSH server built in — you just need to flip the switch in System Settings.</p>
      <p>This is the "door" your iPhone will knock on to reach your Mac.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Open <strong>System Settings</strong> (Apple menu → System Settings)</li>
        <li>Navigate to <strong>General → Sharing</strong></li>
        <li>Toggle <strong>Remote Login</strong> to ON</li>
        <li>Ensure your user account has access (it should by default)</li>
        <li>Test SSH locally in the terminal below</li>
      </ol>

      <div class="info-box">
        <strong>Why test locally?</strong> Running <code>ssh localhost</code> proves the SSH server is working before we add network complexity.
      </div>
    `,
    terminal: {
      title: 'Terminal — SSH verification',
      commands: [
        {
          cmd: 'whoami',
          output: 'mohamedeslam',
          successMsg: 'Username noted — you\'ll need this for Termius later.'
        },
        {
          cmd: 'ssh localhost',
          output: 'The authenticity of host \'localhost\' can\'t be established.\nAre you sure you want to continue connecting? (yes)\nPassword: ********\nLast login: Thu Feb 20 11:30:00 2026\nmohamedeslam@mac ~ %',
          successMsg: 'SSH is working! Remote Login is enabled.'
        }
      ]
    },
    checks: [
      'Remote Login is ON in System Settings',
      'ssh localhost connects successfully',
      'You know your Mac username (from whoami)'
    ],
    hint: 'If ssh localhost fails with "Connection refused", Remote Login is not enabled. Double-check System Settings → General → Sharing.'
  },

  {
    id: 'setup-tailscale-mac',
    level: 0,
    name: 'Setup Tailscale on Mac',
    desc: 'Create your private VPN tunnel',
    archHighlight: ['archMac'],
    body: `
      <h3>What is Tailscale?</h3>
      <p>Tailscale creates a <strong>private VPN mesh network</strong> between your devices. Your Mac and iPhone get stable IPs (like <code>100.x.x.x</code>) that work anywhere — home WiFi, cellular, hotel, coffee shop, another country.</p>
      <p>No port forwarding. No router configuration. No monthly fees. Just install, log in, and your devices can find each other globally.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Install Tailscale via Homebrew</li>
        <li>Start Tailscale and authenticate in the browser</li>
        <li>Get your Tailscale IP — <strong>write this down!</strong></li>
      </ol>

      <div class="info-box">
        <strong>Sign in with:</strong> Google, Microsoft, GitHub, Apple, or email. Remember which account you use — you'll need the <strong>same one</strong> on your iPhone.
      </div>

      <div class="hint-box">
        <strong>Pro tip:</strong> Use <code>tailscale status</code> to see your hostname (e.g., <code>mac.tailnet.ts.net</code>). This hostname never changes, even if the IP does.
      </div>
    `,
    terminal: {
      title: 'Terminal — Tailscale setup',
      commands: [
        {
          cmd: 'brew install --cask tailscale',
          output: '==> Downloading Tailscale\n==> Installing Cask tailscale\n==> Moving App \'Tailscale.app\' to \'/Applications/Tailscale.app\'\n🍺  tailscale was successfully installed!',
          successMsg: 'Tailscale installed.'
        },
        {
          cmd: 'tailscale up',
          output: 'To authenticate, visit:\n\n\thttps://login.tailscale.com/a/b57e0cf01df16\n\nSuccess.',
          successMsg: 'Authenticated with Tailscale network.'
        },
        {
          cmd: 'tailscale ip -4',
          output: '100.111.40.88',
          successMsg: 'Your Tailscale IP: 100.111.40.88 — save this!'
        }
      ]
    },
    checks: [
      'Tailscale is installed and in your menu bar',
      'You\'re logged in with your chosen account',
      'You wrote down your Tailscale IPv4 address',
      'You remember which account you used'
    ],
    hint: 'Your Tailscale IP is how your phone will find your Mac from anywhere on Earth. Treat it like your Mac\'s phone number.'
  },

  // ─── LEVEL 1: Phone Bridge ────────────────────────────────────
  {
    id: 'tailscale-iphone',
    level: 1,
    name: 'Tailscale on iPhone',
    desc: 'Join the VPN from your phone',
    archHighlight: ['archPhone'],
    body: `
      <h3>Connect your iPhone to the same VPN</h3>
      <p>Your Mac is on Tailscale. Now your iPhone needs to join the <strong>same network</strong> so it can reach your Mac from anywhere in the world.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Open the <strong>App Store</strong> on your iPhone</li>
        <li>Search for <strong>"Tailscale"</strong> and install it (free)</li>
        <li>Open the app and tap <strong>Sign In</strong></li>
        <li>Sign in with the <strong>SAME account</strong> you used on your Mac</li>
        <li>Allow the VPN configuration when prompted (iOS will ask)</li>
        <li>Toggle Tailscale <strong>ON</strong></li>
      </ol>

      <div class="hint-box">
        <strong>Critical:</strong> You MUST use the same account on both devices. Different accounts = different networks = can't connect. This is the #1 mistake people make.
      </div>

      <h3>Verify</h3>
      <p>In the Tailscale app on your phone, you should see both your Mac and your iPhone listed as <strong>Connected</strong>. Two green dots = success.</p>
    `,
    terminal: null,
    checks: [
      'Tailscale is installed on your iPhone',
      'Signed in with the SAME account as Mac',
      'VPN toggle is ON',
      'Both devices show as Connected in the app',
      'You can see your Mac listed in the device list'
    ],
    hint: 'If your Mac doesn\'t appear in the phone\'s device list, make sure Tailscale is running on your Mac (check the menu bar icon — it should show "Connected").'
  },

  {
    id: 'setup-termius',
    level: 1,
    name: 'Setup Termius',
    desc: 'Your SSH command center on iPhone',
    archHighlight: ['archTermius', 'archClient'],
    body: `
      <h3>What is Termius?</h3>
      <p>Termius is a professional SSH client for iPhone. It gives you a proper terminal on your phone with a special keyboard that has <strong>Ctrl, Tab, Esc</strong> keys — essential for tmux control.</p>
      <p>It's the most recommended SSH client in the Claude Code community. Free tier has everything you need.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Install <strong>Termius</strong> from the App Store (free)</li>
        <li>Open it and create an account (or skip for now)</li>
        <li>Tap <strong>+ New Host</strong> and configure:</li>
      </ol>

      <table class="cmd-table">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Label</td><td>My Mac</td></tr>
        <tr><td>Hostname</td><td><code>100.x.x.x</code> (your Tailscale IP)</td></tr>
        <tr><td>Port</td><td><code>22</code></td></tr>
        <tr><td>Username</td><td>Your Mac username (from <code>whoami</code>)</td></tr>
      </table>

      <h3>First Connection</h3>
      <p>Tap the saved host, accept the SSH fingerprint prompt, and enter your Mac password. You should see your Mac's terminal prompt.</p>

      <div class="info-box">
        <strong>Pro tips:</strong><br>
        • Save your password in Termius for quick access<br>
        • Enable <strong>Keep Alive</strong> in SSH settings to prevent disconnections<br>
        • Use landscape mode for more terminal width<br>
        • iOS dictation (🎙️ button) lets you speak commands
      </div>
    `,
    terminal: null,
    checks: [
      'Termius is installed on iPhone',
      'Host saved with Tailscale IP and username',
      'First SSH connection successful',
      'You can see your Mac\'s prompt in Termius'
    ],
    hint: 'Alternatives: Blink Shell (paid, better for iPad), Prompt 3 (paid). The setup flow is similar for any SSH client.'
  },

  {
    id: 'start-tmux-claude',
    level: 1,
    name: 'Start tmux + Claude Session',
    desc: 'Launch a persistent Claude session',
    archHighlight: ['archTmux', 'archClaude', 'archCode'],
    body: `
      <h3>The Integration Moment</h3>
      <p>This is where it all comes together: Claude Code running inside tmux. This means you can <strong>disconnect your phone</strong> and Claude keeps working. Reconnect later to pick up exactly where you left off.</p>
      <p>Start tasks on your Mac, check progress from the gym. Give Claude a big job, check on it during lunch. This is the power move.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Create a named tmux session</li>
        <li>Launch Claude Code inside it</li>
        <li>Practice detaching (Ctrl+B then D) and reattaching</li>
      </ol>

      <table class="cmd-table">
        <tr><th>Action</th><th>Command / Keys</th></tr>
        <tr><td>New session</td><td><code>tmux new -s claude</code></td></tr>
        <tr><td>Detach</td><td><code>Ctrl+B</code> then <code>D</code></td></tr>
        <tr><td>Reattach</td><td><code>tmux attach -t claude</code></td></tr>
        <tr><td>List sessions</td><td><code>tmux ls</code></td></tr>
      </table>

      <div class="hint-box">
        <strong>Key insight:</strong> Detaching does NOT stop Claude. It's like minimizing a window — the process runs in the background. <code>tmux ls</code> proves it's still there.
      </div>
    `,
    terminal: {
      title: 'Terminal — tmux + Claude Code',
      commands: [
        {
          cmd: 'tmux new -s claude',
          output: '[new tmux session: claude]\n\n  ╭─────────────────────────────────────╮\n  │  Welcome to tmux session "claude"  │\n  ╰─────────────────────────────────────╯',
          successMsg: 'tmux session "claude" created.'
        },
        {
          cmd: 'claude',
          output: '\n╭──────────────────────────────────────╮\n│          Claude Code v1.0           │\n│   Type a message to get started     │\n╰──────────────────────────────────────╯\n\n>',
          successMsg: 'Claude Code is running inside tmux!'
        },
        {
          cmd: 'tmux ls',
          output: 'claude: 1 windows (created Thu Feb 20 11:45:00 2026)',
          successMsg: 'Session verified — Claude is running in the background.'
        }
      ]
    },
    checks: [
      'tmux session "claude" is running',
      'Claude Code launched inside tmux',
      'You can detach (Ctrl+B, D) and reattach',
      'tmux ls shows the session persists'
    ],
    hint: 'After detaching with Ctrl+B then D, Claude keeps running. tmux ls confirms it\'s still there.'
  },

  // ─── LEVEL 2: Full Control ────────────────────────────────────
  {
    id: 'phone-connect',
    level: 2,
    name: 'Connect from iPhone',
    desc: 'Reach Claude from your phone',
    archHighlight: ['archTermius', 'archSSH', 'archClient', 'archTmux', 'archClaude', 'archCode'],
    body: `
      <h3>First Remote Connection</h3>
      <p>SSH into your Mac from your iPhone, then attach to the tmux session where Claude is waiting. This is the moment it all clicks — Claude Code on your phone.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>On your Mac: verify Tailscale is ON and tmux session is running (<code>tmux ls</code>)</li>
        <li>On your iPhone: open Tailscale (verify it's ON and connected)</li>
        <li>Open Termius and tap your saved Mac host</li>
        <li>Once connected, attach to Claude's session</li>
        <li>Interact with Claude from your phone!</li>
      </ol>

      <div class="info-box">
        <strong>Ctrl+B on iPhone:</strong> Termius has a special key toolbar above the keyboard. Tap <code>Ctrl</code> → <code>B</code> → release → then tap <code>D</code> to detach. Or just type <code>tmux detach</code>.
      </div>

      <div class="hint-box">
        <strong>Stuck?</strong> Run <code>hostname</code> and <code>whoami</code> after connecting to confirm you're actually on your Mac, not still on your phone.
      </div>
    `,
    terminal: {
      title: 'Termius — iPhone → Mac',
      commands: [
        {
          cmd: 'ssh mohamedeslam@100.111.40.88',
          output: 'Password: ********\nLast login: Thu Feb 20 12:00:00 2026\nmohamedeslam@mac ~ %',
          successMsg: 'Connected to Mac from iPhone!'
        },
        {
          cmd: 'tmux attach -t claude',
          output: '\n[attached to session: claude]\n\n╭──────────────────────────────────────╮\n│          Claude Code v1.0           │\n│                                     │\n│  > Waiting for input...             │\n╰──────────────────────────────────────╯',
          successMsg: 'You\'re controlling Claude Code from your iPhone!'
        }
      ]
    },
    checks: [
      'Connected to Mac via Termius over Tailscale',
      'Attached to tmux "claude" session',
      'Can see and interact with Claude Code',
      'Know how to detach from phone (Ctrl+B, D)'
    ],
    hint: 'If "session not found", run tmux ls first to check the session name. You might have named it something different.'
  },

  {
    id: 'final-boss-roundtrip',
    level: 2,
    name: 'FINAL BOSS: Round-Trip',
    desc: 'The ultimate end-to-end validation',
    archHighlight: ['archMac', 'archPhone', 'archTmux', 'archClaude', 'archCode', 'archTermius', 'archSSH', 'archClient'],
    body: `
      <h3>The Ultimate Test</h3>
      <p>This is the boss fight. Start Claude on Mac → walk away → connect from phone on a <strong>completely different network</strong> → interact → return to Mac. Six phases, no skipping.</p>

      <h3>Execute All 6 Phases</h3>
      <ol class="step-list">
        <li><strong>START:</strong> On your Mac, run <code>tmux new -s mission</code>, launch <code>claude</code>, and give it a long-running task</li>
        <li><strong>DETACH:</strong> Press <code>Ctrl+B</code> then <code>D</code>. Claude works in the background while you walk away</li>
        <li><strong>MOVE:</strong> Physically leave your Mac. Switch to cellular data or different WiFi (coffee shop, gym, etc.)</li>
        <li><strong>CONNECT:</strong> On your phone: Tailscale ON → Termius → SSH in → <code>tmux attach -t mission</code></li>
        <li><strong>INTERACT:</strong> Read Claude's output. Ask a follow-up question. You're driving from your phone on a different network</li>
        <li><strong>RETURN:</strong> Detach on phone. Walk back to Mac. <code>tmux attach -t mission</code>. Everything is there</li>
      </ol>

      <div class="hint-box">
        <strong>The real test:</strong> Turn OFF WiFi on your phone and use cellular data. This proves the Tailscale VPN works across completely separate networks.
      </div>
    `,
    terminal: {
      title: 'Terminal — Final Boss Simulation',
      commands: [
        {
          cmd: 'tmux new -s mission',
          output: '[new tmux session: mission]',
          successMsg: 'Phase 1: Mission session started.'
        },
        {
          cmd: 'claude',
          output: '╭──────────────────────────────────────╮\n│          Claude Code v1.0           │\n╰──────────────────────────────────────╯\n> ',
          successMsg: 'Phase 1: Claude is running. Give it a task, then detach.'
        },
        {
          cmd: 'tmux attach -t mission',
          output: '[attached to session: mission]\n\nClaude has been working while you were away...\n\n> Task completed. Ready for next instruction.\n>',
          successMsg: 'Phase 4-5: Connected from phone! Claude kept working.'
        },
        {
          cmd: 'tmux attach -t mission',
          output: '[attached to session: mission]\n\nFull conversation history preserved.\nYour Mac interaction → Phone interaction → Back to Mac.\n\n> All phases complete.',
          successMsg: 'Phase 6: Back on Mac. Full round-trip successful!'
        }
      ]
    },
    checks: [
      'Phase 1: Started Claude in tmux on Mac',
      'Phase 2: Detached and walked away',
      'Phase 3: On a different network (cellular/different WiFi)',
      'Phase 4: Connected from phone via Termius',
      'Phase 5: Interacted with Claude from phone',
      'Phase 6: Returned to Mac with full session history'
    ],
    hint: 'This is the real-world proof. If all 6 phases work, you have global remote access to Claude Code.'
  },

  {
    id: 'troubleshoot',
    level: 2,
    name: 'Side Quest: Troubleshooting',
    desc: 'Field manual for common problems',
    archHighlight: [],
    body: `
      <h3>Field Manual</h3>
      <p>Bookmark this quest. You'll come back to it when something breaks in the field.</p>

      <table class="cmd-table">
        <tr><th>Problem</th><th>Fix</th></tr>
        <tr><td>"Connection refused"</td><td>Enable Remote Login: <strong>System Settings → General → Sharing</strong>. Also check Mac isn't sleeping: <strong>System Settings → Energy Saver → Prevent automatic sleeping</strong></td></tr>
        <tr><td>"No route to host" / timeout</td><td>Check Tailscale is ON on both devices: <code>tailscale status</code>. Run <code>tailscale up</code> if needed</td></tr>
        <tr><td>"Session not found"</td><td>Run <code>tmux ls</code> — if empty, create a new session. Sessions don't survive Mac reboots</td></tr>
        <tr><td>Connection keeps dropping</td><td>Enable <strong>Keep Alive</strong> in Termius SSH settings with 30-second intervals</td></tr>
        <tr><td>Can't type Ctrl+B on iPhone</td><td>Use Termius special key toolbar: tap Ctrl → B → D. Or type <code>tmux detach</code> command</td></tr>
        <tr><td>Screen garbled / wrong size</td><td>Detach other clients first: <code>tmux attach -t name -d</code>. Or resize: <code>Ctrl+B</code> then <code>:resize-window -A</code></td></tr>
        <tr><td>Mac falls asleep</td><td>Wrap session in caffeinate: <code>caffeinate -s tmux new -s claude</code>. Or set Energy Saver to prevent sleep</td></tr>
        <tr><td>Tailscale IP changed</td><td>Use stable hostname instead: <code>your-mac.tailnet.ts.net</code> (find with <code>tailscale status</code>)</td></tr>
      </table>

      <div class="info-box">
        <strong>Pro tip:</strong> Use your Tailscale hostname instead of the IP in Termius — it never changes. Find it with <code>tailscale status</code> and look for the <code>.ts.net</code> address.
      </div>

      <div class="hint-box">
        <strong>Nuclear option:</strong> If everything is broken, restart in order: Tailscale on Mac → Tailscale on iPhone → verify <code>tailscale status</code> shows both → test SSH → test tmux.
      </div>
    `,
    terminal: null,
    checks: [
      'Read through all 8 common problems',
      'Know how to check Tailscale status',
      'Know the caffeinate trick for preventing sleep',
      'Know how to use Ctrl key in Termius',
      'Know to use hostname instead of IP'
    ],
    hint: 'The #1 cause of problems: Tailscale being OFF on one device. Always check that first.'
  }
];
