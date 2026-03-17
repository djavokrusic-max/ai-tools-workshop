import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function ensureClient() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// 获取需求详情
export async function GET(req: Request) {
  try {
    await ensureClient();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ success: false, message: '缺少需求ID' });
    }
    
    const requestsData = await client.get('requests');
    const requests = requestsData ? JSON.parse(requestsData) : [];
    
    const foundRequest = requests.find((r: any) => r.id === id);
    
    await client.quit();
    
    if (!foundRequest) {
      return Response.json({ success: false, message: '需求不存在' });
    }
    
    return Response.json({ success: true, request: foundRequest });
  } catch (error) {
    return Response.json({ success: false, message: String(error) });
  }
}
