import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function ensureClient() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// 登录
export async function POST(request: NextRequest) {
  await ensureClient();
  
  const body = await request.json();
  const { username, password } = body;
  
  if (!username || !password) {
    return NextResponse.json({ success: false, message: '请填写用户名和密码' });
  }
  
  // 查找用户
  const usersData = await client.get('users');
  const users = usersData ? JSON.parse(usersData) : [];
  
  const user = users.find((u: any) => u.username === username && u.password === password);
  
  if (!user) {
    return NextResponse.json({ success: false, message: '用户名或密码错误' });
  }
  
  await client.quit();
  
  // 返回用户信息（不返回密码）
  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json({ success: true, message: '登录成功', user: userWithoutPassword });
}
