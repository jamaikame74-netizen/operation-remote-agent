// src/data/levels.js — 3 progressive level definitions

export const LEVELS = [
  {
    id: 'mac-foundation',
    name: 'Mac Foundation',
    phase: 'op',
    badge: 'LEVEL 1',
    tagline: 'Prepare your Mac for remote operations',
    questRange: [0, 2], // quest indices inclusive
    intro: 'Establish the base. Install tmux for session persistence, enable SSH for remote access, and deploy Tailscale for global connectivity.',
    archNodes: ['archMac', 'archTmux', 'archSSH'],
    color: 'var(--green)'
  },
  {
    id: 'phone-bridge',
    name: 'Phone Bridge',
    phase: 'mid',
    badge: 'LEVEL 2',
    tagline: 'Connect your iPhone to the network',
    questRange: [3, 5],
    intro: 'Bridge the gap. Install Tailscale on your iPhone, configure Termius as your SSH command center, and launch Claude Code inside a persistent tmux session.',
    archNodes: ['archPhone', 'archTermius', 'archClient', 'archClaude', 'archCode'],
    color: 'var(--orange)'
  },
  {
    id: 'full-control',
    name: 'Full Control',
    phase: 'end',
    badge: 'LEVEL 3',
    tagline: 'Validate end-to-end remote control',
    questRange: [6, 8],
    intro: 'Prove it works. Connect from your phone, pass the round-trip boss fight across different networks, and master field troubleshooting.',
    archNodes: ['archMac', 'archPhone', 'archTmux', 'archClaude', 'archCode', 'archTermius', 'archSSH', 'archClient'],
    color: 'var(--cyan)'
  }
];
