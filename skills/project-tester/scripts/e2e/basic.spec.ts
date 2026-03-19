// E2E Test Suite for AI Tools Workshop
// 使用方法: npx playwright test e2e/basic.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('AI Tools Workshop - 基础E2E测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('首页加载正常', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 检查页面标题存在
    await expect(page).toHaveTitle(/.*/);
    
    // 检查主导航存在
    await expect(page.locator('nav')).toBeVisible();
  });

  test('导航到产品中心', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 点击产品中心链接
    await page.click('text=产品中心');
    
    // 验证URL变化
    await expect(page).toHaveURL(/.*products.*/);
    
    // 验证产品列表标题
    await expect(page.locator('h1')).toContainText('产品');
  });

  test('导航到需求论坛', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 点击需求论坛链接
    await page.click('text=需求论坛');
    
    // 验证URL
    await expect(page).toHaveURL(/.*forum.*/);
  });

  test('PPT工具页面加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/ppt`);
    
    // 检查页面标题
    await expect(page.locator('h1')).toContainText('PPT');
    
    // 检查输入框存在
    await expect(page.locator('textarea')).toBeVisible();
    
    // 检查页数选择按钮
    await expect(page.locator('button:has-text("5页")')).toBeVisible();
    
    // 检查风格选择按钮
    await expect(page.locator('button:has-text("简约")')).toBeVisible();
  });

  test('登录页面加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    
    // 检查登录表单存在
    await expect(page.locator('form, input[type="text"], input[type="email"]')).toBeVisible();
  });

  test('Footer和版权信息', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // 检查Footer存在
    await expect(page.locator('footer, [class*="footer"]')).toBeVisible();
  });

});

test.describe('PPT工具功能测试', () => {
  
  test('显示剩余次数', async ({ page }) => {
    await page.goto(`${BASE_URL}/ppt`);
    
    // 检查剩余次数显示
    const remainingText = page.locator('text=/剩余.*次数/');
    await expect(remainingText).toBeVisible();
  });

  test('页数选择按钮可点击', async ({ page }) => {
    await page.goto(`${BASE_URL}/ppt`);
    
    // 点击10页按钮
    await page.click('button:has-text("10页")');
    
    // 验证按钮被选中（可能有样式变化）
    const button = page.locator('button:has-text("10页")');
    await expect(button).toBeVisible();
  });

  test('风格选择按钮可点击', async ({ page }) => {
    await page.goto(`${BASE_URL}/ppt`);
    
    // 点击商务风格
    await page.click('button:has-text("商务")');
    
    // 验证按钮存在
    const button = page.locator('button:has-text("商务")');
    await expect(button).toBeVisible();
  });

  test('生成按钮存在', async ({ page }) => {
    await page.goto(`${BASE_URL}/ppt`);
    
    // 检查生成按钮
    const generateButton = page.locator('button:has-text("生成PPT")');
    await expect(generateButton).toBeVisible();
  });

});

test.describe('响应式设计测试', () => {
  
  test('移动端视图', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    
    // 页面应该正常加载
    await expect(page).toHaveTitle(/.*/);
  });

});
