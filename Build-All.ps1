# Builds every release artifact of this repository in dependency order:
#
#   1. RunHost\Build-RunHost.ps1                 -> RunHost\<platform>\ + RunHost\javascript\
#   2. VisualStudioCodePlugin\build\Package-Vsix.ps1
#                                                -> VisualStudioCodePlugin\build\SmallBasic.VSCode-0.1.0.vsix
#                                                   (also refreshes dist\debug\adapter.js used by the VS side)
#   3. VisualStudioPlugin\src\SmallBasic.Vsix    -> VSIX project build (builds RunHost net48 automatically)
#   4. VisualStudioPlugin\build\Package-Vsix.ps1 -> VisualStudioPlugin\build\SmallBasic.Vsix.0.1.0.vsix
#
# Usage examples:
#   .\Build-All.ps1                    # full Release build
#   .\Build-All.ps1 -Configuration Debug
#   .\Build-All.ps1 -SkipVsix          # RunHost distribution only
#   .\Build-All.ps1 -SkipJavaScript    # skip the JS run host bundle step of Build-RunHost
[CmdletBinding()]
param(
    [ValidateSet("Debug", "Release")]
    [string]$Configuration = "Release",

    [switch]$SkipJavaScript,

    [switch]$SkipVsix
)

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot

# Every RunHost distribution folder exposes its own Build-RunHost.ps1 script.
# Register new ones here when additional hosts are added.
$runHostBuildScripts = @(
    (Join-Path $repoRoot "RunHost\Build-RunHost.ps1")
)

foreach ($scriptPath in $runHostBuildScripts) {
    if (-not (Test-Path $scriptPath)) {
        throw "RunHost build script not found: $scriptPath"
    }

    Write-Host ""
    Write-Host "=== Build-RunHost: $scriptPath ===" -ForegroundColor Yellow
    & $scriptPath -Configuration $Configuration -SkipJavaScript:$SkipJavaScript
}

if ($SkipVsix) {
    Write-Host ""
    Write-Host "RunHost builds completed (-SkipVsix)." -ForegroundColor Green
    return
}

# VS Code extension VSIX. This also rebuilds dist\debug\adapter.js and
# dist\runhost.js, which the Visual Studio side consumes below.
Write-Host ""
Write-Host "=== Package-Vsix: VisualStudioCodePlugin ===" -ForegroundColor Yellow
& (Join-Path $repoRoot "VisualStudioCodePlugin\build\Package-Vsix.ps1")

# Visual Studio extension project. Its CopyRunHostOutput target builds
# SmallBasic.RunHost (net48) and stages it next to the VSIX payload.
Write-Host ""
Write-Host "=== Build: SmallBasic.Vsix ($Configuration) ===" -ForegroundColor Yellow
$vsixProject = Join-Path $repoRoot "VisualStudioPlugin\src\SmallBasic.Vsix\SmallBasic.Vsix.csproj"
dotnet build $vsixProject -c $Configuration --nologo
if ($LASTEXITCODE -ne 0) {
    throw "dotnet build failed for SmallBasic.Vsix"
}

# Visual Studio extension VSIX.
Write-Host ""
Write-Host "=== Package-Vsix: VisualStudioPlugin ===" -ForegroundColor Yellow
& (Join-Path $repoRoot "VisualStudioPlugin\build\Package-Vsix.ps1") -Configuration $Configuration

Write-Host ""
Write-Host "Build-All completed:" -ForegroundColor Green
Write-Host "  RunHost\net48, net8.0, net8.0-windows, javascript"
Write-Host "  VisualStudioCodePlugin\build\SmallBasic.VSCode-0.1.0.vsix"
Write-Host "  VisualStudioPlugin\build\SmallBasic.Vsix.0.1.0.vsix"
