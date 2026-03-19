# Test Report Generator - Simplified
# 从测试结果生成 Markdown 报告

param(
    [string]$ApiResultsFile = "api-test-results.json",
    [string]$OutputFile = ""
)

$Date = Get-Date -Format "yyyy-MM-dd"
$Time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

if (-not $OutputFile) {
    $OutputFile = "TEST_REPORT_$Date.md"
}

# 读取 API 测试结果
$apiResults = @()
if (Test-Path $ApiResultsFile) {
    $json = Get-Content $ApiResultsFile -Raw | ConvertFrom-Json
    if ($json -is [System.Array]) {
        $apiResults = $json
    } else {
        $apiResults = @($json)
    }
}

# 计算统计
$total = $apiResults.Count
$passed = ($apiResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($apiResults | Where-Object { $_.Status -eq "FAIL" }).Count
$passRate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 1) } else { 0 }

# 生成报告内容
$reportContent = @"
# 测试报告

**项目**: AI Tools Workshop (MoClawny)
**测试日期**: $Date
**测试类型**: API 测试 + E2E 测试

---

## 测试摘要

| 类型 | 通过 | 失败 | 总数 | 通过率 |
|------|------|------|------|--------|
| API 测试 | $passed | $failed | $total | $passRate% |

---

## API 测试结果

### 端点测试

| # | 端点 | 方法 | 状态 | 状态码 | 耗时 |
|---|------|------|------|--------|------|
"@

$i = 1
foreach ($result in $apiResults) {
    $statusText = if ($result.Status -eq "PASS") { "PASS" } else { "FAIL" }
    $reportContent += "`n| $i | $($result.Endpoint) | $($result.Method) | $statusText | $($result.StatusCode) | $($result.Duration)ms |"
    
    if ($result.Status -eq "FAIL") {
        $reportContent += "`n|> **失败详情**: $($result.Error)"
    }
    $i++
}

$reportContent += @"

---

## 测试日志

```
测试开始时间: $Time
测试环境: http://localhost:3000
```

---

## 结论

- API 测试通过率: $passRate%
- 失败测试数: $failed

---

*报告生成时间: $Time*
*使用 MoClawny Project Tester 生成*
"@

# 写入文件
$reportContent | Out-File -FilePath $OutputFile -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Report Generated!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Report file: $OutputFile" -ForegroundColor Yellow
Write-Host "API Pass Rate: $passRate% ($passed/$total)" -ForegroundColor Green
Write-Host ""
