// data/content.js — Quests, items, NPCs, dialogs (merged content file)

// ─── QUEST DEFINITIONS ─────────────────────────────────────────
// Same 9 quests from V1, adapted for RPG context

export const QUESTS = [
  {
    id: 'install-tmux', level: 0, name: 'Install tmux', desc: 'Your session bodyguard',
    brief: 'Find the tmux tool in the Server Room and install it on the lab terminal.',
    body: `<h3>What is tmux?</h3><p>tmux is a <strong>terminal multiplexer</strong>. It keeps sessions alive even when you disconnect. Without it, closing the connection kills Claude Code.</p><h3>Steps</h3><ol class="step-list"><li>Open Terminal on your Mac</li><li>Run the install command below</li><li>Verify the installation</li></ol><div class="info-box"><strong>No Homebrew?</strong> Install it first: <code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></div>`,
    terminal: {
      title: 'Terminal — tmux install',
      commands: [
        { cmd: 'brew install tmux', output: '==> Downloading tmux-3.6a\n==> Installing tmux\n🍺  /opt/homebrew/Cellar/tmux/3.6a: 12 files, 1.2MB', successMsg: 'tmux installed!' },
        { cmd: 'tmux -V', output: 'tmux 3.6a', successMsg: 'Version confirmed.' },
      ]
    },
    checks: ['tmux installed via Homebrew', 'tmux -V shows version', 'Understand tmux keeps sessions alive'],
    reward: 'tmux',
  },
  {
    id: 'enable-ssh', level: 0, name: 'Enable SSH', desc: 'Open the door for remote access',
    brief: 'Activate Remote Login on your Mac to allow SSH connections.',
    body: `<h3>What is Remote Login?</h3><p>SSH lets other devices connect to your Mac's terminal remotely. macOS has a built-in SSH server — just flip the switch.</p><h3>Steps</h3><ol class="step-list"><li>System Settings → General → Sharing</li><li>Toggle <strong>Remote Login</strong> ON</li><li>Test with <code>ssh localhost</code></li></ol>`,
    terminal: {
      title: 'Terminal — SSH verification',
      commands: [
        { cmd: 'whoami', output: 'mohamedeslam', successMsg: 'Username noted.' },
        { cmd: 'ssh localhost', output: 'Password: ********\nLast login: Thu Feb 20 11:30:00 2026\nmohamedeslam@mac ~ %', successMsg: 'SSH is working!' },
      ]
    },
    checks: ['Remote Login is ON', 'ssh localhost works', 'Know your Mac username'],
    reward: 'sshkey',
  },
  {
    id: 'setup-tailscale-mac', level: 0, name: 'Setup Tailscale', desc: 'Create your VPN tunnel',
    brief: 'Install Tailscale to create a private mesh VPN between your devices.',
    body: `<h3>What is Tailscale?</h3><p>Tailscale creates a <strong>private VPN mesh network</strong>. Your Mac and iPhone get stable IPs that work anywhere — no port forwarding needed.</p><h3>Steps</h3><ol class="step-list"><li>Install via Homebrew</li><li>Authenticate in browser</li><li>Note your Tailscale IP</li></ol>`,
    terminal: {
      title: 'Terminal — Tailscale setup',
      commands: [
        { cmd: 'brew install --cask tailscale', output: '==> Installing Cask tailscale\n🍺  tailscale installed!', successMsg: 'Tailscale installed.' },
        { cmd: 'tailscale up', output: 'To authenticate, visit:\nhttps://login.tailscale.com/a/xxx\n\nSuccess.', successMsg: 'Authenticated.' },
        { cmd: 'tailscale ip -4', output: '100.111.40.88', successMsg: 'IP: 100.111.40.88 — save this!' },
      ]
    },
    checks: ['Tailscale in menu bar', 'Logged in', 'Wrote down IPv4 address', 'Remember account used'],
    reward: 'tailscale',
  },
  {
    id: 'tailscale-iphone', level: 1, name: 'Tailscale iPhone', desc: 'Join VPN from phone',
    brief: 'Install Tailscale on your iPhone and join the same network as your Mac.',
    body: `<h3>Connect your iPhone</h3><p>Your Mac is on Tailscale. Now your iPhone joins the same network.</p><h3>Steps</h3><ol class="step-list"><li>App Store → install Tailscale</li><li>Sign in with <strong>SAME account</strong> as Mac</li><li>Allow VPN configuration</li><li>Toggle ON</li></ol><div class="hint-box"><strong>Critical:</strong> Same account on both devices or they can't connect!</div>`,
    terminal: null,
    checks: ['Tailscale on iPhone', 'Same account as Mac', 'VPN ON', 'Both devices Connected', 'Mac visible in device list'],
    reward: null,
  },
  {
    id: 'setup-termius', level: 1, name: 'Setup Termius', desc: 'SSH client for iPhone',
    brief: 'Install and configure Termius — your mobile command center.',
    body: `<h3>What is Termius?</h3><p>Professional SSH client for iPhone with Ctrl/Tab/Esc keys — essential for tmux.</p><h3>Steps</h3><ol class="step-list"><li>Install from App Store</li><li>New Host: Tailscale IP, port 22, your username</li><li>Connect and verify</li></ol>`,
    terminal: null,
    checks: ['Termius installed', 'Host saved with Tailscale IP', 'First SSH connection works', 'See Mac prompt in Termius'],
    reward: 'termius',
  },
  {
    id: 'start-tmux-claude', level: 1, name: 'tmux + Claude', desc: 'Launch persistent session',
    brief: 'Launch Claude Code inside tmux — the power move.',
    body: `<h3>The Integration Moment</h3><p>Claude Code inside tmux = disconnect your phone and Claude keeps working. Reconnect anytime.</p><h3>Commands</h3><table class="cmd-table"><tr><th>Action</th><th>Command</th></tr><tr><td>New session</td><td><code>tmux new -s claude</code></td></tr><tr><td>Detach</td><td><code>Ctrl+B</code> then <code>D</code></td></tr><tr><td>Reattach</td><td><code>tmux attach -t claude</code></td></tr></table>`,
    terminal: {
      title: 'Terminal — tmux + Claude',
      commands: [
        { cmd: 'tmux new -s claude', output: '[new tmux session: claude]', successMsg: 'Session created.' },
        { cmd: 'claude', output: '╭──────────────────────────╮\n│    Claude Code v1.0     │\n╰──────────────────────────╯\n>', successMsg: 'Claude running in tmux!' },
        { cmd: 'tmux ls', output: 'claude: 1 windows (created Thu Feb 20)', successMsg: 'Session verified.' },
      ]
    },
    checks: ['tmux "claude" running', 'Claude launched inside', 'Can detach and reattach', 'tmux ls shows session'],
    reward: null,
  },
  {
    id: 'phone-connect', level: 2, name: 'Phone Connect', desc: 'Reach Claude from phone',
    brief: 'SSH from iPhone → attach to tmux → control Claude remotely.',
    body: `<h3>First Remote Connection</h3><p>SSH into your Mac from iPhone, then attach to the tmux session where Claude is waiting.</p><h3>Steps</h3><ol class="step-list"><li>Mac: Tailscale ON, tmux running</li><li>iPhone: Tailscale ON</li><li>Termius → tap Mac host</li><li>Attach to Claude's session</li></ol>`,
    terminal: {
      title: 'Termius — iPhone → Mac',
      commands: [
        { cmd: 'ssh mohamedeslam@100.111.40.88', output: 'Password: ********\nmohamedeslam@mac ~ %', successMsg: 'Connected from iPhone!' },
        { cmd: 'tmux attach -t claude', output: '[attached to session: claude]\n> Waiting for input...', successMsg: 'Controlling Claude from iPhone!' },
      ]
    },
    checks: ['Connected via Termius', 'Attached to tmux session', 'Can interact with Claude', 'Know how to detach'],
    reward: null,
  },
  {
    id: 'final-boss-roundtrip', level: 2, name: 'FINAL BOSS', desc: 'End-to-end round-trip',
    brief: 'The boss fight: start on Mac → walk away → connect from phone on different network → return.',
    body: `<h3>6 Phases — No Skipping</h3><ol class="step-list"><li><strong>START:</strong> <code>tmux new -s mission</code> + <code>claude</code></li><li><strong>DETACH:</strong> Ctrl+B then D</li><li><strong>MOVE:</strong> Leave Mac, switch to cellular/different WiFi</li><li><strong>CONNECT:</strong> Termius → SSH → <code>tmux attach -t mission</code></li><li><strong>INTERACT:</strong> Talk to Claude from phone</li><li><strong>RETURN:</strong> Detach, walk back, reattach on Mac</li></ol>`,
    terminal: {
      title: 'Terminal — Final Boss',
      commands: [
        { cmd: 'tmux new -s mission', output: '[new tmux session: mission]', successMsg: 'Phase 1: Started.' },
        { cmd: 'claude', output: '╭────────────────────────╮\n│   Claude Code v1.0    │\n╰────────────────────────╯\n>', successMsg: 'Phase 1: Claude running.' },
        { cmd: 'tmux attach -t mission', output: '[attached]\nClaude kept working...\n> Ready.', successMsg: 'Phase 4-5: Connected from phone!' },
        { cmd: 'tmux attach -t mission', output: '[attached]\nFull history preserved.\n> All phases complete.', successMsg: 'Phase 6: Round-trip complete!' },
      ]
    },
    checks: ['Phase 1: Started on Mac', 'Phase 2: Detached', 'Phase 3: Different network', 'Phase 4: Connected from phone', 'Phase 5: Interacted', 'Phase 6: Back on Mac'],
    reward: null,
  },
  {
    id: 'troubleshoot', level: 2, name: 'Troubleshoot', desc: 'Field manual',
    brief: 'Master the troubleshooting guide — bookmark this for the field.',
    body: `<h3>Field Manual</h3><table class="cmd-table"><tr><th>Problem</th><th>Fix</th></tr><tr><td>Connection refused</td><td>System Settings → Sharing → Remote Login ON</td></tr><tr><td>No route to host</td><td><code>tailscale status</code> — both devices ON?</td></tr><tr><td>Session not found</td><td><code>tmux ls</code> — create new if empty</td></tr><tr><td>Drops connection</td><td>Termius Keep Alive = 30s</td></tr><tr><td>Can't Ctrl+B</td><td>Termius special key bar or <code>tmux detach</code></td></tr><tr><td>Screen garbled</td><td><code>tmux attach -t name -d</code></td></tr><tr><td>Mac sleeping</td><td><code>caffeinate -s tmux new -s claude</code></td></tr><tr><td>IP changed</td><td>Use hostname: <code>mac.tailnet.ts.net</code></td></tr></table>`,
    terminal: null,
    checks: ['Read all 8 problems', 'Know tailscale status', 'Know caffeinate trick', 'Know Termius Ctrl key', 'Know hostname vs IP'],
    reward: null,
  },
];

// ─── ITEM DEFINITIONS ──────────────────────────────────────────

export const ITEM_DEFS = {
  tmux:      { name: 'tmux',       desc: 'Session bodyguard — keeps terminals alive', damage: 1, type: 'tool' },
  sshkey:    { name: 'SSH Key',    desc: 'Golden key — opens remote doors',           damage: 2, type: 'weapon' },
  tailscale: { name: 'Tailscale',  desc: 'VPN shield — protects your connection',     damage: 0, type: 'shield', defense: 2 },
  termius:   { name: 'Termius',    desc: 'Mobile command center — SSH from anywhere',  damage: 1, type: 'tool' },
  artifact:  { name: 'Artifact',   desc: 'Mysterious data fragment',                   damage: 0, type: 'artifact' },
  repair:    { name: 'Repair Kit', desc: 'Restores 2 HP',                              damage: 0, type: 'consumable', heal: 2 },
};

// ─── DIALOG TREES ──────────────────────────────────────────────

export const DIALOGS = {
  'guide-intro': [
    { speaker: 'SysAdmin', text: 'Welcome to the Mac Lab, Agent.' },
    { speaker: 'SysAdmin', text: 'Your mission: establish remote access to Claude Code from your iPhone.' },
    { speaker: 'SysAdmin', text: 'Start by finding the tmux tool in the Server Room to the west.' },
    { speaker: 'SysAdmin', text: 'Use the terminals (green screens) to complete each quest. Press E to interact.' },
    { speaker: 'SysAdmin', text: 'Watch out for bugs — they\'ll drain your HP. Use your tools to fight them!' },
  ],
  'bridge-guide': [
    { speaker: 'NetOps', text: 'You\'ve made it to the Network Bridge.' },
    { speaker: 'NetOps', text: 'This corridor connects your Mac to the phone network.' },
    { speaker: 'NetOps', text: 'Collect the Tailscale shield and Termius device to proceed.' },
    { speaker: 'NetOps', text: 'The ghosts here are "No Route" errors — your Tailscale shield helps deflect them.' },
  ],
  'command-guide': [
    { speaker: 'Commander', text: 'Agent. Welcome to Command Center.' },
    { speaker: 'Commander', text: 'The boss arena lies ahead. Three bugs guard it.' },
    { speaker: 'Commander', text: 'Complete the Phone Connect quest, then face the Final Boss: Round-Trip Test.' },
    { speaker: 'Commander', text: 'The troubleshooting terminals are in the south wing — use them if you get stuck.' },
    { speaker: 'Commander', text: 'Good luck. The world is watching.' },
  ],
};

// ─── NARRATIVE ─────────────────────────────────────────────────

export const NARRATIVE = {
  title: 'OPERATION: REMOTE AGENT',
  subtitle: 'Control Claude Code from anywhere in the world',
  intro: [
    'AGENT,',
    '',
    'Your mission: infiltrate three secure facilities',
    'and establish remote access to Claude Code.',
    '',
    'Navigate the Mac Lab, cross the Network Bridge,',
    'and reach the Command Center.',
    '',
    'Collect tools. Defeat bugs. Complete quests.',
    'The fate of remote productivity rests with you.',
    '',
    'WASD to move. E to interact. SPACE to attack.',
    '',
    'Good luck.',
  ],
  victory: [
    '╔══════════════════════════════════════╗',
    '║                                      ║',
    '║  OPERATION: REMOTE AGENT — COMPLETE  ║',
    '║                                      ║',
    '║  You can now control Claude Code     ║',
    '║  from anywhere in the world.         ║',
    '║                                      ║',
    '╚══════════════════════════════════════╝',
  ],
};
