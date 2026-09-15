import Image from "next/image";
import Link from "next/link";

import { blogPosts, publishedBlogOrder, type PublishedBlogPost } from "@/content/blog";

export function HomeLatestPost() {
  const slug = publishedBlogOrder[0];
  if (!slug) return null;
  const post = blogPosts[slug] as PublishedBlogPost;

  return (
    <section className="home-panel home-writing" aria-labelledby="home-writing-heading">
      <div className="home-discovery-heading">
        <h2 className="home-panel-heading" id="home-writing-heading">Latest from Cromblog</h2>
        <Link className="home-text-link" href="/cromblog">All posts <span aria-hidden="true">↗</span></Link>
      </div>
      <article className="latest-dispatch">
        {post.image ? (
          <Link href={post.href} className="latest-dispatch-image" aria-label={`Read ${post.title}`}>
            <Image src={post.image.src} alt={post.image.alt} fill
              sizes="(max-width: 639px) 90vw, 17rem"
              unoptimized={post.image.unoptimized}
              style={{ objectPosition: post.image.objectPosition }} />
          </Link>
        ) : null}
        <div>
          <div className="latest-dispatch-meta"><span>{post.date}</span><span>{post.readTime}</span></div>
          <h3 className="latest-dispatch-title"><Link href={post.href}>{post.title}</Link></h3>
          <p className="latest-dispatch-summary">{post.summary}</p>
          <Link href={post.href} className="home-text-link home-reading-link">Read the post <span aria-hidden="true">↗</span></Link>
        </div>
      </article>
    </section>
  );
}
