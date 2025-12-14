
# verify_integration.ps1
$baseUrl = "http://localhost:8080/api"
$pythonUrl = "http://localhost:5000"

function Test-Endpoint($url, $method = "GET", $body = $null, $headers = @{}) {
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            ErrorAction = "Stop"
            ContentType = "application/json"
        }
        if ($body) { $params.Body = ($body | ConvertTo-Json -Depth 10) }
        
        $response = Invoke-RestMethod @params
        Write-Host "[SUCCESS] $method $url" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "[FAIL] $method $url : $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host "Response Body: $($reader.ReadToEnd())" -ForegroundColor Yellow
        }
        return $null
    }
}

Write-Host "--- 1. Check Python Service Health Direct ---"
Test-Endpoint "$pythonUrl/health"

Write-Host "`n--- 2. Check Backend Health (and its connection to AI) ---"
$health = Test-Endpoint "$baseUrl/chat/health"
if ($health) { Write-Host "Backend Health: $($health | ConvertTo-Json)" }

Write-Host "`n--- 3. Login/Register to get Token ---"
$suffix = Get-Random -Minimum 1000 -Maximum 9999
$registerUser = @{
    username = "integrationUser$suffix"
    email = "integration$suffix@test.com"
    password = "password123"
}

$loginUser = @{
    email = $registerUser.email
    password = $registerUser.password
}

try {
    # Always register first to ensure clean state with email
    $regRes = Test-Endpoint "$baseUrl/auth/register" "POST" $registerUser
    
    # Login with specific payload (no username field)
    $loginRes = Test-Endpoint "$baseUrl/auth/login" "POST" $loginUser
} catch {
    Write-Host "Auth flow failed."
}

if ($loginRes) {
    $token = $loginRes.data.token
    $headers = @{ Authorization = "Bearer $token" }
    Write-Host "Got Token: $token"

    Write-Host "`n--- 4. Test Chat Integration ---"
    $chatBody = @{ message = "I need help with Java arrays." }
    $chatRes = Test-Endpoint "$baseUrl/chat/message" "POST" $chatBody $headers
    if ($chatRes) { Write-Host "Chat Response: $($chatRes.data.response)" }

    Write-Host "`n--- 5. Test Assist Integration ---"
    $assistBody = @{
        question = "How do I sort a list?"
        context = @{
             fileContent = "List<String> names = new ArrayList<>();"
             programmingLanguage = "java"
        }
    }
    # Note: AssistController mapped to /kodra/assist in previous fixes, but let's check exact path
    # Task says "Fix Controller Mappings (KodraMission, Assist, Webhook)" -> /kodra/assist
    # So full url is /api/kodra/assist
    $assistRes = Test-Endpoint "$baseUrl/kodra/assist" "POST" $assistBody $headers
    if ($assistRes) { Write-Host "Assist Response: $($assistRes | ConvertTo-Json -Depth 5)" }

} else {
    Write-Host "Authentication failed, skipping authenticated tests." -ForegroundColor Red
}
