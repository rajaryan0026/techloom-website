# Deploy Techloom API to Firebase Cloud Functions
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host ""
Write-Host "  Techloom — Firebase API Deploy" -ForegroundColor Magenta
Write-Host ""

if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "Firebase CLI not found. Install:" -ForegroundColor Yellow
    Write-Host "  npm install -g firebase-tools"
    Write-Host "  firebase login"
    exit 1
}

$envFile = Join-Path $root "functions\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "Missing functions\.env" -ForegroundColor Red
    Write-Host "  copy functions\.env.example functions\.env"
    Write-Host "  Edit DATABASE_URL, RESEND_API_KEY, ADMIN_PASSWORD, etc."
    exit 1
}

Push-Location $root
try {
    Write-Host "Building backend..." -ForegroundColor Cyan
    Push-Location (Join-Path $root "backend")
    npm install
    npm run build
    Pop-Location

    Write-Host "Building functions..." -ForegroundColor Cyan
    Push-Location (Join-Path $root "functions")
    npm install
    npm run build
    Pop-Location

    Write-Host "Deploying to Firebase..." -ForegroundColor Cyan
    firebase deploy --only functions

    Write-Host ""
    Write-Host "  Deploy complete!" -ForegroundColor Green
    Write-Host "  Update Vercel NEXT_PUBLIC_API_URL to:"
    Write-Host "  https://asia-south1-techloom-48db5.cloudfunctions.net/api/api"
    Write-Host ""
} finally {
    Pop-Location
}