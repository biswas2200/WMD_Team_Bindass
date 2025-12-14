$ErrorActionPreference = 'Stop'

function Test-Endpoint {
    param([string]$name, [scriptblock]$action)
    Write-Host "Testing: $name" -ForegroundColor Cyan
    try {
        &$action
        Write-Host "PASS" -ForegroundColor Green
    } catch {
        Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
             $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
             Write-Host "Response: $($reader.ReadToEnd())" -ForegroundColor Yellow
        }
        exit 1
    }
}

$baseUrl = "http://localhost:8080"
$alexUser = @{
    name = "Alex Chen"
    email = "alex.chen@kodra.ai"
    password = "password123"
    username = "alexchen"
}

Test-Endpoint "0. Debug Mission Ping" {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/kodra/missions/ping" -Method Get
    Write-Host "Ping response: $res"
}

Test-Endpoint "1. Register User (Alex Chen)" {
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body ($alexUser | ConvertTo-Json) -ContentType "application/json"
        Write-Host "Registered User ID: $($res.id)"
        $global:userId = $res.id
    } catch {
        if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::BadRequest) {
             Write-Host "User likely exists, proceeding to login..." -ForegroundColor Yellow
        } else {
             throw $_
        }
    }
}

Test-Endpoint "2. Login" {
    $body = @{ email = $alexUser.email; password = $alexUser.password }
    $res = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($body | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Login Token obtained"
    $global:token = $res.token
    if (-not $global:userId) {
         Write-Host "UserId not found from registration. Approximating to 2 (Alex Chen)." -ForegroundColor Magenta
         $global:userId = 2
    }
}

Test-Endpoint "3. Link GitHub Account" {
    # Using mock code abc123xyz
    $headers = @{ Authorization = "Bearer $global:token" }
    $res = Invoke-RestMethod -Uri "$baseUrl/api/github/link?userId=$global:userId&code=abc123xyz" -Method Post -Headers $headers
    Write-Host "GitHub Linked: $($res.githubUsername)"
}

Test-Endpoint "4. Verify Mission Generation" {
    Start-Sleep -Seconds 2 # Wait for async processing if any
    $headers = @{ Authorization = "Bearer $global:token" }
    $res = Invoke-RestMethod -Uri "$baseUrl/api/kodra/missions/$global:userId" -Method Get -Headers $headers
    
    $missions = $res.data
    if ($missions.Count -eq 0) { throw "No missions generated!" }
    Write-Host "Found $($missions.Count) missions."
    Write-Host "Mission 1: $($missions[0].title)"
    $global:missionId = $missions[0].id
}

Test-Endpoint "5. Start Mission" {
    $headers = @{ Authorization = "Bearer $global:token" }
    $res = Invoke-RestMethod -Uri "$baseUrl/api/kodra/missions/$global:missionId/start" -Method Post -Headers $headers
    Write-Host "Mission Started. Status: $($res.status)"
}

Test-Endpoint "6. Ask AI Assistant" {
    $headers = @{ Authorization = "Bearer $global:token" }
    $body = @{
        userId = $global:userId
        question = "teach me about environment variables"
        context = "Context from config.js..."
    }
    $res = Invoke-RestMethod -Uri "$baseUrl/api/kodra/assist" -Method Post -Body ($body | ConvertTo-Json) -ContentType "application/json" -Headers $headers
    Write-Host "AI Response: $($res.explanation)"
}

Test-Endpoint "7. Simulate GitHub Webhook (PR Created)" {
    # This might fail if WebhookController logic isn't fully implemented for PRs, but checking reachability
    $payload = @{
        action = "opened"
        pull_request = @{
            id = 123
            title = "[Kodra Mission 1] Remove hardcoded keys"
            user = @{ login = "alexchen" }
        }
    }
    # Webhook usually doesn't need auth token if public, or uses secret signature. Assuming public for dev.
    $res = Invoke-RestMethod -Uri "$baseUrl/api/webhooks/github" -Method Post -Body ($payload | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Webhook Response: $res"
}

Write-Host "`nALEX JOURNEY COMPLETE SUCCESS!" -ForegroundColor Green
