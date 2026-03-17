import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function clearAndSetup() {
  await client.connect();
  
  // 清除所有数据，设置为空数组
  await client.set('requests', '[]');
  await client.set('products', '[]');
  
  console.log('✅ 数据已清空！');
  
  await client.quit();
}

clearAndSetup();
