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

## Before suggesting removals

Homebrew only knows what other Homebrew packages depend on. Runtimes built by asdf, mise, rbenv, pyenv or nvm often link against Homebrew libraries (OpenSSL, readline, libyaml, gmp, libffi), and `brew autoremove` or `brew uninstall` will break them without warning. For example, removing `openssl@3` stops every Ruby built against it from loading OpenSSL, so Bundler and gem installs fail.

Check what those runtimes link against before suggesting any removal:

```bash
find ~/.asdf/installs ~/.local/share/mise/installs ~/.rbenv/versions ~/.pyenv/versions ~/.nvm/versions \
  \( -name '*.bundle' -o -name '*.so' -o -name '*.dylib' \) 2>/dev/null |
  xargs otool -L 2>/dev/null | grep -o '/opt/homebrew/opt/[^/]*' | sort -u
```

- Never suggest removing a formula that shows up in that list.
- Never suggest a plain `brew autoremove`. Preview it with `brew autoremove -n` and compare against the list.
- If a listed formula is only installed as a dependency, suggest `brew install <formula>` so Homebrew records it as installed on request and won't remove it again.
- A Ruby or Python that bundles its own OpenSSL (the link points inside its install folder) doesn't depend on Homebrew's, but report the bundled OpenSSL version and whether it's still supported.

## Fix commands

- Homebrew: `brew upgrade <formula>`, `brew upgrade --cask --greedy <cask>`, `brew cleanup`. Follow the section above before suggesting `brew autoremove` or `brew uninstall`.
- Apps not installed with Homebrew: the app's own "Check for updates" option, or the vendor's installer
- asdf: `asdf install <tool> <version>`, `asdf set <tool> <version>` (asdf 0.16 and later), `asdf uninstall <tool> <version>`
- Gems: `gem update <gem>`, `gem cleanup <gem>`
- Operating system: `softwareupdate -ia`
