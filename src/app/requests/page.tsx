import Link from "next/link";
import { getRequests } from "@/lib/data";

// 服务器端渲染获取真实数据
async function getData() {
  const allRequests = await getRequests();
  // 按票数排序
  const sortedRequests = allRequests.sort((a: any, b: any) => b.votes - a.votes);
  return { requests: sortedRequests };
}

export default async function RequestsPage() {
  const { requests } = await getData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">📋 需求广场</h1>
        <Link href="/submit" className="btn-primary">
          + 发布需求
        </Link>
      </div>

      {/* 论坛风格列表 */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-6xl mb-4">💡</div>
            <h2 className="text-xl font-semibold mb-2">暂无需求</h2>
            <p className="text-gray-500 mb-6">快来发布第一个需求吧！</p>
            <Link href="/submit" className="btn-primary">
              发布需求
            </Link>
          </div>
        ) : (
          requests.map((request: any) => (
            <Link 
              href={`/request/${request.id}`}
              key={request.id}
              className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-purple-200 transition-all card-hover"
            >
              <div className="flex items-start gap-4">
                {/* 投票区域 */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <button className="text-gray-400 hover:text-purple-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="text-lg font-bold text-purple-600">{request.votes}</span>
                </div>
                
                {/* 内容区域 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{request.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      request.status === 'completed' ? 'bg-green-100 text-green-600' :
                      request.status === 'developing' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {request.status === 'completed' ? '✅ 完成' :
                       request.status === 'developing' ? '🔄 开发中' : '⏳ 待开发'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2">{request.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>🕐 {request.createdAt}</span>
                    <span>💬 0 条评论</span>
                    {request.budget > 0 && <span>💰 预算 ¥{request.budget}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
