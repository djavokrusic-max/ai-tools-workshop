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

// 发表评论
export async function POST(request: NextRequest) {
  try {
    await ensureClient();
    
    const body = await request.json();
    const { requestId, content, username } = body;
    
    if (!requestId || !content) {
      return NextResponse.json({ success: false, message: '缺少必要参数' });
    }
    
    // 获取评论列表
    const commentsData = await client.get('comments');
    const allComments = commentsData ? JSON.parse(commentsData) : [];
    
    // 添加新评论
    const newComment = {
      id: String(Date.now()),
      requestId,
      content,
      username: username || '匿名用户',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    allComments.push(newComment);
    await client.set('comments', JSON.stringify(allComments));
    
    await client.quit();
    
    return Response.json({ success: true, comment: newComment });
  } catch (error) {
    return Response.json({ success: false, message: String(error) });
  }
}

// 获取评论
export async function GET(request: NextRequest) {
  try {
    await ensureClient();
    
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    
    const commentsData = await client.get('comments');
    const allComments = commentsData ? JSON.parse(commentsData) : [];
    
    const comments = requestId 
      ? allComments.filter((c: any) => c.requestId === requestId)
      : allComments;
    
    await client.quit();
    
    return Response.json({ success: true, comments });
  } catch (error) {
    return Response.json({ success: false, comments: [], error: String(error) });
  }
}
