import Link from "next/link";
import { getStats } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const stats = await getStats();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,100,255,0.1),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🦞</div>
            <h1 className="text-5xl font-bold mb-6 gradient-text">
              你的需求 · 我们的作品
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              提交你的软件需求，投票选出最想要的，我们用 AI 来开发！
              <br />
              <span className="text-purple-600 font-semibold">免费 + 付费</span>，总有一款适合你
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/submit" className="btn-primary text-lg px-8 py-4">
                提交需求
              </Link>
              <Link href="/products" className="px-8 py-4 border-2 border-purple-200 rounded-xl font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
                查看产品
              </Link>
            </div>
          </div>
          
          {/* Stats - 真实数据 */}
          <div className="flex justify-center gap-12 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{stats.totalRequests}</div>
              <div className="text-gray-500">提交需求</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{stats.completedProducts}</div>
              <div className="text-gray-500">开发完成</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{stats.totalDownloads}</div>
              <div className="text-gray-500">用户使用</div>
            </div>
          </div>
        </div>
      </section>

      {/* 热门需求提示 */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/forum" className="text-purple-600 hover:underline text-lg">
            去需求论坛看看 →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">有想法？立即提交！</h2>
          <p className="text-gray-600 mb-8">
            你的需求可能是下一个爆款产品的基础
          </p>
          <Link href="/submit" className="btn-primary text-lg px-10 py-4 inline-block">
            提交你的想法
          </Link>
        </div>
      </section>
    </div>
  );
}
