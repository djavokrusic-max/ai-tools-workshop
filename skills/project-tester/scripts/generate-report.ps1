# Test Report Generator
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

# 生成报告
$report = @"
# 测试报告

**项目**: AI Tools Workshop (MoClawny)
**测试日期**: $Date
**测试类型**: API 测试 + E2E 测试

---

## 📊 测试摘要

| 类型 | 通过 | 失败 | 总数 | 通过率 |
|------|------|------|------|--------|
| API 测试 | $passed | $failed | $total | $passRate% |

---

## 🔵 API 测试结果

"@

if ($apiResults.Count -gt 0) {
    $report += @"

### 端点测试

| # | 端点 | 方法 | 状态 | 状态码 | 耗时 |
|---|------|------|------|--------|------|
"@
    
    $i = 1
    foreach ($result in $apiResults) {
        $statusIcon = if ($result.Status -eq "PASS") { "✅ PASS" } else { "❌ FAIL" }
        $report += @"
| $i | $($result.Endpoint) | $($result.Method) | $statusIcon | $($result.StatusCode) | $($result.Duration)ms |
"@
        
        if ($result.Status -eq "FAIL") {
            $report += @"

> **失败详情**: $($result.Name)
> 错误信息: $($result.Error)

"@
        }
        
        $i++
    }
} else {
    $report += @"

*暂无 API 测试数据*
"@
}

$report += @"

---

## 📝 测试日志

```
测试开始时间: $Time
测试环境: http://localhost:3000
```

"@

# E2E 测试结果占位符
$report += @"

## 🟢 E2E 测试结果

*E2E 测试结果需要手动运行 Playwright 后添加*

运行命令:
```bash
npx playwright test --reporter=line
```

"@

# 结论
$report += @"

---

## 🎯 结论与建议

### 测试通过项
"@

if ($passed -eq $total) {
    $report += @"
- ✅ 所有 API 端点响应正常 ($total/$total)
"@
} else {
    $report += @"
- ⚠️ 部分 API 端点存在问题 ($passed/$total 通过)
"@
}

$report += @"

### 需要修复的问题
"@

if ($failed -gt 0) {
    foreach ($result in $apiResults) {
        if ($result.Status -eq "FAIL") {
            $report += @"
- ❌ $($result.Name): $($result.Error)
"@
        }
    }
} else {
    $report += @"
- 无
"@
}

$report += @"

### 优化建议
1. 定期运行测试确保功能稳定
2. 添加更多边界条件测试
3. 考虑添加性能测试

---

## 📚 相关资源

- [Playwright 文档](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

*报告生成时间: $Time*
*使用 MoClawny Project Tester 生成 🦞*
"@

# 写入文件
$report | Out-File -FilePath $OutputFile -Encoding UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  测试报告已生成!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "报告文件: $OutputFile" -ForegroundColor Yellow
Write-Host "API通过率: $passRate% ($passed/$total)" -ForegroundColor $(if ($passRate -ge 80) { "Green" } else { "Yellow" })
Write-Host ""

# 打开报告文件
if (Test-Path $OutputFile) {
    Write-Host "是否打开报告? (Y/N)" -ForegroundColor Cyan
}
