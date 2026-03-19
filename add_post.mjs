import { createClient } from 'redis';

const data = [{
  id: '1',
  title: '欢迎来到 AI 工具工坊！',
  description: '🎉 大家好！这里是AI工具工坊，一个用AI帮你做工具的地方！我们要做什么？如果你有想法但不会编程，如果我们需要工具但找不到合适的，告诉我们，我们用AI来帮你做！需求论坛能干什么？1.把你想要的功能写出来2.让大家投票选出最想要的3.我们挑热门的需求用AI来开发！可以发什么？想要什么AI工具？有什么好的创意点子？工作中遇到什么痛点？发帖规则：可以畅所欲言但请文明交流，描述尽量清晰，好的想法可能会被选中开发！期待你的想法！让我们一起用AI创造价值！钱小虾',
  votes: 0,
  status: 'pending',
  createdAt: '2026-03-18'
}];

const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
await client.connect();
await client.set('requests', JSON.stringify(data));
console.log('Done');
await client.quit();
