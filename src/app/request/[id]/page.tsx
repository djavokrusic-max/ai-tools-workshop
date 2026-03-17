'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Comment {
  id: string;
  requestId: string;
  content: string;
  username: string;
  createdAt: string;
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');
  const [request, setRequest] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    params.then(p => setId(p.id));
    
    // 获取用户信息
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [params]);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    // 获取需求详情
    fetch('/api/request-detail?id=' + id)
      .then(res => res.json())
      .then(data => {
        setRequest(data.request);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    
    // 获取评论
    fetch('/api/comment?requestId=' + id)
      .then(res => res.json())
      .then(data => {
        setComments(data.comments || []);
      })
      .catch(() => {});
  }, [id]);

  // 投票
  const handleVote = async () => {
    if (voting) return;
    setVoting(true);
    
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId: id,
          username: user?.username || null
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setRequest({ ...request, votes: data.votes });
      } else {
        alert(data.message || '投票失败');
      }
    } catch (e) {
      alert('投票失败');
    }
    
    setVoting(false);
  };

  // 发表评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId: id, 
          content: newComment,
          username: user?.username || '匿名用户'
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setComments([...comments, data.comment]);
        setNewComment('');
      } else {
        alert(data.message || '评论失败');
      }
    } catch (e) {
      alert('评论失败');
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">加载中...</div>;
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">需求不存在</h1>
        <Link href="/forum" className="text-purple-600 hover:underline mt-4 inline-block">
          返回需求论坛
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/forum" className="text-purple-600 hover:underline mb-6 inline-block">
        ← 返回需求论坛
      </Link>
      
      {/* 需求详情 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start gap-6">
          {/* 投票区域 */}
          <div 
            className={`flex flex-col items-center bg-purple-50 rounded-xl p-4 cursor-pointer hover:bg-purple-100 transition-colors ${voting ? 'opacity-50' : ''}`}
            onClick={handleVote}
          >
            <button className="p-2 rounded-lg text-purple-600">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-8 8h5v8h6v-8h5z"/>
              </svg>
            </button>
            <span className="text-2xl font-bold text-purple-600 my-1">{request.votes || 0}</span>
            <span className="text-xs text-gray-500">票</span>
          </div>
          
          {/* 内容 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold">{request.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${
                request.status === 'completed' ? 'bg-green-100 text-green-600' :
                request.status === 'developing' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {request.status === 'completed' ? '✅ 已完成' :
                 request.status === 'developing' ? '🔄 开发中' : '⏳ 待开发'}
              </span>
            </div>
            
            <p className="text-gray-600 text-lg mb-4">{request.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>🕐 发布于 {request.createdAt}</span>
              {request.budget > 0 && <span>💰 预算 ¥{request.budget}</span>}
              <span>💬 {comments.length} 条评论</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 评论区域 */}
      <div>
        <h2 className="text-xl font-bold mb-4">💬 讨论区 ({comments.length})</h2>
        
        {/* 发表评论 */}
        <form onSubmit={handleSubmitComment} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "发表你的看法..." : "登录后可发表评论"}
            disabled={!user || submitting}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none mb-4"
            rows={3}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">请理性讨论</span>
            <button
              type="submit"
              disabled={!user || !newComment.trim() || submitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '发表中...' : '发表评论'}
            </button>
          </div>
        </form>
        
        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>暂无评论，快来发表第一条评论吧！</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{comment.username}</span>
                  <span className="text-gray-400 text-sm">{comment.createdAt}</span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
