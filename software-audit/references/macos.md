# macOS discovery

All commands here are read-only.

## Apps

```bash
# Version of every app bundle
for p in /Applications/*.app /Applications/*/*.app ~/Applications/*.app; do
  v=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "$p/Contents/Info.plist" 2>/dev/null)
  [ -n "$v" ] && echo "$(basename "$p" .app) | $v | $p"
done
ls ~/Library/Application\ Support/JetBrains/Toolbox/apps 2>/dev/null
system_profiler SPApplicationsDataType -json   # slower, but catches apps outside /Applications
```

- Find apps by bundle ID: `mdfind "kMDItemCFBundleIdentifier == 'com.jetbrains.*'"`
- Docker Desktop's bundled engine, CLI and Compose versions: `/Applications/Docker.app/Contents/Resources/componentsVersion.json`
- Runtimes bundled inside apps: Electron apps (VS Code, Slack, Teams, Docker Desktop, Postman, etc.) carry their own Node.js/Chromium. Updating the app is the fix.
- VS Code extensions: `code --list-extensions --show-versions`. If `code` isn't on your PATH, use `"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"`.

## Homebrew

```bash
brew update                                 # refresh the catalogue (doesn't change installed packages)
brew list --versions; brew list --cask --versions
brew outdated --greedy
brew info --json=v2 <formula>               # .formulae[].versions.stable
brew info --json=v2 --cask <cask>           # .casks[].version
```

## Version managers and language packages

```bash
which -a node python3 ruby java go; node -v; ruby -v; python3 -V
cat ~/.tool-versions; asdf list 2>/dev/null; mise ls 2>/dev/null
ls ~/.nvm/versions/node ~/.volta/tools/image/node ~/.rbenv/versions ~/.pyenv/versions ~/.sdkman/candidates/java 2>/dev/null
/usr/libexec/java_home -V
gem list                                    # repeat for each installed Ruby
npm ls -g --depth=0; pipx list; cargo install --list
ls /usr/local/share/dotnet ~/.dotnet 2>/dev/null; dotnet --list-sdks; dotnet --list-runtimes
```

macOS ships its own Ruby (`/usr/bin/ruby`) and Python stubs. Report them, but note that Apple updates them and the user can't.

## Security agents, VPN and system extensions

```bash
systemextensionsctl list
ls /Library/Application\ Support/PaloAltoNetworks /Library/LaunchDaemons /Library/LaunchAgents
```

## Operating system

```bash
sw_vers
softwareupdate -l
pkgutil --pkg-info=com.apple.pkg.CLTools_Executables
```

## Fix commands

- Homebrew: `brew upgrade <formula>`, `brew upgrade --cask --greedy <cask>`, `brew cleanup`
- Apps not installed with Homebrew: the app's own "Check for updates" option, or the vendor's installer
- asdf: `asdf install <tool> <version>`, `asdf set <tool> <version>` (asdf 0.16 and later), `asdf uninstall <tool> <version>`
- Gems: `gem update <gem>`, `gem cleanup <gem>`
- Operating system: `softwareupdate -ia`
