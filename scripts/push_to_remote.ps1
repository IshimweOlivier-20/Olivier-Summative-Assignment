<#
push_to_remote.ps1

Safely import the current local workspace into a fresh clone of the given remote
and push on a new branch. This script must be run locally (PowerShell) from
the repository root (the local workspace you want to push).

Default remote (change with -RemoteUrl):
https://github.com/ALU-BSE/summative-assessment-civicevents-project-IshimweOlivier-20.git

Usage:
  pwsh ./scripts/push_to_remote.ps1
  # or with parameters
  pwsh ./scripts/push_to_remote.ps1 -RemoteUrl "https://github.com/you/repo.git" -BranchName import-local-changes
#>

param(
  [string]$RemoteUrl = 'https://github.com/ALU-BSE/summative-assessment-civicevents-project-IshimweOlivier-20.git',
  [string]$BranchName = 'import-local-changes',
  [string[]]$ExcludeDirs = @('.git','node_modules','.vscode','.github'),
  [string[]]$ExcludeFiles = @('.env','env.local','TODO.txt','TODO.md','todo.md','*.ai*','*.gpt*','*copilot*','*chatgpt*')
)

function Check-Command($cmd){
  $which = Get-Command $cmd -ErrorAction SilentlyContinue
  if(-not $which){
    Write-Error "Required command '$cmd' not found in PATH. Install it and re-run."
    exit 1
  }
}

Check-Command git
Check-Command robocopy

$LocalPath = (Resolve-Path .).Path
$TempDir = Join-Path $env:TEMP ("civicevents-remote-{0}" -f ([System.Guid]::NewGuid().ToString('N')))

Write-Host "Creating temporary clone at: $TempDir"
git clone $RemoteUrl $TempDir
if($LASTEXITCODE -ne 0){ Write-Error "git clone failed. Check RemoteUrl and network."; exit 1 }

Push-Location $TempDir
try{
  git checkout -b $BranchName 2>$null
  if($LASTEXITCODE -ne 0){ Write-Host "Created branch or switched to existing branch $BranchName" }

  # Build robocopy exclude parameters
  $xd = $ExcludeDirs -join ' '
  $xf = $ExcludeFiles -join ' '

  Write-Host "Copying files from local workspace into clone (excluding: $($ExcludeDirs -join ', '), $($ExcludeFiles -join ', '))"

  # Robocopy: mirror mode. Exclude directories/files from source so destination .git remains.
  robocopy $LocalPath $TempDir /MIR /XD $ExcludeDirs /XF $ExcludeFiles /NFL /NDL /NJH /NJS /MT:8

  # Check for changes
  $status = git status --porcelain
  if(-not $status){
    Write-Host "No changes to commit. Nothing to push."; return
  }

  git add -A
  git commit -m "chore: import local workspace — frontend + backend updates"
  if($LASTEXITCODE -ne 0){ Write-Error "git commit failed"; exit 1 }

  Write-Host "Pushing branch '$BranchName' to origin"
  git push -u origin $BranchName
  if($LASTEXITCODE -ne 0){ Write-Error "git push failed"; exit 1 }

  Write-Host "Push complete. Open a PR from '$BranchName' into the repository's default branch."

} finally { Pop-Location }

Write-Host "Temporary clone remains at: $TempDir (delete when done)"
