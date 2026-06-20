# Techloom Server Launcher
$nodePath = "C:\Users\rajar\AppData\Local\OpenAI\Codex\bin\5b9024f90663758b;C:\Users\rajar\AppData\Roaming\npm"
$root = "C:\Users\rajar\projects\techloom"

foreach ($port in 3000, 4000) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 2

# Use cmd /k so output is not buffered (prevents silent crashes)
Start-Process cmd.exe -ArgumentList "/k", "title Techloom API && set PATH=$nodePath;%PATH% && cd /d $root\backend && npm run dev"
Start-Sleep -Seconds 8
Start-Process cmd.exe -ArgumentList "/k", "title Techloom Web && set PATH=$nodePath;%PATH% && cd /d $root\frontend && npm run dev"

Write-Host ""
Write-Host "Techloom servers starting in CMD windows..."
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  API:      http://localhost:4000"
Write-Host "  Login:    admin@techloom.com / Admin@Techloom123"
Write-Host ""
Write-Host "Look for two CMD windows: 'Techloom API' and 'Techloom Web'"
Write-Host "Keep BOTH windows open or login will fail."
Write-Host ""

for ($i = 1; $i -le 15; $i++) {
  Start-Sleep -Seconds 4
  try {
    $api = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 3
    $web = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 15
    if ($api.StatusCode -eq 200 -and $web.StatusCode -eq 200) {
      Write-Host "Both servers are READY!" -ForegroundColor Green
      break
    }
  } catch {
    Write-Host "  Waiting... ($i/15)"
  }
}