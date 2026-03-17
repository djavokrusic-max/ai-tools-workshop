'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('提交失败', error);
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">提交成功！</h1>
        <p className="text-gray-600 mb-8">
          感谢你的需求提交！我们会尽快评估并安排开发。
          <br />
          记得邀请朋友来投票，让你的需求更有机会被选中！
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/requests" className="btn-primary">
            查看需求
          </a>
          <a href="/" className="px-6 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50">
            返回首页
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">💡 提交你的需求</h1>
        <p className="text-gray-600">
          告诉我们你需要什么工具，我来帮你实现！
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {/* 标题 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            需求标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="例如：小红书自动发布工具"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* 描述 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            详细描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            placeholder="描述你想要的功能、用途、目标用户等..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* 预算 */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            预算（可选）
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">¥</span>
            <input
              type="number"
              placeholder="例如：100"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
            />
            <span className="text-gray-400 text-sm">(如需付费开发)</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            注：付费需求会优先开发，但不一定保证实现
          </p>
        </div>

        {/* 提示 */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-700">
            💡 <strong>小提示：</strong>需求越具体、越多人需要，越容易被选中开发！
            提交后可以分享给朋友让他们帮你投票～
          </p>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 text-lg disabled:opacity-50"
        >
          {loading ? '提交中...' : '提交需求'}
        </button>
      </form>

      {/* 已有需求 */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          看看别人的需求？{' '}
          <Link href="/requests" className="text-purple-600 hover:underline">
            查看需求广场
          </Link>
        </p>
      </div>
    </div>
  );
}
