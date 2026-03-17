import { getProducts } from "@/lib/data";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p: any) => ({
    id: p.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p: any) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">产品不存在</h1>
        <a href="/products" className="text-purple-600 hover:underline mt-4 inline-block">
          返回产品中心
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <a href="/products" className="text-purple-600 hover:underline mb-6 inline-block">
        ← 返回产品中心
      </a>
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Header */}
        <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-7xl">
          {product.icon}
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              product.status === 'completed' ? 'bg-green-100 text-green-600' :
              product.status === 'developing' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {product.status === 'completed' ? '✅ 已完成' :
               product.status === 'developing' ? '🔄 开发中' : '⏳ 待开发'}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>
          
          <div className="flex items-center gap-6 mb-8">
            <span className={`text-2xl font-bold ${product.price === 0 ? 'text-green-600' : 'text-purple-600'}`}>
              {product.price === 0 ? '免费' : `¥${product.price}`}
            </span>
            <span className="text-gray-400">📥 {product.downloads} 次下载</span>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              {product.price === 0 ? '立即获取' : '立即购买'}
            </button>
            <button className="px-6 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              👍 点赞
            </button>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">💬 用户评论</h2>
        
        {/* Comment Form */}
        <form className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <textarea
            placeholder="写下你的评论..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none mb-4"
            rows={3}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            发表评论
          </button>
        </form>
        
        {/* Demo Comments */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">用户 A</span>
              <span className="text-gray-400 text-sm">2026-03-15</span>
            </div>
            <p className="text-gray-600">工具很好用，帮我节省了很多时间！</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">用户 B</span>
              <span className="text-gray-400 text-sm">2026-03-14</span>
            </div>
            <p className="text-gray-600">期待更多功能！</p>
          </div>
        </div>
      </div>
    </div>
  );
}
