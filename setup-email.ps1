# Techloom — Gmail SMTP setup for contact form emails
param(
    [string]$Email,
    [string]$AppPassword,
    [string]$ContactEmail
)

$envFile = Join-Path $PSScriptRoot "backend\.env"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: backend\.env not found. Run from the techloom project folder." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "  ========================================" -ForegroundColor Magenta
Write-Host "   Techloom — Email Setup (Gmail SMTP)" -ForegroundColor Magenta
Write-Host "  ========================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "  You need a Gmail App Password (not your regular password):"
Write-Host "  1. Go to https://myaccount.google.com/apppasswords"
Write-Host "  2. Sign in and create an app password for 'Mail'"
Write-Host "  3. Copy the 16-character password (no spaces)"
Write-Host ""

if (-not $Email) {
    $Email = Read-Host "Your Gmail address"
}
if (-not $AppPassword) {
    $secure = Read-Host "Gmail App Password" -AsSecureString
    $AppPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    )
}
if (-not $ContactEmail) {
    $ContactEmail = $Email
}

$Email = $Email.Trim()
$AppPassword = ($AppPassword -replace '\s', '').Trim()
$ContactEmail = $ContactEmail.Trim()

if ($Email -notmatch '^[^@]+@[^@]+\.[^@]+$') {
    Write-Host "ERROR: Invalid email address." -ForegroundColor Red
    exit 1
}
if ($AppPassword.Length -lt 8) {
    Write-Host "ERROR: App password looks too short." -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile -Raw
$replacements = @{
    'SMTP_USER=.*'          = "SMTP_USER=$Email"
    'SMTP_PASS=.*'          = "SMTP_PASS=$AppPassword"
    'EMAIL_FROM=.*'         = "EMAIL_FROM=Techloom <$Email>"
    'CONTACT_EMAIL=.*'      = "CONTACT_EMAIL=$ContactEmail"
}

foreach ($pattern in $replacements.Keys) {
    $value = $replacements[$pattern]
    if ($content -match "(?m)^$pattern") {
        $content = $content -replace "(?m)^$pattern", $value
    } else {
        $content += "`n$value"
    }
}

Set-Content -Path $envFile -Value $content.TrimEnd() -NoNewline
Add-Content -Path $envFile -Value "`n"

Write-Host ""
Write-Host "  Email configured!" -ForegroundColor Green
Write-Host "  SMTP_USER:     $Email"
Write-Host "  CONTACT_EMAIL: $ContactEmail (receives contact form messages)"
Write-Host ""
Write-Host "  Restart the backend server for changes to take effect."
Write-Host "  Run START-TECHLOOM.bat or restart the 'Techloom API' window."
Write-Host ""

# Quick SMTP test
Write-Host "  Testing SMTP connection..." -ForegroundColor Yellow
Push-Location (Join-Path $PSScriptRoot "backend")
try {
    $testScript = @"
import 'dotenv/config';
import nodemailer from 'nodemailer';
const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
try {
  await t.verify();
  console.log('SMTP_OK');
} catch (e) {
  console.error('SMTP_FAIL:', e.message);
  process.exit(1);
}
"@
    $testScript | Out-File -FilePath "_smtp-test.mjs" -Encoding utf8
    $result = node _smtp-test.mjs 2>&1
    Remove-Item "_smtp-test.mjs" -ErrorAction SilentlyContinue
    if ($result -match 'SMTP_OK') {
        Write-Host "  SMTP connection successful!" -ForegroundColor Green
    } else {
        Write-Host "  SMTP test failed: $result" -ForegroundColor Red
        Write-Host "  Check your app password and try again."
    }
} catch {
    Write-Host "  Could not run SMTP test: $_" -ForegroundColor Yellow
} finally {
    Pop-Location
}

Write-Host ""