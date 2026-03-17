# AI 工具工坊 - 项目规格说明书

## 1. 项目概述

**项目名称**：AI 工具工坊 (AI Tools Workshop)
**项目类型**：Web 应用 - 需求众包 + 产品发布平台
**核心功能**：用户提交软件需求 → 投票排序 → AI 开发 → 上架售卖
**目标用户**：国内个人开发者、小商家、需要工具的普通用户

## 2. 技术栈

- **框架**：Next.js 14 (App Router)
- **样式**：Tailwind CSS v4
- **部署**：Vercel (免费) → 后续可迁移到香港服务器

## 3. 页面结构

### 3.1 首页 (/)
- 英雄区：标语 + CTA
- 热门需求排行榜（Top 10）
- 已发布产品展示区
- 快速提交需求入口

### 3.2 需求广场 (/requests)
- 需求列表（按投票排序）
- 搜索/筛选功能
- 提交新需求按钮

### 3.3 产品列表 (/products)
- 已开发完成的产品
- 分类筛选
- 价格/免费标签

### 3.4 提交需求 (/submit)
- 需求表单：标题、描述、预算（可选）
- 验证码防刷

### 3.5 产品详情 (/product/[id])
- 产品介绍
- 在线试用入口
- 购买/免费获取

## 4. 数据模型

### 4.1 需求 (Request)
```
- id: string
- title: string
- description: string
- votes: number
- status: 'pending' | 'developing' | 'completed'
- createdAt: timestamp
- budget: number? // 可选预算
```

### 4.2 产品 (Product)
```
- id: string
- title: string
- description: string
- price: number // 0 = 免费
- demoUrl: string?
- downloadUrl: string?
- thumbnail: string
- createdAt: timestamp
```

## 5. MVP 功能

1. ✅ 展示热门需求（静态数据）
2. ✅ 展示已发布产品（静态数据）
3. ✅ 提交需求表单
4. ✅ 简单的产品详情页

## 6. 视觉风格

- 简洁现代
- 蓝/紫渐变主色调
- 卡片式布局
- 响应式设计

## 7. 验收标准

- [ ] 首页正常加载
- [ ] 热门需求显示正确
- [ ] 产品列表正常展示
- [ ] 提交需求表单可提交
- [ ] 响应式布局正常
