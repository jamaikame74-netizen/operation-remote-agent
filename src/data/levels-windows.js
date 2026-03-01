// src/data/levels-windows.js — 3 progressive level definitions for Windows

export const LEVELS_WINDOWS = [
  {
    id: 'windows-foundation',
    name: 'Windows Foundation',
    phase: 'op',
    badge: 'LEVEL 1',
    tagline: 'Prepare your PC for remote operations',
    questRange: [0, 2],
    intro: 'Arm the base. Install WSL for a Linux environment, enable the SSH Server for remote access, and deploy Tailscale for global connectivity.',
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
    intro: 'Bridge the gap. Install Tailscale on your iPhone, configure Termius as your SSH command center, and launch Claude Code inside a persistent WSL tmux session.',
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
    intro: 'Prove it works. Connect from your phone, pass the round-trip boss fight across different networks, and master Windows field troubleshooting.',
    archNodes: ['archMac', 'archPhone', 'archTmux', 'archClaude', 'archCode', 'archTermius', 'archSSH', 'archClient'],
    color: 'var(--cyan)'
  }
];
