// src/data/quests-windows.js — All 9 Windows quest definitions

export const QUESTS_WINDOWS = [

  // ─── LEVEL 0: Windows Foundation ──────────────────────────────
  {
    id: 'install-wsl',
    level: 0,
    name: 'Install WSL (Ubuntu)',
    desc: 'Your Linux environment on Windows',
    archHighlight: ['archTmux'],
    body: `
      <h3>What is WSL?</h3>
      <p>WSL (Windows Subsystem for Linux) runs a real Ubuntu Linux environment directly inside Windows. This is where tmux and Claude Code will live — giving you the same terminal power as a Mac or Linux server, without a separate machine.</p>
      <p>Without WSL, you'd be stuck with PowerShell or CMD. With WSL, you get full bash, tmux, npm, and everything Claude Code needs.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Press <strong>Win + X</strong> → choose <strong>"Windows PowerShell (Admin)"</strong> or <strong>"Terminal (Admin)"</strong></li>
        <li>Run the install command below — this installs WSL 2 with Ubuntu</li>
        <li><strong>Restart your computer</strong> when prompted</li>
        <li>After restart, Ubuntu opens automatically — set your Linux <strong>username</strong> and <strong>password</strong></li>
        <li>Verify WSL is running correctly (run verification command in PowerShell)</li>
      </ol>

      <div class="hint-box">
        <strong>Username tip:</strong> Choose a simple lowercase username (e.g., <code>agent</code>). This will be the username you SSH into from your iPhone.
      </div>

      <div class="info-box">
        <strong>Already have WSL?</strong> Run <code>wsl --update</code> and <code>wsl --set-default-version 2</code> to make sure you're on WSL 2.
      </div>
    `,
    terminal: {
      title: 'PowerShell (Admin) — WSL install',
      prompt: 'PS C:\\> ',
      commands: [
        {
          cmd: 'wsl --install -d Ubuntu',
          output: 'Installing: Windows Subsystem for Linux\nInstalling: Ubuntu\nThe requested operation is successful.\nChanges will not be effective until the system is rebooted.',
          successMsg: 'WSL + Ubuntu installed. Restart your PC, then come back.'
        },
        {
          cmd: 'wsl -l -v',
          output: '  NAME      STATE           VERSION\n* Ubuntu    Running         2',
          successMsg: 'Ubuntu is running on WSL 2.'
        }
      ]
    },
    checks: [
      'Restarted PC after WSL install',
      'Ubuntu opened and you created a Linux username + password',
      'wsl -l -v shows Ubuntu on VERSION 2',
      'You remember your Ubuntu username (you\'ll need it later)'
    ],
    hint: 'The Ubuntu username you create here is different from your Windows username. This is the one your iPhone will use to SSH in.'
  },

  {
    id: 'enable-ssh-windows',
    level: 0,
    name: 'Enable Windows SSH Server',
    desc: 'Open the door and route it to WSL',
    archHighlight: ['archSSH'],
    body: `
      <h3>What is Windows OpenSSH Server?</h3>
      <p>Windows 10/11 includes a built-in SSH Server — you just need to activate it. This becomes the entry point that Termius on your iPhone will connect to.</p>
      <p>By default, SSH drops you into PowerShell or CMD. We'll configure it to drop directly into WSL (your Ubuntu environment) — so you land straight in bash where tmux is waiting.</p>

      <h3>Steps (run in PowerShell as Admin)</h3>
      <ol class="step-list">
        <li>Add the OpenSSH Server feature</li>
        <li>Start the SSH service and set it to auto-start</li>
        <li>Set WSL as the default shell for SSH connections</li>
        <li>Test SSH locally to confirm everything works</li>
      </ol>

      <div class="info-box">
        <strong>Why route to WSL?</strong> Without this, SSH drops you into PowerShell and you'd have to type <code>wsl</code> every time. Setting WSL as default means you land directly in bash — tmux is one command away.
      </div>

      <div class="hint-box">
        <strong>Firewall note:</strong> If prompted by Windows Defender Firewall, allow SSH on private networks. This is required for Tailscale to work.
      </div>
    `,
    terminal: {
      title: 'PowerShell (Admin) — SSH Server setup',
      prompt: 'PS C:\\> ',
      commands: [
        {
          cmd: 'Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0',
          output: 'Path          :\nOnline        : True\nRestartNeeded : False',
          successMsg: 'OpenSSH Server feature installed.'
        },
        {
          cmd: 'Start-Service sshd; Set-Service -Name sshd -StartupType Automatic',
          output: '',
          successMsg: 'SSH service started and set to auto-start on boot.'
        },
        {
          cmd: 'New-ItemProperty -Path "HKLM:\\SOFTWARE\\OpenSSH" -Name DefaultShell -Value "C:\\Windows\\System32\\wsl.exe" -PropertyType String -Force',
          output: 'DefaultShell : C:\\Windows\\System32\\wsl.exe',
          successMsg: 'WSL set as default SSH shell. SSH will now drop into Ubuntu.'
        },
        {
          cmd: 'ssh localhost',
          output: 'The authenticity of host \'localhost\' can\'t be established.\nAre you sure? (yes)\nagent@PC:~$',
          successMsg: 'SSH works and drops straight into WSL/Ubuntu!'
        }
      ]
    },
    checks: [
      'OpenSSH Server feature is installed',
      'sshd service is running (auto-start)',
      'WSL set as DefaultShell in registry',
      'ssh localhost connects and shows bash prompt (not PowerShell)'
    ],
    hint: 'If ssh localhost gives "Connection refused", run Get-Service sshd to verify the service is running. If it\'s stopped, run Start-Service sshd.'
  },

  {
    id: 'setup-tailscale-windows',
    level: 0,
    name: 'Setup Tailscale on Windows',
    desc: 'Create your private VPN tunnel',
    archHighlight: ['archMac'],
    body: `
      <h3>What is Tailscale?</h3>
      <p>Tailscale creates a <strong>private VPN mesh network</strong> between your devices. Your PC and iPhone get stable IPs (like <code>100.x.x.x</code>) that work anywhere — home WiFi, cellular, hotel, another country.</p>
      <p>No port forwarding. No router configuration. No monthly fees. Just install, log in, and your devices can reach each other globally.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Install Tailscale via winget (or download from tailscale.com)</li>
        <li>Open Tailscale from the system tray and log in via browser</li>
        <li>Get your Tailscale IP from PowerShell — <strong>write this down!</strong></li>
      </ol>

      <div class="info-box">
        <strong>Sign in with:</strong> Google, Microsoft, GitHub, Apple, or email. Use the <strong>same account</strong> on your iPhone — both devices must be on the same Tailscale network.
      </div>

      <div class="hint-box">
        <strong>Pro tip:</strong> Run <code>tailscale status</code> to see your hostname (e.g. <code>pc.tailnet.ts.net</code>). Use the hostname in Termius instead of the IP — it never changes even if the IP rotates.
      </div>
    `,
    terminal: {
      title: 'PowerShell — Tailscale setup',
      prompt: 'PS C:\\> ',
      commands: [
        {
          cmd: 'winget install --id tailscale.tailscale',
          output: 'Found Tailscale [tailscale.tailscale]\nDownloading https://pkgs.tailscale.com/stable/...\nSuccessfully installed',
          successMsg: 'Tailscale installed.'
        },
        {
          cmd: 'tailscale up',
          output: 'To authenticate, visit:\n\n\thttps://login.tailscale.com/a/f4c2d1a0bf92\n\nSuccess.',
          successMsg: 'Authenticated with Tailscale network.'
        },
        {
          cmd: 'tailscale ip -4',
          output: '100.94.22.71',
          successMsg: 'Your Tailscale IP: 100.94.22.71 — save this!'
        }
      ]
    },
    checks: [
      'Tailscale is installed and visible in the system tray',
      'Logged in with your chosen account',
      'You wrote down your Tailscale IPv4 address',
      'You remember which account you used (needed for iPhone)'
    ],
    hint: 'Your Tailscale IP is how your phone finds your PC from anywhere. Treat it like your PC\'s global phone number.'
  },

  // ─── LEVEL 1: Phone Bridge ─────────────────────────────────────
  {
    id: 'tailscale-iphone',
    level: 1,
    name: 'Tailscale on iPhone',
    desc: 'Join the VPN from your phone',
    archHighlight: ['archPhone'],
    body: `
      <h3>Connect your iPhone to the same VPN</h3>
      <p>Your PC is on Tailscale. Now your iPhone needs to join the <strong>same network</strong> so it can reach your PC from anywhere in the world.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Open the <strong>App Store</strong> on your iPhone</li>
        <li>Search for <strong>"Tailscale"</strong> and install it (free)</li>
        <li>Open the app and tap <strong>Sign In</strong></li>
        <li>Sign in with the <strong>SAME account</strong> you used on your PC</li>
        <li>Allow the VPN configuration when prompted (iOS will ask)</li>
        <li>Toggle Tailscale <strong>ON</strong></li>
      </ol>

      <div class="hint-box">
        <strong>Critical:</strong> You MUST use the same account on both devices. Different accounts = different networks = can't connect. This is the #1 mistake people make.
      </div>

      <h3>Verify</h3>
      <p>In the Tailscale app on your phone, you should see both your PC and your iPhone listed as <strong>Connected</strong>. Two green dots = success.</p>
    `,
    terminal: null,
    checks: [
      'Tailscale is installed on your iPhone',
      'Signed in with the SAME account as Windows PC',
      'VPN toggle is ON',
      'Both devices show as Connected in the app',
      'You can see your PC listed in the device list'
    ],
    hint: 'If your PC doesn\'t appear in the phone\'s device list, check that Tailscale is running on Windows — look for the tray icon and verify it shows "Connected".'
  },

  {
    id: 'setup-termius-windows',
    level: 1,
    name: 'Setup Termius',
    desc: 'Your SSH command center on iPhone',
    archHighlight: ['archTermius', 'archClient'],
    body: `
      <h3>What is Termius?</h3>
      <p>Termius is a professional SSH client for iPhone with a special keyboard that includes <strong>Ctrl, Tab, Esc</strong> keys — essential for tmux. Free tier has everything you need.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Install <strong>Termius</strong> from the App Store (free)</li>
        <li>Open it and tap <strong>+ New Host</strong> and configure:</li>
      </ol>

      <table class="cmd-table">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Label</td><td>My Windows PC</td></tr>
        <tr><td>Hostname</td><td><code>100.x.x.x</code> (your Tailscale IP)</td></tr>
        <tr><td>Port</td><td><code>22</code></td></tr>
        <tr><td>Username</td><td>Your <strong>Ubuntu WSL username</strong> (not your Windows username)</td></tr>
      </table>

      <div class="hint-box">
        <strong>Username warning:</strong> Use your <strong>WSL/Ubuntu username</strong>, not your Windows username. When you set up Ubuntu after WSL install, you created a Linux username — that's the one to use here.
      </div>

      <h3>First Connection</h3>
      <p>Tap the saved host, accept the SSH fingerprint prompt, and enter your <strong>Ubuntu password</strong>. You should see a bash prompt from your WSL environment.</p>

      <div class="info-box">
        <strong>Pro tips:</strong><br>
        • Save your password in Termius for quick access<br>
        • Enable <strong>Keep Alive</strong> in SSH settings (prevents disconnections)<br>
        • Use landscape mode for more terminal width<br>
        • iOS dictation (🎙️) lets you speak commands
      </div>
    `,
    terminal: null,
    checks: [
      'Termius is installed on iPhone',
      'Host saved with Tailscale IP and WSL username',
      'First SSH connection successful',
      'You see a bash prompt (not PowerShell) after connecting'
    ],
    hint: 'If you see a PowerShell prompt instead of bash after connecting, the WSL DefaultShell registry key wasn\'t set correctly. Re-run the registry command from Quest 2.'
  },

  {
    id: 'install-tmux-claude-wsl',
    level: 1,
    name: 'Install tmux + Start Claude Session',
    desc: 'Set up your persistent WSL environment',
    archHighlight: ['archTmux', 'archClaude', 'archCode'],
    body: `
      <h3>Setting Up the WSL Environment</h3>
      <p>Now we install everything Claude Code needs inside your Ubuntu WSL environment: Node.js, tmux, and Claude Code itself. All commands run <strong>inside Ubuntu (WSL)</strong> — open it from Start Menu or type <code>wsl</code> in PowerShell.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>Open <strong>Ubuntu</strong> from Start Menu (or run <code>wsl</code> in PowerShell)</li>
        <li>Update packages and install tmux + Node.js</li>
        <li>Install Claude Code globally via npm</li>
        <li>Create a named tmux session and launch Claude</li>
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
        <strong>Key insight:</strong> Detaching does NOT stop Claude. It runs in the background — tmux is the bodyguard keeping it alive. Even if you close Ubuntu or disconnect SSH, the tmux session persists.
      </div>
    `,
    terminal: {
      title: 'Ubuntu (WSL) — Install + Launch',
      prompt: 'ubuntu@pc:~$ ',
      commands: [
        {
          cmd: 'sudo apt update && sudo apt install -y tmux',
          output: 'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nReading package lists...\nSetting up tmux (3.2a-4build2) ...',
          successMsg: 'tmux installed inside WSL.'
        },
        {
          cmd: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs',
          output: 'Setting up nodejs (20.x) ...\nnode --version: v20.18.0',
          successMsg: 'Node.js 20 installed.'
        },
        {
          cmd: 'npm install -g @anthropic-ai/claude-code',
          output: '\nadded 1 package in 3s\n\n1 package is up to date.',
          successMsg: 'Claude Code installed globally.'
        },
        {
          cmd: 'tmux new -s claude',
          output: '[new tmux session: claude]\n\n  ╭─────────────────────────────────────╮\n  │  Welcome to tmux session "claude"  │\n  ╰─────────────────────────────────────╯',
          successMsg: 'tmux session "claude" created inside WSL.'
        }
      ]
    },
    checks: [
      'tmux is installed in WSL (tmux -V shows version)',
      'Node.js 20+ is installed (node --version)',
      'Claude Code installed (claude --version)',
      'tmux session "claude" is running',
      'You can detach (Ctrl+B, D) and reattach'
    ],
    hint: 'If npm install fails with permission errors, run: sudo npm install -g @anthropic-ai/claude-code'
  },

  // ─── LEVEL 2: Full Control ─────────────────────────────────────
  {
    id: 'phone-connect-windows',
    level: 2,
    name: 'Connect from iPhone',
    desc: 'Reach Claude from your phone',
    archHighlight: ['archTermius', 'archSSH', 'archClient', 'archTmux', 'archClaude', 'archCode'],
    body: `
      <h3>First Remote Connection</h3>
      <p>SSH into your PC from your iPhone, which drops you straight into WSL (Ubuntu bash), then attach to the tmux session where Claude is waiting.</p>

      <h3>Steps</h3>
      <ol class="step-list">
        <li>On your PC: verify Tailscale is ON in the tray and tmux is running (<code>wsl</code> → <code>tmux ls</code>)</li>
        <li>On your iPhone: open Tailscale (verify it's ON and connected)</li>
        <li>Open Termius and tap your saved PC host</li>
        <li>Once connected (you'll see bash), attach to Claude's session</li>
        <li>Interact with Claude from your phone!</li>
      </ol>

      <div class="info-box">
        <strong>Ctrl+B on iPhone:</strong> Termius has a special key toolbar above the keyboard. Tap <code>Ctrl</code> → <code>B</code> → release → then tap <code>D</code> to detach. Or type <code>tmux detach</code>.
      </div>

      <div class="hint-box">
        <strong>Sanity check:</strong> After connecting, run <code>uname -a</code> — you should see "Linux" (WSL), not "Windows". If you see PowerShell, the DefaultShell registry key needs to be re-set.
      </div>
    `,
    terminal: {
      title: 'Termius — iPhone → Windows PC (WSL)',
      prompt: 'ubuntu@pc:~$ ',
      commands: [
        {
          cmd: 'ssh agent@100.94.22.71',
          output: 'Password: ********\nWelcome to Ubuntu 22.04 LTS\nagent@PC:~$',
          successMsg: 'Connected to Windows PC — landed in WSL/Ubuntu!'
        },
        {
          cmd: 'tmux attach -t claude',
          output: '\n[attached to session: claude]\n\n╭──────────────────────────────────────╮\n│          Claude Code v1.0           │\n│                                     │\n│  > Waiting for input...             │\n╰──────────────────────────────────────╯',
          successMsg: 'Controlling Claude Code from your iPhone!'
        }
      ]
    },
    checks: [
      'Connected to PC via Termius over Tailscale',
      'Landed in Ubuntu/bash (not PowerShell)',
      'Attached to tmux "claude" session',
      'Can see and interact with Claude Code',
      'Know how to detach from phone (Ctrl+B, D)'
    ],
    hint: 'If "session not found", run tmux ls first to check session names. Sessions are lost if your PC rebooted — just run tmux new -s claude and claude again.'
  },

  {
    id: 'final-boss-roundtrip-windows',
    level: 2,
    name: 'FINAL BOSS: Round-Trip',
    desc: 'The ultimate end-to-end validation',
    archHighlight: ['archMac', 'archPhone', 'archTmux', 'archClaude', 'archCode', 'archTermius', 'archSSH', 'archClient'],
    body: `
      <h3>The Ultimate Test</h3>
      <p>This is the boss fight. Start Claude on your PC → walk away → connect from phone on a <strong>completely different network</strong> → interact → return to PC. Six phases, no skipping.</p>

      <h3>Execute All 6 Phases</h3>
      <ol class="step-list">
        <li><strong>START:</strong> Open Ubuntu (WSL), run <code>tmux new -s mission</code>, launch <code>claude</code>, and give it a long-running task</li>
        <li><strong>DETACH:</strong> Press <code>Ctrl+B</code> then <code>D</code>. Claude works in the background. Walk away from your PC</li>
        <li><strong>MOVE:</strong> Physically leave your PC. Switch to cellular data or different WiFi (coffee shop, gym, etc.)</li>
        <li><strong>CONNECT:</strong> On your phone: Tailscale ON → Termius → SSH in → <code>tmux attach -t mission</code></li>
        <li><strong>INTERACT:</strong> Read Claude's output. Ask a follow-up question. You're driving from your phone on a different network</li>
        <li><strong>RETURN:</strong> Detach on phone. Walk back to PC. Open Ubuntu → <code>tmux attach -t mission</code>. Everything is there</li>
      </ol>

      <div class="hint-box">
        <strong>The real test:</strong> Turn OFF WiFi on your phone and use cellular data. This proves the Tailscale VPN works across completely separate networks.
      </div>
    `,
    terminal: {
      title: 'WSL — Final Boss Simulation',
      prompt: 'ubuntu@pc:~$ ',
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
          output: '[attached to session: mission]\n\nFull conversation history preserved.\nYour PC interaction → Phone interaction → Back to PC.\n\n> All phases complete.',
          successMsg: 'Phase 6: Back on PC. Full round-trip successful!'
        }
      ]
    },
    checks: [
      'Phase 1: Started Claude in tmux on PC (inside WSL)',
      'Phase 2: Detached and walked away',
      'Phase 3: On a different network (cellular/different WiFi)',
      'Phase 4: Connected from phone via Termius',
      'Phase 5: Interacted with Claude from phone',
      'Phase 6: Returned to PC with full session history intact'
    ],
    hint: 'This is the real-world proof. If all 6 phases work, you have global remote access to Claude Code from your Windows PC.'
  },

  {
    id: 'troubleshoot-windows',
    level: 2,
    name: 'Side Quest: Troubleshooting',
    desc: 'Field manual for Windows-specific problems',
    archHighlight: [],
    body: `
      <h3>Windows Field Manual</h3>
      <p>Bookmark this quest. Windows has a few extra failure modes compared to Mac.</p>

      <table class="cmd-table">
        <tr><th>Problem</th><th>Fix</th></tr>
        <tr><td>"Connection refused"</td><td>Check sshd is running: <code>Get-Service sshd</code> in PowerShell. If stopped: <code>Start-Service sshd</code>. Also check Windows Firewall isn't blocking port 22</td></tr>
        <tr><td>SSH drops into PowerShell (not bash)</td><td>DefaultShell not set. Re-run: <code>New-ItemProperty -Path "HKLM:\\SOFTWARE\\OpenSSH" -Name DefaultShell -Value "C:\\Windows\\System32\\wsl.exe" -PropertyType String -Force</code></td></tr>
        <tr><td>"No route to host" / timeout</td><td>Tailscale is OFF on one device. Run <code>tailscale status</code> on PC. Check tray icon. Run <code>tailscale up</code> if needed</td></tr>
        <tr><td>"Session not found"</td><td>tmux sessions don't survive PC reboots. Open Ubuntu → <code>tmux new -s claude</code> → <code>claude</code> to restart</td></tr>
        <tr><td>WSL won't start</td><td>Open PowerShell as Admin: <code>wsl --shutdown</code> then <code>wsl</code> again. If still broken: <code>wsl --update</code></td></tr>
        <tr><td>Connection keeps dropping</td><td>Enable <strong>Keep Alive</strong> in Termius SSH settings (30-second intervals)</td></tr>
        <tr><td>Can't type Ctrl+B on iPhone</td><td>Use Termius key toolbar: Ctrl → B → D. Or type <code>tmux detach</code></td></tr>
        <tr><td>PC goes to sleep / SSH drops</td><td>Settings → System → Power → Screen and sleep → set all to "Never" while you need remote access. Or use a caffeinate-equivalent: <code>powercfg /change standby-timeout-ac 0</code></td></tr>
        <tr><td>Tailscale IP changed</td><td>Use stable hostname instead: <code>your-pc.tailnet.ts.net</code> (run <code>tailscale status</code> to find it)</td></tr>
      </table>

      <div class="info-box">
        <strong>Quick diagnosis order:</strong>
        1. Is Tailscale ON on both devices? (<code>tailscale status</code>)<br>
        2. Is sshd running? (<code>Get-Service sshd</code>)<br>
        3. Is WSL running? (<code>wsl -l -v</code>)<br>
        4. Does ssh localhost work from PowerShell?
      </div>

      <div class="hint-box">
        <strong>Nuclear option:</strong> If everything is broken, restart in order: Restart PC → Open Ubuntu once to make sure WSL starts → Start Tailscale → verify <code>tailscale status</code> shows both devices → test SSH.
      </div>
    `,
    terminal: null,
    checks: [
      'Know how to check if sshd is running (Get-Service sshd)',
      'Know how to fix the DefaultShell registry issue',
      'Know that tmux sessions die on reboot (and how to restart)',
      'Know the 4-step quick diagnosis order',
      'Know how to prevent PC sleep for remote sessions'
    ],
    hint: 'The #1 Windows-specific issue: sshd stops after a Windows Update reboot. Always check Get-Service sshd first.'
  }
];
