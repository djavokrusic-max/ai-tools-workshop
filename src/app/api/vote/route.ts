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

// 投票
export async function POST(request: NextRequest) {
  try {
    await ensureClient();
    
    const body = await request.json();
    const { requestId, username } = body;
    
    if (!requestId) {
      return NextResponse.json({ success: false, message: '缺少需求ID' });
    }
    
    // 检查用户是否已投票
    const votersKey = `request:${requestId}:voters`;
    const hasVoted = await client.sIsMember(votersKey, username || 'anonymous');
    
    if (hasVoted) {
      await client.quit();
      return NextResponse.json({ success: false, message: '你已经投过票了' });
    }
    
    // 记录投票
    await client.sAdd(votersKey, username || 'anonymous');
    
    const requestsData = await client.get('requests');
    const requests = requestsData ? JSON.parse(requestsData) : [];
    
    const requestIndex = requests.findIndex((r: any) => r.id === requestId);
    if (requestIndex === -1) {
      return NextResponse.json({ success: false, message: '需求不存在' });
    }
    
    requests[requestIndex].votes = (requests[requestIndex].votes || 0) + 1;
    await client.set('requests', JSON.stringify(requests));
    
    await client.quit();
    
    return Response.json({ success: true, votes: requests[requestIndex].votes });
  } catch (error) {
    return Response.json({ success: false, message: String(error) });
  }
}
