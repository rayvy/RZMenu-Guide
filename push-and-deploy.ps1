param(
  [Parameter(Position = 0)]
  [string]$Message = "Update site"
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $repo

Write-Host "Repo: $repo"
Write-Host "Building guide manifest..."
python tools/build_guide_manifest.py

Write-Host "Staging files..."
git add -A

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No changes to commit. Save your files first, then run this again."
  if ($Host.Name -eq "ConsoleHost") { Read-Host "Press Enter to close" | Out-Null }
  exit 0
}

try {
  Write-Host "Committing: $Message"
  git commit -m $Message

  Write-Host "Pushing to origin/main..."
  git push

  Write-Host "Pushed. GitHub Pages should deploy automatically from the push."
}
catch {
  Write-Host ""
  Write-Host "Push failed:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($Host.Name -eq "ConsoleHost") { Read-Host "Press Enter to close" | Out-Null }
  exit 1
}

if ($Host.Name -eq "ConsoleHost") { Read-Host "Press Enter to close" | Out-Null }
