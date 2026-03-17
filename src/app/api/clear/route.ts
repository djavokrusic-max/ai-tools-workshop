import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

export async function POST() {
  await client.connect();
  
  // 清除所有数据
  await client.set('requests', '[]');
  await client.set('products', '[]');
  
  await client.quit();
  
  return Response.json({ success: true, message: '数据已清空' });
}
