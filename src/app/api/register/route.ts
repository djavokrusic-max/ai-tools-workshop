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

// 注册
export async function POST(request: NextRequest) {
  await ensureClient();
  
  const body = await request.json();
  const { username, password, email } = body;
  
  if (!username || !password) {
    return NextResponse.json({ success: false, message: '请填写用户名和密码' });
  }
  
  // 检查用户是否已存在
  const usersData = await client.get('users');
  const users = usersData ? JSON.parse(usersData) : [];
  
  const existingUser = users.find((u: any) => u.username === username);
  if (existingUser) {
    return NextResponse.json({ success: false, message: '用户名已存在' });
  }
  
  // 创建新用户
  const newUser = {
    id: String(Date.now()),
    username,
    email: email || '',
    password, // 实际应该加密
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  users.push(newUser);
  await client.set('users', JSON.stringify(users));
  
  await client.quit();
  
  // 返回用户信息（不返回密码）
  const { password: _, ...userWithoutPassword } = newUser;
  return NextResponse.json({ success: true, message: '注册成功', user: userWithoutPassword });
}
