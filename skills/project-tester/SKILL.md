---
name: project-tester
description: 自动测试项目技能。对项目进行 API 测试和端到端(E2E)测试，生成测试报告。当用户说"测试项目"、"测试API"、"运行测试"、"test project"、"测试一下"或需要对一个网站/API项目进行自动化测试时触发。
version: 1.0.0
---

# Project Tester - 自动测试技能

对项目进行全面的 API 测试和 E2E 测试，生成结构化测试报告。

## 功能概述

1. **API 测试** - 使用 curl/PowerShell 测试 REST API 端点
2. **E2E 测试** - 使用 Playwright 进行浏览器端到端测试
3. **测试报告** - 生成 Markdown 格式的测试结果报告

## 测试流程

```
STEP 1: 分析项目结构
   ↓
STEP 2: 运行 API 测试
   ↓
STEP 3: 运行 E2E 测试
   ↓
STEP 4: 生成测试报告
```

## 使用方法

### 触发词

- "测试项目"
- "测试API"
- "运行测试"
- "test project"
- "帮我测试一下"
- "测试某某功能"

### 输入

用户需要提供：
- 项目本地路径或远程地址
- 测试类型（API/E2E/全部）
- 重点测试的端点或页面（可选）

### 输出

生成 `TEST_REPORT_YYYY-MM-DD.md` 测试报告文件

---

## Step 1: 分析项目结构

首先检查项目类型和可用脚本：

```bash
# 检查项目结构
ls -la <项目路径>
cat <项目路径>/package.json

# 检查已有的测试脚本
ls -la <项目路径>/tests/ 2>/dev/null || echo "No tests dir"
ls -la <项目路径>/__tests__/ 2>/dev/null || echo "No __tests__ dir"
```

识别项目类型：
- **Next.js** - package.json 中有 next, @playwright/test
- **Node.js API** - 纯后端 API 项目
- **混合项目** - 前端 Next.js + 后端 API

---

## Step 2: API 测试

### 2.1 确定测试端点

从项目代码中提取 API 路由：

```bash
# Next.js API routes
grep -r "export async function" <项目路径>/src/app/api/ --include="*.ts" | head -20

# 或者直接查看 api 目录
ls -la <项目路径>/src/app/api/*/
```

### 2.2 API 测试脚本

创建测试脚本 `scripts/test-api.ps1`：

```powershell
# API 测试配置
$BASE_URL = "http://localhost:3000"  # 或用户指定的地址
$REPORT = @()

# 测试函数
function Test-API {
    param($Name, $Method, $Endpoint, $Body, $Expected)
    
    $url = "$BASE_URL$Endpoint"
    $result = @{
        Name = $Name
        Method = $Method
        Endpoint = $Endpoint
        Status = "PENDING"
        Response = ""
        Duration = 0
    }
    
    $start = Get-Date
    
    try {
        if ($Method -eq "GET") {
            $resp = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 10
        } elseif ($Method -eq "POST") {
            $bodyJson = $Body | ConvertTo-Json
            $resp = Invoke-RestMethod -Uri $url -Method POST -Body $bodyJson -ContentType "application/json" -TimeoutSec 10
        }
        
        $result.Status = "PASS"
        $result.Response = $resp | ConvertTo-Json
    } catch {
        $result.Status = "FAIL"
        $result.Response = $_.Exception.Message
    }
    
    $result.Duration = ((Get-Date) - $start).TotalMilliseconds
    $REPORT += $result
}

# 执行测试
Test-API -Name "GET /api/health" -Method GET -Endpoint "/api/health"
Test-API -Name "GET /api/ppt (未登录)" -Method GET -Endpoint "/api/ppt"

# 输出报告
$REPORT | ConvertTo-Json -Depth 10
```

### 2.3 执行 API 测试

```bash
cd <项目路径>
powershell -File scripts/test-api.ps1
```

---

## Step 3: E2E 测试 (Playwright)

### 3.1 检查 Playwright 配置

```bash
# 检查是否已安装 Playwright
cat <项目路径>/package.json | grep -i playwright

# 检查配置文件
cat <项目路径>/playwright.config.ts 2>/dev/null || echo "No playwright.config.ts"
```

### 3.2 创建 E2E 测试文件

如果项目还没有 E2E 测试，创建基础测试文件：

```typescript
// e2e/basic.spec.ts
import { test, expect } from '@playwright/test';

test.describe('基础功能测试', () => {
  test('首页加载正常', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/);
  });
  
  test('导航链接可用', async ({ page }) => {
    await page.goto('/');
    await page.click('text=产品中心');
    await expect(page).toHaveURL(/.*products.*/);
  });
});
```

### 3.3 运行 E2E 测试

```bash
cd <项目路径>

# 确保开发服务器运行
npm run dev &
sleep 5

# 运行 Playwright 测试
npx playwright test --reporter=line

# 或者只运行特定测试
npx playwright test e2e/basic.spec.ts --reporter=line
```

---

## Step 4: 生成测试报告

### 4.1 报告模板

```markdown
# 测试报告

**项目**: <项目名称>
**测试日期**: <日期>
**测试环境**: <环境>

---

## 📊 测试摘要

| 类型 | 通过 | 失败 | 总数 | 通过率 |
|------|------|------|------|--------|
| API 测试 | X | Y | Z | XX% |
| E2E 测试 | X | Y | Z | XX% |

---

## 🔵 API 测试结果

### 端点测试

| # | 端点 | 方法 | 状态 | 耗时 |
|---|------|------|------|------|
| 1 | /api/health | GET | ✅ PASS | XXms |
| 2 | /api/ppt | GET | ✅ PASS | XXms |

### 失败详情 (如有)

[失败测试的详细错误信息]

---

## 🟢 E2E 测试结果

### 页面测试

| # | 测试用例 | 状态 | 耗时 |
|---|---------|------|------|
| 1 | 首页加载 | ✅ PASS | XXms |
| 2 | 导航链接 | ✅ PASS | XXms |

### 失败详情 (如有)

[失败测试的截图和错误信息]

---

## 📝 测试日志

```
[时间戳] API测试开始
[时间戳] GET /api/health - 200 OK (XXms)
[时间戳] E2E测试开始
[时间戳] 首页加载 - PASS (XXms)
```

---

## 🎯 结论与建议

### 测试通过项
- [x] API 端点正常响应
- [x] 页面加载正常

### 需要修复的问题
- [ ] 问题描述

### 优化建议
- 建议1
- 建议2

---

*报告生成时间: <时间戳>*
*使用 MoClawny Project Tester 生成 🦞*
```

### 4.2 生成报告

```bash
# 收集测试结果
cd <项目路径>

# 生成报告
REPORT_FILE="TEST_REPORT_$(date +%Y-%m-%d).md"

# 写入报告头
cat > $REPORT_FILE << 'EOF'
# 测试报告
EOF

# 追加 API 测试结果
cat api-test-results.json >> $REPORT_FILE

# 追加 E2E 测试结果
npx playwright test --reporter=json >> $REPORT_FILE

echo "报告已生成: $REPORT_FILE"
```

---

## 常见问题处理

### 问题 1: 开发服务器未启动

```bash
# 启动开发服务器
cd <项目路径>
npm run dev

# 等待服务就绪
sleep 10
```

### 问题 2: Playwright 未安装

```bash
# 安装 Playwright
cd <项目路径>
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

### 问题 3: Redis 连接失败

```bash
# 启动 Redis (Docker)
docker run -d --name redis-test -p 6379:6379 redis:latest

# 或检查现有 Redis
docker ps | grep redis
```

---

## 高级用法

### 只测试特定端点

用户可以说："只测试 /api/ppt 端点"

```bash
# 修改测试脚本，只测试指定端点
powershell -Command "
$endpoint = '/api/ppt'
Test-API -Name \"Custom Test\" -Method GET -Endpoint $endpoint
"
```

### 测试生产环境

用户可以说："测试生产环境 http://example.com"

```bash
BASE_URL="http://121.196.162.224:3000" powershell -File scripts/test-api.ps1
```

### 生成 HTML 报告

```bash
# 使用 Playwright HTML 报告
npx playwright test --reporter=html
# 报告位置: playwright-report/index.html
```

---

## 注意事项

1. **测试前确保依赖安装完整** - `npm install`
2. **测试端口不要冲突** - 确保 3000 端口未被占用
3. **生产环境测试需谨慎** - 避免在生产环境执行删除操作
4. **敏感信息保护** - 不要在测试报告中包含密码或密钥
