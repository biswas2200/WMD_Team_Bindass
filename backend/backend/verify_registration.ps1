$base = "http://localhost:8080/api"
$email = "test_verify_$(Get-Date -Format 'HHmmss')@example.com"
$body = @{
    email = $email
    password = "Password123!"
    name = "Verify User"
    phone = "9999999999"
    age = 25
    location = "Test City"
    education = "B.Tech"
    interests = "Testing"
} | ConvertTo-Json

Write-Host "Registering $email..."
try {
    $r = Invoke-RestMethod -Method Post -Uri "$base/auth/register" -Body $body -ContentType "application/json"
    Write-Host "Success! Response:"
    $r | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
