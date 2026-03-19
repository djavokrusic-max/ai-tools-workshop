import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export function middleware(request: NextRequest) {
  // 检查是否有 user cookie
  const userCookie = request.cookies.get('user');
  
  // 获取当前路径
  const pathname = request.nextUrl.pathname;
  
  // 如果没有 user cookie 且访问的是需要认证的页面，重定向
  if (!userCookie) {
    // 首页需要登录
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    // 论坛、产品页、提交页也需要登录
    if (pathname === '/forum' || pathname === '/products' || pathname === '/submit') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }
  
  // 如果有 user cookie 且访问的是登录页，重定向到首页
  if (userCookie && pathname === '/auth') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// 配置哪些路径需要经过中间件
export const config = {
  matcher: ['/', '/auth', '/forum/:path*', '/products/:path*', '/submit/:path*'],
};
