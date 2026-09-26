param(
    [string]$Configuration = "Debug",
    [string]$Framework = "net48",
    [string]$PackageName = "SmallBasic.Vsix.0.1.0.vsix",
    # The VS SDK / API version this extension is built against. VS2026 uses this
    # (via the API-version based compatibility model) without requiring a new release.
    [string]$SdkVersion = "17.11"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$projectRoot = Join-Path $repoRoot "src\SmallBasic.Vsix"
$buildOutput = Join-Path $projectRoot (Join-Path "bin\$Configuration" $Framework)
$manifestPath = Join-Path $projectRoot "source.extension.vsixmanifest"
$stagingRoot = Join-Path $PSScriptRoot ".artifacts\vsix"
$packagePath = Join-Path $PSScriptRoot $PackageName

if (-not (Test-Path $buildOutput)) {
    throw "Build output not found: $buildOutput"
}

if (Test-Path $stagingRoot) {
    Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingRoot | Out-Null
Copy-Item -Path (Join-Path $buildOutput "*") -Destination $stagingRoot -Recurse -Force
Copy-Item -LiteralPath $manifestPath -Destination (Join-Path $stagingRoot "extension.vsixmanifest") -Force

# Bundle the shared Debug Adapter Protocol implementation used by F5.
$debugAdapterSource = Join-Path (Split-Path -Parent $repoRoot) "VisualStudioCodePlugin\packages\smallbasic-vscode\dist\debug\adapter.js"
if (-not (Test-Path $debugAdapterSource)) {
    throw "Debug adapter output not found: $debugAdapterSource. Run npm run build in VisualStudioCodePlugin first."
}
$debugAdapterStaging = Join-Path $stagingRoot "DebugAdapter"
New-Item -ItemType Directory -Path $debugAdapterStaging -Force | Out-Null
Copy-Item -LiteralPath $debugAdapterSource -Destination (Join-Path $debugAdapterStaging "adapter.js") -Force

@"
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="vsixmanifest" ContentType="text/xml" />
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="dll" ContentType="application/octet-stream" />
  <Default Extension="exe" ContentType="application/octet-stream" />
  <Default Extension="pdb" ContentType="application/octet-stream" />
</Types>
"@ | Set-Content -LiteralPath (Join-Path $stagingRoot "[Content_Types].xml") -Encoding UTF8

# Bundle the .NET Framework host used by the official Microsoft.SmallBasic.Library.
$runHostOutput = Join-Path $repoRoot (Join-Path "src\SmallBasic.RunHost" (Join-Path "bin\$Configuration" "net48"))
if (-not (Test-Path (Join-Path $runHostOutput "SmallBasic.RunHost.exe"))) {
    throw "RunHost output not found: $runHostOutput. Build the SmallBasic.RunHost project first."
}
$runHostStaging = Join-Path $stagingRoot "RunHost"
if (Test-Path $runHostStaging) {
    Remove-Item -LiteralPath $runHostStaging -Recurse -Force
}
New-Item -ItemType Directory -Path $runHostStaging | Out-Null
Copy-Item -Path (Join-Path $runHostOutput "*") -Destination $runHostStaging -Recurse -Force

# ---------------------------------------------------------------------------
# VSIX "V3" marker (manifest.json)
#
# VS2026's VSIXInstaller shows a spurious "extension is not compatible with the
# selected version of Visual Studio" warning for every package whose
# IsExtensionManifestVersionV2 flag is true, which simply means
# "the package does not contain /manifest.json" (see
# Microsoft.VisualStudio.ExtensionEngine: IsExtensionManifestVersionV2 =
# !zipPackage.PartExists("/manifest.json")). Adding a manifest.json flips the
# flag and the warning disappears.
#
# We deliberately omit "extensionDir": Setup's GetVsixType() only classifies a
# package as VsixV3 (Setup-Engine install) when manifest.json has a non-empty
# extensionDir *and* vsixId. Without it the package keeps using the classic
# (well-proven) per-user install path on both VS2022 and VS2026.
# ---------------------------------------------------------------------------

[xml]$vsixManifest = Get-Content -LiteralPath $manifestPath -Encoding UTF8 -Raw
$identity = $vsixManifest.PackageManifest.Metadata.Identity
$vsixId = [string]$identity.Id
$version = [string]$identity.Version

if ([string]::IsNullOrEmpty($vsixId) -or [string]::IsNullOrEmpty($version)) {
    throw "Failed to read Identity Id/Version from $manifestPath"
}

$stagingRootFull = (Get-Item -LiteralPath $stagingRoot).FullName
$fileEntries = @(Get-ChildItem -LiteralPath $stagingRoot -Recurse -File |
    Where-Object { $_.Name -ne "manifest.json" } |
    Sort-Object FullName |
    ForEach-Object {
        $relative = $_.FullName.Substring($stagingRootFull.Length).Replace("\", "/")
        [ordered]@{
            fileName = $relative
            sha256   = $null
        }
    })

$setupPackage = [ordered]@{
    id      = $vsixId
    version = $version
    type    = "Vsix"
    sdk     = $SdkVersion
    vsixId  = $vsixId
    files   = $fileEntries
}

$setupPackage | ConvertTo-Json -Depth 6 |
    Set-Content -LiteralPath (Join-Path $stagingRoot "manifest.json") -Encoding UTF8

if (Test-Path $packagePath) {
    Remove-Item -LiteralPath $packagePath -Force
}

$tempZip = [System.IO.Path]::ChangeExtension($packagePath, ".zip")
if (Test-Path $tempZip) {
    Remove-Item -LiteralPath $tempZip -Force
}

Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $tempZip -Force
Move-Item -LiteralPath $tempZip -Destination $packagePath -Force
Write-Host "VSIX package created: $packagePath"
