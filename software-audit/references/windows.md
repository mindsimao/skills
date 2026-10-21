# Windows discovery

Run these in PowerShell. All are read-only.

## Installed programs

```powershell
# Every program listed in Add/Remove Programs (machine-wide and per-user)
$paths = 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
         'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
         'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'
Get-ItemProperty $paths -ErrorAction SilentlyContinue |
  Where-Object DisplayName |
  Select-Object DisplayName, DisplayVersion, Publisher, InstallDate |
  Sort-Object DisplayName

Get-AppxPackage | Select-Object Name, Version     # Microsoft Store / MSIX apps
```

- Version of a specific executable: `(Get-Item 'C:\Program Files\Google\Chrome\Application\chrome.exe').VersionInfo.ProductVersion`
- JetBrains Toolbox apps: `%LOCALAPPDATA%\JetBrains\Toolbox\apps`
- Docker Desktop: `docker version`, `docker compose version`
- VS Code extensions: `code --list-extensions --show-versions`
- Electron apps (VS Code, Slack, Teams, Docker Desktop, Postman, etc.) carry their own Node.js/Chromium. Updating the app is the fix.

## Package managers

```powershell
winget source update                        # refresh the catalogue
winget list
winget upgrade --include-unknown            # what has updates available
choco outdated 2>$null; scoop status 2>$null
```

## Runtimes and language packages

```powershell
where.exe node python ruby java go
node -v; python -V; ruby -v; java -version
nvm list 2>$null                            # nvm-windows
Get-ChildItem "$env:LOCALAPPDATA\fnm_multishells","$env:APPDATA\nvm" -ErrorAction SilentlyContinue
py -0p                                      # all Python installs
dotnet --list-sdks; dotnet --list-runtimes
gem list; npm ls -g --depth=0; pip list --outdated; pipx list
```

- Visual C++ redistributables and older .NET Framework versions appear in the installed programs list above. Flag versions that are no longer supported.
- Visual Studio: `& "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe" -all -format json`

## Security agents, VPN and drivers

```powershell
Get-Service | Where-Object { $_.DisplayName -match 'VPN|GlobalProtect|Cortex|Zscaler|Tailscale|WireGuard|OpenVPN|Cisco' }
```

## Operating system

```powershell
Get-ComputerInfo -Property OsName, OsVersion, OsBuildNumber, WindowsVersion
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10
wsl --version; wsl -l -v
```

Check pending updates in Settings › Windows Update, or with `Get-WindowsUpdate` if the PSWindowsUpdate module is installed.

## Fix commands

- winget: `winget upgrade --id <Id>`, `winget upgrade --all`, `winget uninstall --id <Id>`
- Chocolatey / Scoop: `choco upgrade <pkg>`, `scoop update <app>`
- nvm-windows: `nvm install <version>`, `nvm use <version>`, `nvm uninstall <version>`
- .NET: uninstall old SDKs and runtimes from Add/Remove Programs, or with the `dotnet-core-uninstall` tool
- Gems: `gem update <gem>`, `gem cleanup <gem>`
- Operating system: Windows Update
