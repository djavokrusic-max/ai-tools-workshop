import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

export async function POST() {
  await client.connect();
  
  // 清除所有数据，只保留用户
  await client.del('requests');
  await client.del('comments');
  await client.del('products');
  
  await client.quit();
  
  return Response.json({ success: true, message: '已清除所有需求、评论和产品数据，保留用户数据' });
}
