'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GenerationResult {
  fileName: string;
  downloadUrl: string;
  expiresAt: string;
  remaining: number;
}

export default function PPTPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [outline, setOutline] = useState('');
  const [pageCount, setPageCount] = useState(5);
  const [style, setStyle] = useState('简约');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(3);
  
  const styles = ['简约', '商务', '活泼'];
  const pageCounts = [5, 10, 15, 20];
  
  // 检查登录状态
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(c => c.trim().startsWith('user='));
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.value.split('=')[1]));
        setUser(userData);
      } catch (e) {
        console.error('Parse user error:', e);
      }
    }
  }, []);
  
  // 获取剩余次数
  useEffect(() => {
    if (user) {
      fetch('/api/ppt')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRemaining(data.remaining);
          }
        })
        .catch(console.error);
    }
  }, [user]);
  
  const handleGenerate = async () => {
    if (!user) {
      router.push('/login?redirect=/ppt');
      return;
    }
    
    if (!outline.trim()) {
      setError('请输入PPT大纲');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outline, pageCount, style })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        setRemaining(data.data.remaining);
      } else {
        setError(data.message || '生成失败');
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
      }
    } catch (e: any) {
      setError('网络错误: ' + (e.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (result?.downloadUrl) {
      window.open(result.downloadUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🦞</span>
            <span className="font-bold text-xl">MoClawny</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600">👤 {user.username}</span>
                <button 
                  onClick={() => {
                    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.reload();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  退出
                </button>
              </>
            ) : (
              <button 
                onClick={() => router.push('/login?redirect=/ppt')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 标题区 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">✨ MoClawny帮你做PPT</h1>
          <p className="text-gray-600 text-lg">输入大纲，AI帮你生成专业PPT · 每日免费3次</p>
        </div>
        
        {/* 剩余次数 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-medium">今日剩余生成次数</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remaining}
            </span>
            <span className="text-gray-500">/ 3</span>
          </div>
        </div>
        
        {/* 输入区 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">📝 输入PPT大纲</h2>
          <textarea
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
            placeholder={`请输入PPT的大纲内容，每行一个要点。例如：

封面：项目汇报
第一页：项目概述
- 项目背景
- 项目目标
第二页：项目进展
- 已完成功能
- 正在进行
第三页：未来计划
- 下一步工作
- 预期目标
结束页：感谢观看`}
            className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          
          {/* 页数选择 */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">📄 选择页数</h3>
            <div className="flex gap-3">
              {pageCounts.map(count => (
                <button
                  key={count}
                  onClick={() => setPageCount(count)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    pageCount === count 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count}页
                </button>
              ))}
            </div>
          </div>
          
          {/* 风格选择 */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">🎨 选择风格</h3>
            <div className="flex gap-3">
              {styles.map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    style === s 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl">
              {error}
            </div>
          )}
          
          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={loading || remaining <= 0}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
              loading || remaining <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {loading ? '🦞 AI正在生成中...' : remaining <= 0 ? '今日次数已用完' : '🚀 生成PPT'}
          </button>
        </div>
        
        {/* 结果区 */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-6">
              <span className="text-6xl">🎉</span>
              <h2 className="text-2xl font-bold mt-4">PPT生成成功！</h2>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-green-700">
                ✅ 文件已生成，下载链接有效期至 {new Date(result.expiresAt).toLocaleString('zh-CN')}
              </p>
              <p className="text-green-600 text-sm mt-2">
                今日剩余次数: {result.remaining} 次
              </p>
            </div>
            
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              📥 下载PPT文件
            </button>
          </div>
        )}
        
        {/* 使用提示 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 提示：输入清晰的纲要有助于AI生成更准确的PPT</p>
          <p className="mt-1">🦞 Powered by MoClawny AI</p>
        </div>
      </div>
    </div>
  );
}
