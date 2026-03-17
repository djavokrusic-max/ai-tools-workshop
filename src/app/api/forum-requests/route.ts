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

// 获取论坛需求列表
export async function GET() {
  try {
    await ensureClient();
    
    const requestsData = await client.get('requests');
    const requests = requestsData ? JSON.parse(requestsData) : [];
    
    await client.quit();
    
    return Response.json({ success: true, requests });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, requests: [], error: String(error) });
  }
}
