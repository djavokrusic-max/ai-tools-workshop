'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Request {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
  createdAt: string;
}

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState('latest');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 API 获取需求数据
    fetch('/api/forum-requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [activeTab]);

  // 按不同方式排序
  const sortedRequests = [...requests].sort((a, b) => {
    if (activeTab === 'hot') return b.votes - a.votes;
    if (activeTab === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.votes - a.votes;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 论坛头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">💬 需求论坛</h1>
        <Link href="/submit" className="btn-primary">
          + 发布需求
        </Link>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('latest')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'latest' 
              ? 'bg-purple-100 text-purple-600' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          🕐 最新
        </button>
        <button
          onClick={() => setActiveTab('hot')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'hot' 
              ? 'bg-purple-100 text-purple-600' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          🔥 最热
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'following' 
              ? 'bg-purple-100 text-purple-600' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          👀 关注
        </button>
      </div>

      {/* 帖子列表 */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : sortedRequests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-xl font-semibold mb-2">暂无需求</h2>
          <p className="text-gray-500 mb-6">快来发布第一个需求吧！</p>
          <Link href="/submit" className="btn-primary">
            发布需求
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRequests.map((request) => (
            <Link 
              href={`/request/${request.id}`}
              key={request.id}
              className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* 头像 */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  {request.title.charAt(0)}
                </div>
                
                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">钱小虾</span>
                    <span className="text-gray-400 text-sm">· {request.createdAt}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 hover:text-purple-600">
                    {request.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {request.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <button 
                      className="flex items-center gap-1 hover:text-purple-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: 点赞功能
                        alert('点赞功能待实现');
                      }}
                    >
                      <span>👍</span>
                      <span>{request.votes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <span>💬</span>
                      <span>0</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🔖</span>
                      <span>收藏</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📤</span>
                      <span>分享</span>
                    </span>
                  </div>
                </div>
                
                {/* 状态标签 */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'completed' ? 'bg-green-100 text-green-600' :
                    request.status === 'developing' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {request.status === 'completed' ? '✅ 完成' :
                     request.status === 'developing' ? '🔄 开发中' : '⏳ 待开发'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 分页 */}
      {sortedRequests.length > 0 && (
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
            上一页
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
            2
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
            3
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
