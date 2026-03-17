'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        // 保存用户信息到 localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // 跳转到首页
        window.location.href = '/';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('请求失败，请重试');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🛠️</span>
            <span className="text-2xl font-bold gradient-text">AI 工具工坊</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? '登录' : '注册'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">用户名</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">邮箱（可选）</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">密码</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-500">
            {isLogin ? (
              <>
                还没有账号？{' '}
                <button 
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className="text-purple-600 hover:underline"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号？{' '}
                <button 
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className="text-purple-600 hover:underline"
                >
                  立即登录
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-purple-600">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
