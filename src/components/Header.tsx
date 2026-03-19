'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          <span className="text-xl font-bold gradient-text">AI 工具工坊</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/forum" className="text-gray-600 hover:text-purple-600 transition-colors">
            需求论坛
          </Link>
          <Link href="/ppt" className="text-gray-600 hover:text-purple-600 transition-colors">
            PPT工具
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-purple-600 transition-colors">
            产品中心
          </Link>
          <Link href="/submit" className="btn-primary">
            发布需求
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm text-gray-500">👤 {user.username}</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-500"
              >
                退出
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-sm text-gray-500 hover:text-purple-600">
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
