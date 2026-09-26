# Generates localized SmallBasicLibrary documentation assets for both plugins
# from the SmallBasicHomeSite documentation XML files:
#
#   Output 1 (VS Code):
#     visual_studio_code_plugin/vendor/SmallBasicOnline/src/strings/documentation.locales.ts
#     - key spelling matches strings/documentation.ts (PascalCase parameter suffixes)
#
#   Output 2 (Visual Studio):
#     visual_studio_plugin/vendor/SmallBasicEditor/Source/SmallBasic.Utilities/DocumentationLocales/DocumentationLocales.xml
#     - key spelling matches Resources/LibrariesResources.resx (camelCase parameter
#       suffixes plus _ReturnValue entries), embedded into SmallBasic.Utilities.dll
#
# Keys missing for a locale are simply omitted so that the English resources act
# as the fallback at runtime.
#
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File generate-localized-docs.ps1

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$xmlDir = Join-Path $repoRoot 'official_repo\homesite\src\assets\documentation\xml'
$resxPath = Join-Path $repoRoot 'visual_studio_plugin\vendor\SmallBasicEditor\Source\SmallBasic.Utilities\Resources\LibrariesResources.resx'
$docTsPath = Join-Path $repoRoot 'visual_studio_code_plugin\vendor\SmallBasicOnline\src\strings\documentation.ts'
$tsOutPath = Join-Path $repoRoot 'visual_studio_code_plugin\vendor\SmallBasicOnline\src\strings\documentation.locales.ts'
$xmlOutPath = Join-Path $repoRoot 'visual_studio_plugin\vendor\SmallBasicEditor\Source\SmallBasic.Utilities\DocumentationLocales\DocumentationLocales.xml'

function Normalize([string]$text) {
    if ($null -eq $text) { return $null }
    return ($text -replace '\s+', ' ').Trim()
}

function PascalCase([string]$name) {
    if ([string]::IsNullOrEmpty($name)) { return $name }
    return $name.Substring(0, 1).ToUpperInvariant() + $name.Substring(1)
}

function Escape-TsString([string]$text) {
    $escaped = $text.Replace('\', '\\').Replace('"', '\"').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
    return '"' + $escaped + '"'
}

# ---------------------------------------------------------------------------
# 1. English key sets (ordered) from resx / documentation.ts / English doc XML
# ---------------------------------------------------------------------------

$resx = [xml](Get-Content $resxPath -Raw -Encoding UTF8)
$resxKeys = New-Object System.Collections.Generic.List[string]
foreach ($data in $resx.root.data) {
    if ($data.name) { $resxKeys.Add($data.name) }
}

$docTs = Get-Content $docTsPath -Raw -Encoding UTF8
$tsKeys = New-Object System.Collections.Generic.List[string]
foreach ($m in [regex]::Matches($docTs, 'export const (\w+)\s*=')) {
    $tsKeys.Add($m.Groups[1].Value)
}

function Get-MemberInfo([string]$memberName) {
    # T:Microsoft.SmallBasic.Library.Array
    # M:Microsoft.SmallBasic.Library.Array.ContainsIndex(Microsoft.SmallBasic.Library.Primitive,...)
    # P:Microsoft.SmallBasic.Library.Turtle.Speed
    # E:Microsoft.SmallBasic.Library.GraphicsWindow.KeyDown
    if ($memberName -notmatch '^(?<kind>T|M|P|E):Microsoft\.SmallBasic\.Library\.(?<type>\w+)(\.(?<member>\w+))?') {
        return $null
    }

    $kind = $Matches['kind']
    $type = $Matches['type']
    $member = $Matches['member']
    if ($kind -eq 'T') { $member = $null }
    return @{ Kind = $kind; Type = $type; Member = $member }
}

function Get-XmlText($node) {
    # The PowerShell XML adapter returns the text content as a string for
    # elements with a single text child, and an XmlElement otherwise.
    if ($null -eq $node) { return $null }
    if ($node -is [string]) { return Normalize $node }
    return Normalize $node.InnerText
}

function Load-XmlDocument([string]$path) {
    # XmlDocument.Load honors the encoding declared by the document itself,
    # unlike Get-Content which relies on the console/PS encoding defaults.
    $doc = New-Object System.Xml.XmlDocument
    $doc.Load($path)
    return $doc
}

function Get-MemberEntries($member) {
    $info = Get-MemberInfo $member.name
    if ($null -eq $info) { return $null }

    $base = $info.Type
    if ($info.Member) { $base = "$($info.Type)_$($info.Member)" }

    $entries = New-Object System.Collections.Generic.List[object]
    $summaryText = Get-XmlText $member.summary
    if ($summaryText) { [void]$entries.Add(@{ Key = $base; Kind = 'summary'; Text = $summaryText }) }
    foreach ($param in @($member.param)) {
        if ($param -and $param.name) {
            $text = Get-XmlText $param
            if ($text) { [void]$entries.Add(@{ Key = "${base}_$($param.name)"; Kind = 'param'; Text = $text }) }
        }
    }
    $returnsText = Get-XmlText $member.returns
    if ($returnsText) { [void]$entries.Add(@{ Key = "${base}_ReturnValue"; Kind = 'returns'; Text = $returnsText }) }
    return $entries
}

# Keyword documentation keys come from the English doc XML (the library resx/ts
# do not contain them, but both completion providers can render keyword help).
$enDoc = Load-XmlDocument (Join-Path $xmlDir 'SmallBasicLibrary.xml')
$keywordKeys = New-Object System.Collections.Generic.List[string]
foreach ($member in $enDoc.doc.members.member) {
    $info = Get-MemberInfo $member.name
    if ($null -ne $info -and $info.Type -eq 'Keywords' -and $member.summary) {
        $key = 'Keywords'
        if ($info.Member) { $key = "Keywords_$($info.Member)" }
        if (-not $keywordKeys.Contains($key)) { $keywordKeys.Add($key) }
    }
}

function New-TargetSet([System.Collections.Generic.List[string]]$baseKeys) {
    # Returns an ordered key list + case-insensitive lookup (lower -> exact key)
    $ordered = New-Object System.Collections.Generic.List[string]
    $lookup = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    foreach ($key in $baseKeys) {
        $lower = $key.ToLowerInvariant()
        if (-not $lookup.ContainsKey($lower)) {
            $lookup[$lower] = $key
            $ordered.Add($key)
        }
    }
    foreach ($key in $keywordKeys) {
        $lower = $key.ToLowerInvariant()
        if (-not $lookup.ContainsKey($lower)) {
            $lookup[$lower] = $key
            $ordered.Add($key)
        }
    }
    return @{ Ordered = $ordered; Lookup = $lookup }
}

$vsTarget = New-TargetSet $resxKeys
$tsTarget = New-TargetSet $tsKeys

# ---------------------------------------------------------------------------
# 2. Parse each localized doc XML into VS/TS key -> text dictionaries
# ---------------------------------------------------------------------------

$vsByLocale = New-Object 'System.Collections.Generic.Dictionary[string,System.Collections.Generic.Dictionary[string,string]]'
$tsByLocale = New-Object 'System.Collections.Generic.Dictionary[string,System.Collections.Generic.Dictionary[string,string]]'
$localeOrder = New-Object System.Collections.Generic.List[string]
$stats = New-Object System.Collections.Generic.List[string]

foreach ($file in (Get-ChildItem $xmlDir -Filter 'SmallBasicLibrary*.xml' | Sort-Object Name)) {
    if ($file.Name -eq 'SmallBasicLibrary.xml') { continue } # English is the built-in fallback

    if ($file.Name -match '^SmallBasicLibrary\.(.+)\.xml$') {
        $locale = $Matches[1]
    } else {
        continue
    }

    $doc = Load-XmlDocument $file.FullName
    $vsDict = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    $tsDict = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    $matchedVs = 0; $matchedTs = 0; $unmatched = 0

    foreach ($member in $doc.doc.members.member) {
        $entries = Get-MemberEntries $member
        if ($null -eq $entries) { continue }

        foreach ($entry in @($entries)) {
            $text = $entry.Text
            if ([string]::IsNullOrEmpty($text)) { continue }

            # Visual Studio: resx spelling (camelCase params, _ReturnValue)
            $vsKey = $null
            if ($vsTarget.Lookup.TryGetValue($entry.Key.ToLowerInvariant(), [ref]$vsKey)) {
                if (-not $vsDict.ContainsKey($vsKey)) { $matchedVs++ }
                $vsDict[$vsKey] = $text
            } else {
                $unmatched++
            }

            # VS Code: documentation.ts spelling (PascalCase params, no _ReturnValue)
            if ($entry.Kind -eq 'returns') {
                continue  # documentation.ts has no ReturnValue entries
            }

            $tsCandidate = $entry.Key
            if ($entry.Kind -eq 'param') {
                $idx = $tsCandidate.LastIndexOf('_')
                $tsCandidate = $tsCandidate.Substring(0, $idx + 1) + (PascalCase $tsCandidate.Substring($idx + 1))
            }

            $tsKey = $null
            if ($tsTarget.Lookup.TryGetValue($tsCandidate.ToLowerInvariant(), [ref]$tsKey)) {
                if (-not $tsDict.ContainsKey($tsKey)) { $matchedTs++ }
                $tsDict[$tsKey] = $text
            }
        }
    }

    $vsByLocale[$locale] = $vsDict
    $tsByLocale[$locale] = $tsDict
    $localeOrder.Add($locale)
    $stats.Add(("  {0,-10} VS: {1} strings   VSCode: {2} strings   skipped: {3}" -f $locale, $matchedVs, $matchedTs, $unmatched))
}

# ---------------------------------------------------------------------------
# 3. Emit documentation.locales.ts (VS Code)
# ---------------------------------------------------------------------------

$tsLines = New-Object System.Collections.Generic.List[string]
$tsLines.Add('// This file is generated by tools/generate-localized-docs.ps1 from')
$tsLines.Add('// official_repo/homesite/src/assets/documentation/xml/SmallBasicLibrary.*.xml.')
$tsLines.Add('// Do not edit by hand; run the script to regenerate.')
$tsLines.Add('//')
$tsLines.Add('// Keys that a locale does not provide fall back to the English constants in')
$tsLines.Add('// ./documentation at runtime.')
$tsLines.Add('')
$tsLines.Add('export const documentationLocales: Readonly<Record<string, Readonly<Record<string, string>>>> = {')

foreach ($locale in $localeOrder) {
    $tsLines.Add("    $(Escape-TsString $locale): {")
    foreach ($key in $tsTarget.Ordered) {
        $text = $null
        if ($tsByLocale[$locale].TryGetValue($key, [ref]$text)) {
            $tsLines.Add("        $(Escape-TsString $key): $(Escape-TsString $text),")
        }
    }
    $tsLines.Add('    },')
}
$tsLines.Add('};')
$tsLines.Add('')

[System.IO.File]::WriteAllText($tsOutPath, ($tsLines -join "`n"), (New-Object System.Text.UTF8Encoding($false)))

# ---------------------------------------------------------------------------
# 4. Emit DocumentationLocales.xml (Visual Studio)
# ---------------------------------------------------------------------------

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('<?xml version="1.0" encoding="utf-8"?>')
[void]$sb.AppendLine('<!-- Generated by tools/generate-localized-docs.ps1 from')
[void]$sb.AppendLine('     official_repo/homesite/src/assets/documentation/xml/SmallBasicLibrary.*.xml. -->')
[void]$sb.AppendLine('<locales>')
foreach ($locale in $localeOrder) {
    [void]$sb.AppendLine("  <locale name=""$locale"">")
    foreach ($key in $vsTarget.Ordered) {
        $text = $null
        if ($vsByLocale[$locale].TryGetValue($key, [ref]$text)) {
            $escapedKey = [System.Security.SecurityElement]::Escape($key)
            $escapedText = [System.Security.SecurityElement]::Escape($text)
            [void]$sb.AppendLine("    <s k=""$escapedKey"">$escapedText</s>")
        }
    }
    [void]$sb.AppendLine('  </locale>')
}
[void]$sb.AppendLine('</locales>')

$dir = Split-Path -Parent $xmlOutPath
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
[System.IO.File]::WriteAllText($xmlOutPath, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))

# ---------------------------------------------------------------------------
# 5. Report
# ---------------------------------------------------------------------------

Write-Host "Generated:"
Write-Host ("  " + $tsOutPath)
Write-Host ("  " + $xmlOutPath)
Write-Host ""
Write-Host "Locale statistics:"
$stats | ForEach-Object { Write-Host $_ }

Write-Host ""
$vsMissing = @($vsTarget.Ordered | Where-Object { -not $vsByLocale['zh-Hans'].ContainsKey($_) })
$tsMissing = @($tsTarget.Ordered | Where-Object { -not $tsByLocale['zh-Hans'].ContainsKey($_) })
Write-Host ("zh-Hans coverage: VS {0}/{1} (English fallback for {2})   VSCode {3}/{4} (English fallback for {5})" -f `
    ($vsTarget.Ordered.Count - $vsMissing.Count), $vsTarget.Ordered.Count, $vsMissing.Count, `
    ($tsTarget.Ordered.Count - $tsMissing.Count), $tsTarget.Ordered.Count, $tsMissing.Count)
$vsMissing | Select-Object -First 10 | ForEach-Object { Write-Host ("  VS missing:   " + $_) }
$tsMissing | Select-Object -First 10 | ForEach-Object { Write-Host ("  TS missing:   " + $_) }
