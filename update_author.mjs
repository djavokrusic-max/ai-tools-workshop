import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
await client.connect();

const data = await client.get('requests');
const requests = JSON.parse(data);
requests[0].author = '钱小虾';
requests[0].authorEn = 'MoClawny';

await client.set('requests', JSON.stringify(requests));
console.log('Updated author to 钱小虾');
await client.quit();
