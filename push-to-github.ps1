# Push Techloom to GitHub as "techloom-website"
# Usage: .\push-to-github.ps1
# Optional: .\push-to-github.ps1 -GitHubUser "yourusername" -GitHubToken "ghp_xxx"

param(
    [string]$GitHubUser = "rajaryan0026",
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    [string]$RepoName = "techloom-website"
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location $Root

$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) { $git = "git" }

Write-Host ""
Write-Host "  Techloom → GitHub ($RepoName)" -ForegroundColor Magenta
Write-Host ""

# Git identity (local only)
if (-not (& $git config user.email 2>$null)) {
    & $git config user.email "rajaryan2611@gmail.com"
    & $git config user.name "Raj Aryan"
}

# Init repo if needed
if (-not (Test-Path ".git")) {
    & $git init
    & $git branch -M main
}

# Stage and commit
& $git add .
$status = & $git status --porcelain
if ($status) {
    & $git commit -m "Initial commit: Techloom website"
    Write-Host "  Committed changes." -ForegroundColor Green
} else {
    Write-Host "  Nothing new to commit." -ForegroundColor Yellow
}

# GitHub username
if (-not $GitHubUser) {
    $GitHubUser = Read-Host "Enter your GitHub username"
}

$remoteUrl = "https://github.com/$GitHubUser/$RepoName.git"

# Create repo via API if token provided
if ($GitHubToken) {
    Write-Host "  Creating GitHub repo via API..." -ForegroundColor Cyan
    $body = @{ name = $RepoName; description = "Techloom marketing website — Next.js + Express"; private = $false } | ConvertTo-Json
    $headers = @{ Authorization = "Bearer $GitHubToken"; "User-Agent" = "techloom-deploy" }
    try {
        Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  Repo created: https://github.com/$GitHubUser/$RepoName" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -match "422") {
            Write-Host "  Repo may already exist — continuing with push." -ForegroundColor Yellow
        } else {
            Write-Host "  API create failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host ""
    Write-Host "  Create the repo manually if it does not exist:" -ForegroundColor Yellow
    Write-Host "  https://github.com/new?name=$RepoName" -ForegroundColor White
    Write-Host "  (Do NOT add README, .gitignore, or license)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after creating the repo"
}

# Remote
$existing = & $git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    & $git remote add origin $remoteUrl
} else {
    & $git remote set-url origin $remoteUrl
}

Write-Host "  Pushing to $remoteUrl ..." -ForegroundColor Cyan
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  Done! Repo: https://github.com/$GitHubUser/$RepoName" -ForegroundColor Green
    Write-Host "  Next: follow README.md → Deploy to production" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "  Push failed. Common fixes:" -ForegroundColor Red
    Write-Host "  1. Create repo at https://github.com/new?name=$RepoName"
    Write-Host "  2. Sign in: git credential manager (GitHub login popup)"
    Write-Host "  3. Or use token: git remote set-url origin https://TOKEN@github.com/$GitHubUser/$RepoName.git"
}

Write-Host ""