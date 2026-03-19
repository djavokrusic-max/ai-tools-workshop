import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function ensureClient() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// 获取今日剩余次数
async function getRemainingGenerations(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const key = `ppt:daily:${userId}:${today}`;
  const count = await client.get(key);
  return Math.max(0, 3 - (parseInt(count || '0')));
}

// 增加生成计数
async function incrementGeneration(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const key = `ppt:daily:${userId}:${today}`;
  await client.incr(key);
  // 设置过期时间 24小时
  await client.expire(key, 86400);
}

// 生成 PPT
export async function POST(request: NextRequest) {
  try {
    await ensureClient();
    
    // 获取用户信息
    const userCookie = request.cookies.get('user');
    if (!userCookie) {
      return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 });
    }
    
    const user = JSON.parse(userCookie.value);
    const userId = user.id;
    
    // 检查每日次数
    const remaining = await getRemainingGenerations(userId);
    if (remaining <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: '今日生成次数已用完（每日3次）',
        remaining: 0 
      });
    }
    
    const body = await request.json();
    const { outline, pageCount = 5, style = '简约' } = body;
    
    if (!outline || outline.trim().length === 0) {
      return NextResponse.json({ success: false, message: '请输入PPT大纲' });
    }
    
    // 验证参数
    const validStyles = ['简约', '商务', '活泼'];
    const styleName = validStyles.includes(style) ? style : '简约';
    const pageNum = Math.min(20, Math.max(5, parseInt(pageCount) || 5));
    
    // 生成文件名
    const fileName = `ppt_${userId}_${Date.now()}.pptx`;
    const publicPath = path.join(process.cwd(), 'public', 'ppt', fileName);
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_ppt.py');
    
    // 确保目录存在
    const pptDir = path.join(process.cwd(), 'public', 'ppt');
    if (!fs.existsSync(pptDir)) {
      fs.mkdirSync(pptDir, { recursive: true });
    }
    
    // 调用 Python 脚本生成 PPT
    const pythonCmd = `python3 "${scriptPath}" "${outline.replace(/"/g, '\\"')}" ${pageNum} "${styleName}" "${publicPath}"`;
    
    let result;
    try {
      const { stdout, stderr } = await execAsync(pythonCmd, { timeout: 60000 });
      if (stderr && !stderr.includes('DeprecationWarning')) {
        console.error('Python stderr:', stderr);
      }
      result = stdout.trim();
    } catch (execError: any) {
      console.error('Exec error:', execError);
      return NextResponse.json({ 
        success: false, 
        message: '生成PPT失败: ' + (execError.message || '未知错误') 
      });
    }
    
    if (!result.startsWith('SUCCESS:')) {
      return NextResponse.json({ 
        success: false, 
        message: '生成PPT失败: ' + result 
      });
    }
    
    // 增加计数
    await incrementGeneration(userId);
    
    // 计算过期时间 (24小时后)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // 记录生成历史
    const historyKey = `ppt:history:${userId}`;
    const history = await client.lRange(historyKey, 0, -1);
    const historyArr = history.map(h => JSON.parse(h));
    historyArr.unshift({
      id: fileName,
      outline: outline.substring(0, 100),
      pageCount: pageNum,
      style: styleName,
      createdAt: new Date().toISOString(),
      expiresAt
    });
    // 只保留最近10条
    await client.lTrim(historyKey, 0, 9);
    for (const item of historyArr.slice(0, 10)) {
      await client.lPush(historyKey, JSON.stringify(item));
    }
    
    const newRemaining = await getRemainingGenerations(userId);
    
    await client.quit();
    
    return NextResponse.json({
      success: true,
      message: 'PPT生成成功',
      data: {
        fileName,
        downloadUrl: `/ppt/${fileName}`,
        expiresAt,
        remaining: newRemaining
      }
    });
    
  } catch (error: any) {
    console.error('PPT generation error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器错误: ' + (error.message || '未知错误')
    }, { status: 500 });
  }
}

// 获取剩余次数
export async function GET(request: NextRequest) {
  try {
    await ensureClient();
    
    const userCookie = request.cookies.get('user');
    if (!userCookie) {
      return NextResponse.json({ success: true, remaining: 3 });
    }
    
    const user = JSON.parse(userCookie.value);
    const remaining = await getRemainingGenerations(user.id);
    
    await client.quit();
    
    return NextResponse.json({ success: true, remaining });
  } catch (error) {
    console.error('Get remaining error:', error);
    return NextResponse.json({ success: true, remaining: 3 });
  }
}
