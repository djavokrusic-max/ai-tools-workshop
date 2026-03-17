import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function addProducts() {
  await client.connect();
  
  const products = [
    { 
      id: "1", 
      title: "AI 文章润色助手", 
      description: "一键润色你的文章，语法检查、内容优化、风格调整。支持多种文体，实时检查语法错误，提供改写建议。",
      price: 0, 
      downloads: 1234, 
      category: "写作", 
      icon: "✍️",
      status: "completed"
    },
    { 
      id: "2", 
      title: "短视频文案生成器", 
      description: "AI 生成爆款短视频文案，支持抖音、快手、视频号多平台。输入关键词自动生成吸睛文案。",
      price: 9.9, 
      downloads: 567, 
      category: "内容创作", 
      icon: "🎬",
      status: "completed"
    },
    { 
      id: "3", 
      title: "小红书封面生成器", 
      description: "快速生成精美封面，多种风格可选。支持自定义文字、贴纸、滤镜等功能。",
      price: 0, 
      downloads: 2341, 
      category: "设计", 
      icon: "🎨",
      status: "completed"
    },
    {
      id: "4",
      title: "微信群发助手",
      description: "批量群发消息、群管理、自动化客服。提高运营效率，支持定时发送。",
      price: 19.9,
      downloads: 89,
      category: "工具",
      icon: "💬",
      status: "developing"
    }
  ];
  
  await client.set('products', JSON.stringify(products));
  
  console.log('✅ 产品已添加！');
  
  await client.quit();
}

addProducts();
