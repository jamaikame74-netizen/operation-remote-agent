// src/data/narrative.js — Mission briefing, level intros, victory text

export const BRIEFING = {
  classification: 'CLASSIFIED // OPERATION: REMOTE AGENT',
  date: 'BRIEFING DATE: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  lines: [
    'AGENT,',
    '',
    'Your mission: establish persistent remote access to Claude Code',
    'from any location on Earth using only your iPhone.',
    '',
    'The operation requires deploying a 4-component stack:',
    '',
    '  tmux ........... session persistence (survives disconnects)',
    '  SSH ............ secure remote terminal access',
    '  Tailscale ...... encrypted VPN mesh (works on any network)',
    '  Termius ........ iPhone SSH client (mobile command center)',
    '',
    'Once operational, you will be able to:',
    '  • Start Claude on your Mac and walk away',
    '  • Connect from your phone — gym, cafe, commute',
    '  • Claude keeps working while you\'re disconnected',
    '  • Full conversation history preserved across sessions',
    '',
    'Total cost: $0. Total setup time: ~30 minutes.',
    'Operational range: Global.',
    '',
    'Good luck, Agent.'
  ],
  archDiagram: [
    '┌──────────────┐     Tailscale VPN      ┌──────────────┐',
    '│   YOUR MAC   │◄─────────────────────►│  YOUR iPHONE │',
    '│              │   (encrypted tunnel)   │              │',
    '│  tmux        │                        │  Termius     │',
    '│  └─ Claude   │◄─── SSH over VPN ─────│  └─ SSH      │',
    '│     Code     │                        │     client   │',
    '└──────────────┘                        └──────────────┘'
  ]
};

export const LEVEL_INTROS = [
  {
    title: 'LEVEL 1: MAC FOUNDATION',
    subtitle: 'Preparing the base station',
    text: 'Your Mac is about to become a remote-accessible AI workstation. Three components to install. Three doors to open.'
  },
  {
    title: 'LEVEL 2: PHONE BRIDGE',
    subtitle: 'Connecting the mobile command center',
    text: 'Time to bring your iPhone into the network. The bridge between your Mac and the rest of the world.'
  },
  {
    title: 'LEVEL 3: FULL CONTROL',
    subtitle: 'Validating the operation',
    text: 'Everything is deployed. Now prove it works — from a different network, a different location, a different device.'
  }
];

export const VICTORY = {
  banner: [
    '╔══════════════════════════════════════════════════╗',
    '║                                                  ║',
    '║    OPERATION: REMOTE AGENT — COMPLETE            ║',
    '║                                                  ║',
    '║    You can now control Claude Code               ║',
    '║    from anywhere in the world.                   ║',
    '║                                                  ║',
    '╚══════════════════════════════════════════════════╝'
  ],
  stats: {
    components: [
      { name: 'tmux', status: 'ACTIVE', desc: 'Session persistence' },
      { name: 'SSH', status: 'ACTIVE', desc: 'Remote terminal access' },
      { name: 'Tailscale', status: 'ACTIVE', desc: 'Global VPN mesh' },
      { name: 'Termius', status: 'ACTIVE', desc: 'Mobile SSH client' }
    ],
    capability: 'FULLY OPERATIONAL',
    range: 'GLOBAL',
    cost: 'FREE'
  },
  closingLine: 'Go build something. From anywhere.'
};
