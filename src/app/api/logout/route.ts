import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: '已退出' });
  
  // 清除 cookie
  response.cookies.set('user', '', {
    httpOnly: false,
    maxAge: 0,
    path: '/',
  });
  
  return response;
}
