---
name: software-audit
description: Audit this computer (macOS or Windows) for installed software and report what is outdated, unsupported or vulnerable, grouped by category, with update commands. Use when the user wants to review vulnerability scan findings, check whether software is up to date, find old runtimes or leftover versions, or prepare for a security/patching review. Accepts an optional pasted scan list of flagged items.
---

# Software audit

Audit the machine for installed software across the categories below, report versions and support status, and propose (never run) the fixes.

## 1. Detect the platform and load its guide

- macOS (`uname` = Darwin) → read `references/macos.md`
- Windows (PowerShell / `$env:OS` = Windows_NT) → read `references/windows.md`

The guide lists where to look and the exact commands for discovering versions on that platform.

## 2. Load the known flagged items

Read `references/known-flagged.md`: the items the vulnerability scanner has already reported. This file is private and git ignores it. If it doesn't exist, tell the user they can create it from `references/known-flagged.example.md`, then audit without a flagged list.

If the user pasted a new scan list with the request, use that instead: tidy it (drop count columns, merge duplicates such as "IntelliJ IDEA" and "JetBrains IntelliJ IDEA Arbitrary Local File Read", keep any specific flagged version) and offer to save it to `known-flagged.md`. Never write scan results to the example file.

The flagged list is a starting point, not the scope. Look at all important software in every category.

## 3. Categories

1. **Browsers**: Firefox, Chrome, Safari, Edge, Brave, Arc, Opera, Chromium
2. **Containers and virtualisation**: Docker Desktop/Engine, Compose, Buildx, Podman, Rancher Desktop, Colima, OrbStack, WSL, Hyper-V, minikube, kubectl, Helm, VirtualBox, UTM, Parallels, VMware
3. **IDEs and editors**: all JetBrains IDEs, Visual Studio, VS Code (and risky extensions), Android Studio, Xcode, Cursor, Zed, Sublime Text, Notepad++, Neovim/Vim
4. **Language runtimes and frameworks**: every installed Node.js version, .NET / ASP.NET Core (including end-of-life versions), Python, Ruby, Java/JDKs (Zulu, Temurin, Oracle, Microsoft), Go, Rust, PHP, Deno, Bun
5. **Libraries and packages**: OpenSSL, LibreSSL, curl/libcurl, c-ares, libnghttp2, zlib, SQLite, libxml2, git, OpenSSH, GnuPG, Visual C++ redistributables, and old gem/npm/pip copies still sitting next to newer ones
6. **VPN, networking and security agents**: OpenVPN Connect, GlobalProtect, Cortex XDR, Tunnelblick, WireGuard, Cisco Secure Client, Tailscale, Zscaler, other endpoint/security agents
7. **Communication and productivity**: Zoom, Slack, Teams, Microsoft Office/Outlook, Webex, Discord, Notion, 1Password and other password managers
8. **Terminals and developer utilities**: iTerm2, Terminal.app, Windows Terminal, Warp, Ghostty, Alacritty, tmux, PuTTY, GitHub CLI, AWS/Azure/GCP CLIs, Terraform, Postman, Insomnia
9. **Operating system**: OS version, pending updates, Xcode Command Line Tools / Windows features

## 4. Finding the latest versions

- Use the platform's package catalogue first (Homebrew on macOS, `winget` on Windows), and refresh it before trusting it.
- For support status and end-of-life dates, use endoflife.date (for example `https://endoflife.date/api/nodejs.json`) or the vendor's release notes.
- Search the web for anything the catalogues don't cover. Never guess a "latest" version from memory.
- Odd-numbered Node.js releases and any runtime past its end-of-life date are ❌ even if they're the newest in their line.

## 5. Output

- **One table per category**: software, how it was installed, installed version, latest version, status (✅ up to date / ⚠️ outdated / ❌ no longer supported or known vulnerable). Mark known flagged items with 🚩. Leave out categories with nothing installed, apart from listing them as not found.
- **Known flagged items that aren't installed.**
- **Leftovers worth cleaning up**: duplicate or old versions, unused runtimes, files left behind by apps that were removed, version-manager config pointing at versions that aren't installed.
- **Fix commands** for each item that needs action, grouped by package manager or update method. Note which apps update themselves and only need a relaunch.
- **Sources** for the "latest version" figures.

Don't run any update, uninstall or cleanup command until the user confirms. Read-only discovery commands are fine.
