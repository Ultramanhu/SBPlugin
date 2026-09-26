param()

$ErrorActionPreference = 'Stop'
$pluginRoot = Split-Path -Parent $PSScriptRoot

Push-Location $pluginRoot
try {
    npm run build
    npm run package:vsix
}
finally {
    Pop-Location
}
