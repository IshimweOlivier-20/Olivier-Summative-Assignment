<#
Quick backend auth/test script for Windows PowerShell.
Usage:
  Open PowerShell, then:
    cd backend
    .\run_quick_tests.ps1 -BaseUrl http://localhost:4000

The script will:
- Check /health
- Create a test signup (random email)
- Login with that user
- Print the token
- Call a protected endpoint (GET /api/events) with the token

This is a lightweight alternative to running Postman for quick verification.
#>
param(
  [string]$BaseUrl = 'http://localhost:4000'
)

function WriteHeader($t){ Write-Host "`n=== $t ===" -ForegroundColor Cyan }

WriteHeader "Health check"
try{
  $h = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get -ErrorAction Stop
  Write-Host "Health:" ($h | ConvertTo-Json -Depth 2)
}catch{
  Write-Host "Health check failed:" $_.Exception.Message -ForegroundColor Red
  exit 1
}

# Generate a test user
$now = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "testuser+$now@example.com"
$testPassword = "TestP@ssw0rd!"

WriteHeader "Signup test user"
$signupBody = @{ full_name = "Quick Test User"; email = $testEmail; password = $testPassword } | ConvertTo-Json
try{
  $resp = Invoke-RestMethod -Uri "$BaseUrl/api/auth/signup" -Method Post -Body $signupBody -ContentType 'application/json' -ErrorAction Stop
  Write-Host "Signup response:" ($resp | ConvertTo-Json -Depth 3)
}catch{
  Write-Host "Signup failed:" $_.Exception.Response.StatusCode.value__  -ForegroundColor Yellow
  try{ $rbody = $_.Exception.Response.GetResponseStream() | Select-Object -First 1 }catch{}
  Write-Host "Exception: $_" -ForegroundColor Red
}

WriteHeader "Login"
$loginBody = @{ email = $testEmail; password = $testPassword } | ConvertTo-Json
try{
  $login = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType 'application/json' -ErrorAction Stop
  Write-Host "Login response:" ($login | ConvertTo-Json -Depth 3)
  # try to extract token from common shapes
  $token = $null
  if($login.token){ $token = $login.token } 
  elseif($login.data -and $login.data.token){ $token = $login.data.token }
  elseif($login.data -and $login.data.data -and $login.data.data.token){ $token = $login.data.data.token }
  if(-not $token){ Write-Host "Token not found in login response" -ForegroundColor Yellow }
  else{ Write-Host "Token length:" $token.Length -ForegroundColor Green }
}catch{
  Write-Host "Login failed:" $_.Exception.Message -ForegroundColor Red
  if($_.Exception.Response){
    try{ $body = (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd(); Write-Host "Response body:" $body }catch{}
  }
  exit 1
}

if($token){
  WriteHeader "Protected request: GET /api/events"
  try{
    $events = Invoke-RestMethod -Uri "$BaseUrl/api/events" -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
    Write-Host "Events response summary:" -ForegroundColor Green
    Write-Host ($events | ConvertTo-Json -Depth 3)
  }catch{
    Write-Host "Protected request failed:" $_.Exception.Message -ForegroundColor Red
    if($_.Exception.Response){ try{ $body = (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd(); Write-Host "Response body:" $body }catch{} }
  }
}

WriteHeader "Done"
