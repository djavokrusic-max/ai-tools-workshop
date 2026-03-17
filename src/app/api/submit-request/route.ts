import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

export async function POST(request: Request) {
  await client.connect();
  
  const body = await request.json();
  const { title, description, budget } = body;
  
  if (!title || !description) {
    return Response.json({ success: false, message: '请填写标题和描述' });
  }
  
  // 获取现有需求
  const requestsData = await client.get('requests');
  const requests = requestsData ? JSON.parse(requestsData) : [];
  
  // 添加新需求
  const newRequest = {
    id: String(Date.now()),
    title,
    description,
    budget: budget ? parseInt(budget) : 0,
    votes: 0,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  requests.push(newRequest);
  await client.set('requests', JSON.stringify(requests));
  
  await client.quit();
  
  return Response.json({ success: true, message: '提交成功', request: newRequest });
}
