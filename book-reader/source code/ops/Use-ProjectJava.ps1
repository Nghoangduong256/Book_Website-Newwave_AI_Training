# Chỉ kích hoạt JDK của Book Reader trong cửa sổ PowerShell hiện tại.
# Chạy từ source code/: & './ops/Use-ProjectJava.ps1'
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$brSourceRoot = Split-Path -Parent $PSScriptRoot
$brToolchain = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $PSScriptRoot 'toolchain.json') | ConvertFrom-Json
$brJavaHome = Join-Path $brSourceRoot $brToolchain.java.directory
$brJavaExe = Join-Path $brJavaHome 'bin/java.exe'

if (-not (Test-Path -LiteralPath $brJavaExe -PathType Leaf)) {
    throw 'Chưa cài JDK của Book Reader. Xem management/SECURITY-UPDATE-2026-11-23.md.'
}

$ErrorActionPreference = 'Continue'
$brJavaVersion = & $brJavaExe '-XshowSettings:properties' '-version' 2>&1
$brJavaExit = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
if ($brJavaExit -ne 0) {
    throw 'Không khởi động được JDK của Book Reader.'
}
$brExpectedRuntime = [regex]::Escape($brToolchain.java.runtimeVersion)
if (-not ($brJavaVersion -match "java.runtime.version\s*=\s*$brExpectedRuntime\s*$")) {
    throw 'JDK cục bộ không khớp phiên bản đã khóa trong ops/toolchain.json.'
}

$env:JAVA_HOME = $brJavaHome
$brBin = Join-Path $brJavaHome 'bin'
$brOtherPaths = $env:PATH -split ';' | Where-Object { $_ -and $_.TrimEnd('\', '/') -ne $brBin.TrimEnd('\', '/') }
$env:PATH = (@($brBin) + $brOtherPaths) -join ';'
# JDK 17 trên Windows Nhật có thể mặc định MS932; giữ tiếng Việt nhất quán.
if ($env:JAVA_TOOL_OPTIONS -notmatch '(?:^|\s)-Dfile.encoding=UTF-8(?:\s|$)') {
    $env:JAVA_TOOL_OPTIONS = ($env:JAVA_TOOL_OPTIONS + ' -Dfile.encoding=UTF-8').Trim()
}
Write-Output ('Book Reader JAVA_HOME: ' + $env:JAVA_HOME)
Write-Output ('JDK: ' + $brToolchain.java.runtimeVersion + ' (Temurin)')
