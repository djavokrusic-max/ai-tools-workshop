import Link from "next/link";
import { getProducts } from "@/lib/data";

async function getData() {
  return await getProducts();
}

export default async function ProductsPage() {
  const products = await getData();

  const categories = [...new Set(products.map((p: any) => p.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">✨ 产品中心</h1>
        <p className="text-gray-600">免费 + 付费，总有一款适合你</p>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
          全部
        </button>
        {categories.map((category: any) => (
          <button key={category} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200">
            {category}
          </button>
        ))}
      </div>

      {/* 产品列表 - 真实数据 */}
      {products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Link 
              href={`/product/${product.id}`}
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover block"
            >
              <div className="h-36 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center text-5xl">
                {product.icon}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-bold ${product.price === 0 ? 'text-green-600' : 'text-purple-600'}`}>
                    {product.price === 0 ? '免费' : `¥${product.price}`}
                  </span>
                  <span className="text-gray-400 text-sm">📥 {product.downloads}</span>
                </div>
                <div className="w-full mt-4 py-2 bg-gray-900 text-white rounded-xl font-medium text-center">
                  {product.price === 0 ? '立即获取' : '立即购买'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛠️</div>
          <h2 className="text-xl font-semibold mb-2">暂无产品</h2>
          <p className="text-gray-500">敬请期待...</p>
        </div>
      )}
    </div>
  );
}
