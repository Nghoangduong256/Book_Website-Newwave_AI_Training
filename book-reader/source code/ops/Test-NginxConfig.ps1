# Kiểm cấu hình server bằng nginx Windows; không khởi động dịch vụ hoặc mở cổng.
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$brSourceRoot = Split-Path -Parent $PSScriptRoot
$brSpec = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $PSScriptRoot 'toolchain.json') | ConvertFrom-Json
$brNginxRoot = Join-Path $brSourceRoot ('.runtime/nginx-' + $brSpec.nginx.version)
$brNginxExe = Join-Path $brNginxRoot 'nginx.exe'
if (-not (Test-Path -LiteralPath $brNginxExe -PathType Leaf)) {
    throw 'Chưa có nginx Windows đã kiểm chữ ký. Xem báo cáo bảo mật trong management/.'
}

$brCheckRoot = Join-Path $brSourceRoot '.runtime/nginx-config-check'
New-Item -ItemType Directory -Path (Join-Path $brCheckRoot 'logs'), (Join-Path $brCheckRoot 'temp') -Force | Out-Null
$brServerConfig = (Join-Path $brSourceRoot 'infra/nginx/nginx.conf').Replace('\', '/')
$brConfig = @"
worker_processes 1;
error_log logs/error.log notice;
pid logs/nginx.pid;
events { worker_connections 128; }
http {
    # Thay DNS của container bằng loopback chỉ trong phép kiểm cú pháp.
    upstream book_reader_api { server 127.0.0.1:18081; }
    upstream book_reader_frontend { server 127.0.0.1:18082; }
    include "$brServerConfig";
}
"@
$brConfigPath = Join-Path $brCheckRoot 'nginx.conf'
[System.IO.File]::WriteAllText($brConfigPath, $brConfig, [System.Text.UTF8Encoding]::new($false))
# nginx ghi kết quả kiểm thành công ra stderr; kiểm mã thoát, không coi stderr là lỗi.
$ErrorActionPreference = 'Continue'
$brOutput = & $brNginxExe '-p' ($brCheckRoot.Replace('\', '/') + '/') '-c' 'nginx.conf' '-t' 2>&1
$brExitCode = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
$brOutput | ForEach-Object { Write-Output $_.ToString() }
if ($brExitCode -ne 0) {
    throw ('nginx -t thất bại, mã thoát: ' + $brExitCode)
}
Write-Output 'Đạt kiểm cú pháp server. Chưa kiểm Docker, backend, frontend hoặc HTTPS.'
