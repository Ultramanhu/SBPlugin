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
$debugAdapterSource = Join-Path (Split-Path -Parent $repoRoot) "visual_studio_code_plugin\packages\smallbasic-vscode\dist\debug\adapter.js"
if (-not (Test-Path $debugAdapterSource)) {
    throw "Debug adapter output not found: $debugAdapterSource. Run npm run build in visual_studio_code_plugin first."
}
$debugAdapterStaging = Join-Path $stagingRoot "DebugAdapter"
New-Item -ItemType Directory -Path $debugAdapterStaging -Force | Out-Null
Copy-Item -LiteralPath $debugAdapterSource -Destination (Join-Path $debugAdapterStaging "adapter.js") -Force

# [Content_Types].xml must declare EVERY file extension present in the package.
# OPC-based VSIX installers silently skip parts whose extension has no declared
# content type - a hardcoded list here once dropped DebugAdapter\adapter.js and
# RunHost\SmallBasic.RunHost.exe.config (and with them whole subfolders) from
# the installed extension.
$contentTypes = @(
    "vsixmanifest", "json", "xml", "dll", "exe", "pdb", "js", "config", "txt"
)
$knownContentTypes = @{
    "vsixmanifest" = "text/xml"
    "json"         = "application/json"
    "xml"          = "text/xml"
    "js"           = "application/javascript"
    "config"       = "application/xml"
    "txt"          = "text/plain"
}

$stagedExtensions = Get-ChildItem -LiteralPath $stagingRoot -Recurse -File |
    ForEach-Object { $_.Extension.TrimStart(".").ToLowerInvariant() } |
    Where-Object { $_ } |
    Sort-Object -Unique

$defaultEntries = foreach ($extension in (@($contentTypes) + $stagedExtensions | Sort-Object -Unique)) {
    $contentType = if ($knownContentTypes.ContainsKey($extension)) { $knownContentTypes[$extension] } else { "application/octet-stream" }
    "  <Default Extension=`"$extension`" ContentType=`"$contentType`" />"
}

@"
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
$defaultEntries
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
        # VS2026's ExtensionEngine matches manifest.json entries against zip part
        # names verbatim; zip part names have no leading slash, so a leading "/"
        # made every subfolder entry (RunHost\, DebugAdapter\) fail to install.
        $relative = $_.FullName.Substring($stagingRootFull.Length).Replace("\", "/").TrimStart("/")
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

# Zip entry names must use forward slashes per the zip spec. Compress-Archive
# and .NET Framework's ZipFile.CreateFromDirectory (Windows PowerShell 5.1)
# write backslash-separated entries, and VS2026's ExtensionEngine then cannot
# match manifest.json subfolder entries (RunHost/..., DebugAdapter/...) against
# package parts and silently skips them during install. Build the archive
# entry-by-entry with explicit forward-slash names so the layout is correct on
# any PowerShell host.
Add-Type -AssemblyName System.IO.Compression
$stagingFiles = @(Get-ChildItem -LiteralPath $stagingRoot -Recurse -File)
$fileStream = [System.IO.File]::Open($tempZip, [System.IO.FileMode]::CreateNew)
try {
    $archive = New-Object System.IO.Compression.ZipArchive($fileStream, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($file in $stagingFiles) {
            $entryName = $file.FullName.Substring($stagingRootFull.Length).Replace("\", "/").TrimStart("/")
            $entry = $archive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
            $entryStream = $entry.Open()
            try {
                $sourceStream = [System.IO.File]::OpenRead($file.FullName)
                try {
                    $sourceStream.CopyTo($entryStream)
                }
                finally {
                    $sourceStream.Dispose()
                }
            }
            finally {
                $entryStream.Dispose()
            }
        }
    }
    finally {
        $archive.Dispose()
    }
}
finally {
    $fileStream.Dispose()
}

Move-Item -LiteralPath $tempZip -Destination $packagePath -Force
Write-Host "VSIX package created: $packagePath"
