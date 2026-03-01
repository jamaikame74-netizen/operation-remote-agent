// src/data/narrative-windows.js — Windows mission briefing, level intros, victory text

export const BRIEFING_WINDOWS = {
  classification: 'CLASSIFIED // OPERATION: REMOTE AGENT',
  date: 'BRIEFING DATE: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  lines: [
    'AGENT,',
    '',
    'Your mission: establish persistent remote access to Claude Code',
    'from any location on Earth using only your iPhone.',
    '',
    'Platform detected: WINDOWS. Deploying WSL-based stack:',
    '',
    '  WSL (Ubuntu) ... Linux environment on Windows (tmux lives here)',
    '  OpenSSH Server . Windows built-in SSH server (your entry point)',
    '  Tailscale ...... encrypted VPN mesh (works on any network)',
    '  Termius ........ iPhone SSH client (mobile command center)',
    '',
    'Once operational, you will be able to:',
    '  • Start Claude on your PC and walk away',
    '  • Connect from your phone — gym, cafe, commute',
    '  • Claude keeps working while you\'re disconnected',
    '  • Full conversation history preserved across sessions',
    '',
    'Total cost: $0. Total setup time: ~35 minutes.',
    'Operational range: Global.',
    '',
    'Good luck, Agent.'
  ],
  archDiagram: [
    '┌──────────────┐     Tailscale VPN      ┌──────────────┐',
    '│   WIN PC     │◄─────────────────────►│  YOUR iPHONE │',
    '│              │   (encrypted tunnel)   │              │',
    '│  WSL + tmux  │                        │  Termius     │',
    '│  └─ Claude   │◄─── SSH over VPN ─────│  └─ SSH      │',
    '│     Code     │                        │     client   │',
    '└──────────────┘                        └──────────────┘'
  ],
  // HTML version for the interactive HUD diagram (node spans kept identical for highlight logic)
  archHtml: `<span class="highlight">┌──────────────┐</span>     Tailscale VPN      <span class="highlight">┌──────────────┐</span>
<span class="highlight">│</span>   <span class="node" id="archMac">WIN PC</span>      <span class="highlight">│</span>◄─────────────────────►<span class="highlight">│</span>  <span class="node" id="archPhone">YOUR iPHONE</span> <span class="highlight">│</span>
<span class="highlight">│</span>              <span class="highlight">│</span>   (encrypted tunnel)   <span class="highlight">│</span>              <span class="highlight">│</span>
<span class="highlight">│</span>  <span class="node" id="archTmux">WSL+tmux</span>    <span class="highlight">│</span>                        <span class="highlight">│</span>  <span class="node" id="archTermius">Termius</span>     <span class="highlight">│</span>
<span class="highlight">│</span>  └─ <span class="node" id="archClaude">Claude</span>   <span class="highlight">│</span>◄─── SSH over VPN ─────<span class="highlight">│</span>  └─ <span class="node" id="archSSH">SSH</span>      <span class="highlight">│</span>
<span class="highlight">│</span>     <span class="node" id="archCode">Code</span>     <span class="highlight">│</span>                        <span class="highlight">│</span>     <span class="node" id="archClient">client</span>   <span class="highlight">│</span>
<span class="highlight">└──────────────┘</span>                        <span class="highlight">└──────────────┘</span>`
};

export const LEVEL_INTROS_WINDOWS = [
  {
    title: 'LEVEL 1: WINDOWS FOUNDATION',
    subtitle: 'Preparing the base station',
    text: 'Your Windows PC is about to become a remote-accessible AI workstation. WSL gives you Linux. SSH opens the door. Tailscale makes it global.'
  },
  {
    title: 'LEVEL 2: PHONE BRIDGE',
    subtitle: 'Connecting the mobile command center',
    text: 'Time to bring your iPhone into the network. The bridge between your PC and the rest of the world.'
  },
  {
    title: 'LEVEL 3: FULL CONTROL',
    subtitle: 'Validating the operation',
    text: 'Everything is deployed. Now prove it works — from a different network, a different location, a different device.'
  }
];

export const VICTORY_WINDOWS = {
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
      { name: 'WSL + tmux', status: 'ACTIVE', desc: 'Linux env + session persistence' },
      { name: 'OpenSSH', status: 'ACTIVE', desc: 'Windows SSH server' },
      { name: 'Tailscale', status: 'ACTIVE', desc: 'Global VPN mesh' },
      { name: 'Termius', status: 'ACTIVE', desc: 'Mobile SSH client' }
    ],
    capability: 'FULLY OPERATIONAL',
    range: 'GLOBAL',
    cost: 'FREE'
  },
  closingLine: 'Go build something. From anywhere.'
};
