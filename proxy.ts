import { NextResponse, type NextRequest } from "next/server";

import { canPreviewDrafts } from "@/app/cromblog/draft-preview";
import { blogPosts, draftBlogOrder } from "@/content/blog";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "");
  const isDraftPath = draftBlogOrder.some((slug) => {
    const href = blogPosts[slug].href;
    return pathname === href || pathname.startsWith(`${href}/`);
  });
  if (!canPreviewDrafts() && isDraftPath) {
    // Block before rendering so drafts always return 404, never a streamed 200.
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store"
      }
    });
  }
  return NextResponse.next();
}

export const config = { matcher: "/cromblog/:path*" };
