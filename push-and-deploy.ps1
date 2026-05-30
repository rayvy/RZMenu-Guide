param(
  [Parameter(Position = 0)]
  [string]$Message = "Update site"
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $repo

git add -A

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No changes to commit."
  exit 0
}

git commit -m $Message
git push

Write-Host "Pushed. GitHub Pages should deploy automatically from the push."
