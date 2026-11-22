# Cài JDK đã khóa cho Book Reader, không thay Java toàn máy.
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$brSourceRoot = Split-Path -Parent $PSScriptRoot
$brSpec = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $PSScriptRoot 'toolchain.json') | ConvertFrom-Json
$brRuntime = Join-Path $brSourceRoot '.runtime'
$brJavaHome = Join-Path $brSourceRoot $brSpec.java.directory
$brJavaExe = Join-Path $brJavaHome 'bin/java.exe'
$brDownloads = Join-Path $brRuntime 'downloads'
$brZip = Join-Path $brDownloads 'temurin-17.0.21.1_2-windows-x64.zip'

if (-not [Environment]::Is64BitOperatingSystem -or $env:OS -ne 'Windows_NT') {
    throw 'Gói cài này chỉ dùng cho Windows x64.'
}

New-Item -ItemType Directory -Path $brDownloads -Force | Out-Null
if (-not (Test-Path -LiteralPath $brZip -PathType Leaf)) {
    # curl hỗ trợ tiếp tục phần tải dở và giới hạn thời gian hữu hạn.
    $brPartial = $brZip + '.partial'
    & curl.exe '--fail' '--location' '--silent' '--show-error' '--connect-timeout' '20' '--max-time' '900' '--continue-at' '-' '--output' $brPartial $brSpec.java.windowsX64Url
    if ($LASTEXITCODE -ne 0) {
        throw 'Chưa tải xong JDK. Có thể chạy lại để tiếp tục phần tải dở.'
    }
    $brPartialHash = (Get-FileHash -LiteralPath $brPartial -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($brPartialHash -ne $brSpec.java.sha256) {
        throw 'SHA-256 phần tải không khớp. Không cài JDK.'
    }
    Move-Item -LiteralPath $brPartial -Destination $brZip
}

$brActualHash = (Get-FileHash -LiteralPath $brZip -Algorithm SHA256).Hash.ToLowerInvariant()
if ($brActualHash -ne $brSpec.java.sha256) {
    throw 'SHA-256 không khớp. Không giải nén hoặc chạy JDK đã tải.'
}

if (-not (Test-Path -LiteralPath $brJavaExe -PathType Leaf)) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $brArchive = [System.IO.Compression.ZipFile]::OpenRead($brZip)
    try {
        $brBoundary = [System.IO.Path]::GetFullPath($brJavaHome).TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
        foreach ($brEntry in $brArchive.Entries) {
            $brTarget = [System.IO.Path]::GetFullPath((Join-Path $brRuntime $brEntry.FullName))
            if (-not ($brTarget.StartsWith($brBoundary, [System.StringComparison]::OrdinalIgnoreCase) -or $brTarget.TrimEnd('\', '/') -eq $brJavaHome)) {
                throw 'Tệp ZIP chứa đường dẫn ngoài thư mục JDK dự kiến.'
            }
        }
    } finally {
        $brArchive.Dispose()
    }
    Expand-Archive -LiteralPath $brZip -DestinationPath $brRuntime
}

& (Join-Path $PSScriptRoot 'Use-ProjectJava.ps1')
