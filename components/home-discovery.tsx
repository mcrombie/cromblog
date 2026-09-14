import Image from "next/image";
import Link from "next/link";

import { blogPosts, publishedBlogOrder, type PublishedBlogPost } from "@/content/blog";
import { homeShowcaseDrawings, showcaseScenes } from "@/content/doodle-showcase";

const entrances = [
  { href: "/cromblog", title: "Writing", description: "Essays on history, learning, and making things." },
  { href: "/projects", title: "Software & projects", description: "Tools, games, robots, and simulated worlds." },
  { href: "/art", title: "Doodle Lab", description: "Notebook drawings and the places they become." }
] as const;

export function HomeEntrances() {
  return (
    <nav className="home-entrances" aria-label="Explore Cromblog">
      {entrances.map((entry, index) => (
        <Link key={entry.href} href={entry.href} className="home-entrance">
          <span className="home-entrance-number" aria-hidden="true">0{index + 1}</span>
          <span className="home-entrance-title">{entry.title}<span aria-hidden="true">↗</span></span>
          <span className="home-entrance-description">{entry.description}</span>
        </Link>
      ))}
    </nav>
  );
}

export function HomeWriting() {
  const posts = publishedBlogOrder.slice(0, 3).map(slug => blogPosts[slug] as PublishedBlogPost);
  const [latestPost, ...otherPosts] = posts;
  return (
    <section className="home-panel home-writing" aria-labelledby="home-writing-heading">
      <div className="home-discovery-heading">
        <h2 className="home-panel-heading" id="home-writing-heading">From the writing desk</h2>
        <Link className="home-text-link" href="/cromblog">All essays <span aria-hidden="true">↗</span></Link>
      </div>
      <article className="latest-dispatch">
        {latestPost.image ? (
          <Link href={latestPost.href} className="latest-dispatch-image" aria-label={`Read ${latestPost.title}`}>
            <Image src={latestPost.image.src} alt={latestPost.image.alt} fill
              sizes="(max-width: 639px) 90vw, (max-width: 1023px) 35vw, 28vw"
              unoptimized={latestPost.image.unoptimized}
              style={{ objectPosition: latestPost.image.objectPosition }} />
          </Link>
        ) : null}
        <div>
          <div className="latest-dispatch-meta"><span>Latest essay</span><span>{latestPost.date}</span><span>{latestPost.readTime}</span></div>
          <h3 className="latest-dispatch-title"><Link href={latestPost.href}>{latestPost.title}</Link></h3>
          <p className="latest-dispatch-summary">{latestPost.summary}</p>
          <Link href={latestPost.href} className="home-text-link home-reading-link">Read the essay <span aria-hidden="true">↗</span></Link>
        </div>
      </article>
      <div className="home-more-writing">
        {otherPosts.map(post => (
          <article key={post.slug}>
            <p>{post.date}</p>
            <h3><Link href={post.href}>{post.title} <span aria-hidden="true">↗</span></Link></h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeDoodleShowcase() {
  const scene = showcaseScenes[0];
  return (
    <section className="home-panel home-doodle-feature" aria-labelledby="home-doodle-heading">
      <div className="home-discovery-heading">
        <h2 className="home-panel-heading" id="home-doodle-heading">A visit to Doodle Lab</h2>
        <Link href="/art" className="home-text-link">View the showcase <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="home-doodle-spread">
        <figure className="home-doodle-scene">
          <Link href="/art#showcase" aria-label={`Explore Doodle Lab, featuring ${scene.title}`}>
            <Image src={scene.src} alt={scene.alt} width={scene.image.width} height={scene.image.height}
              sizes="(max-width: 767px) 90vw, (max-width: 1199px) 55vw, 44vw" quality={90} />
          </Link>
          <figcaption><span>{scene.title}</span><span>A Doodle Lab composition</span></figcaption>
        </figure>
        <div className="home-doodle-introduction">
          <p className="featured-project-kicker">From the notebooks</p>
          <h3>Small drawings.<br />Worlds of their own.</h3>
          <p>Birds, branches, curious creatures, and imagined places. A selection of favorite drawings, alongside scenes made from them.</p>
          <div className="home-doodle-originals" aria-label="A few of the original drawings">
            {homeShowcaseDrawings.map(drawing => (
              <Link key={drawing.id} href={`/art?drawing=${encodeURIComponent(drawing.id)}#drawings`}
                aria-label={`View original drawing: ${drawing.title}`}>
                <Image src={drawing.src} alt={drawing.alt} width={drawing.image.width} height={drawing.image.height}
                  sizes="(max-width: 767px) 26vw, 110px" />
              </Link>
            ))}
          </div>
          <Link href="/art#drawings" className="home-text-link">Browse the original drawings <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
