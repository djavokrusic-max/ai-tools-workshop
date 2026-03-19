# API Test Script for AI Tools Workshop
# 使用方法: powershell -File test-api.ps1 [-BaseUrl <url>]

param(
    [string]$BaseUrl = "http://localhost:3000"
)

$Report = @()
$StartTime = Get-Date

function Test-API {
    param(
        [string]$Name,
        [string]$Method = "GET",
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$ExpectedStatus = "2*"
    )
    
    $url = "$BaseUrl$Endpoint"
    $result = @{
        Name = $Name
        Method = $Method
        Endpoint = $Endpoint
        Status = "PENDING"
        StatusCode = 0
        Response = ""
        Duration = 0
        Error = ""
    }
    
    $testStart = Get-Date
    
    try {
        if ($Method -eq "GET") {
            $resp = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 30 -ErrorAction Stop
            $result.StatusCode = 200
            $result.Response = $resp | ConvertTo-Json -Depth 5
            $result.Status = "PASS"
        } elseif ($Method -eq "POST") {
            $bodyJson = $Body | ConvertTo-Json -Compress
            $resp = Invoke-RestMethod -Uri $url -Method POST -Body $bodyJson -ContentType "application/json" -TimeoutSec 30 -ErrorAction Stop
            $result.StatusCode = 200
            $result.Response = $resp | ConvertTo-Json -Depth 5
            $result.Status = "PASS"
        }
    } catch {
        $result.Status = "FAIL"
        $result.Error = $_.Exception.Message
        if ($_.Exception.Response) {
            $result.StatusCode = [int]$_.Exception.Response.StatusCode
        }
    }
    
    $result.Duration = [math]::Round(((Get-Date) - $testStart).TotalMilliseconds, 2)
    return $result
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Tools Workshop - API Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "Started: $StartTime" -ForegroundColor Gray
Write-Host ""

# Test Cases
Write-Host "[1/6] Testing GET /api/ppt (health check)..." -ForegroundColor Yellow
$Report += Test-API -Name "GET /api/ppt (获取剩余次数)" -Method GET -Endpoint "/api/ppt"

Write-Host "[2/6] Testing GET /products..." -ForegroundColor Yellow
$Report += Test-API -Name "GET /products (产品列表)" -Method GET -Endpoint "/products"

Write-Host "[3/6] Testing GET /forum (需求列表)..." -ForegroundColor Yellow
$Report += Test-API -Name "GET /forum (需求论坛)" -Method GET -Endpoint "/forum"

Write-Host "[4/6] Testing GET /auth (登录页)..." -ForegroundColor Yellow
$Report += Test-API -Name "GET /auth (认证页)" -Method GET -Endpoint "/auth"

Write-Host "[5/6] Testing GET /ppt (PPT工具页)..." -ForegroundColor Yellow
$Report += Test-API -Name "GET /ppt (PPT工具)" -Method GET -Endpoint "/ppt"

Write-Host "[6/6] Testing GET /submit (发布需求页)..." -ForegroundColor Yellow
$Report += Test-API -Name "GET /submit (发布需求)" -Method GET -Endpoint "/submit"

# Calculate summary
$total = $Report.Count
$passed = ($Report | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($Report | Where-Object { $_.Status -eq "FAIL" }).Count
$passRate = [math]::Round(($passed / $total) * 100, 1)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total:  $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Rate:   $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } else { "Yellow" })
Write-Host ""

# Output detailed results
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Detailed Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$Report | ForEach-Object {
    $statusColor = if ($_.Status -eq "PASS") { "Green" } else { "Red" }
    $statusIcon = if ($_.Status -eq "PASS") { "✅" } else { "❌" }
    
    Write-Host ""
    Write-Host "$statusIcon $($_.Name)" -ForegroundColor $statusColor
    Write-Host "   $($_.Method) $($_.Endpoint)" -ForegroundColor Gray
    Write-Host "   Status: $($_.Status) ($($_.StatusCode)) | Duration: $($_.Duration)ms" -ForegroundColor $(if ($_.Status -eq "PASS") { "Green" } else { "Red" })
    
    if ($_.Status -eq "FAIL") {
        Write-Host "   Error: $($_.Error)" -ForegroundColor Red
    }
}

# Save to JSON for report generation
$ReportFile = "api-test-results.json"
$Report | ConvertTo-Json -Depth 10 | Out-File -FilePath $ReportFile -Encoding UTF8
Write-Host ""
Write-Host "Results saved to: $ReportFile" -ForegroundColor Gray

# Return exit code based on test results
if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
