import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

import styles from "./post.module.css";

const post = blogPosts["crombot-one"];
const media = "/cromblog/crombot-one";

export const metadata: Metadata = {
  title: post.title,
  description: post.summary,
  openGraph: {
    type: "article",
    title: post.title,
    description: post.summary,
    images: [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }]
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.summary,
    images: [post.image.src]
  }
};

export default function CrombotOnePage() {
  return (
    <article className="content-flow">
      <Link
        href="/cromblog"
        className="inline-flex text-sm text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
      >
        Back to Cromblog
      </Link>
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-6 py-10 shadow-card sm:px-8 sm:py-14">
        <div className="mx-auto max-w-[760px] content-flow">
          <header className="content-flow">
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">Cromblog</p>
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">{post.title}</h1>
            <p className="text-sm text-pine-700/80">
              {post.date} &middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Last month, having set out to have myself an{" "}
              <Link href="/cromblog/an-auspicious-august">“Auspicious August,”</Link>{" "}
              I took to looking to the skies for auspices.
            </p>
            <p>
              While walking into work on that first day of August, expecting to spot
              a bird, I saw a drone fly overhead. This is all the more curious since
              I have seen nothing overhead but birds and planes since.
            </p>
            <p>
              In keeping with my monthly theme, I took this as a sign that I should
              tinker with robotics, so I ordered a{" "}
              <a href="https://www.amazon.com/dp/B0D21BG1TV">robotics starter kit</a>.
            </p>
            <p>
              Crombot One fits neatly into the Signal September theme since he is
              a machine made from signals: infrared commands from the remote,
              motor-control signals from the Arduino, ultrasonic echoes from
              objects, and reflected infrared light from the floor sensors, all
              interpreted and reacted to in order to create autonomous behavior.
            </p>
            <p>Here is a short demo:</p>
          </div>

          <figure className={styles.videoFigure}>
            <video
              controls
              playsInline
              preload="metadata"
              width={1920}
              height={1080}
              poster={`${media}/demo-short-landscape-v3-poster.jpg`}
              aria-label="Crombot One introduction, narrated by Michael"
              aria-describedby="short-demo-caption"
            >
              <source src={`${media}/demo-short-landscape-v3.mp4`} type="video/mp4" />
              <track kind="captions" src={`${media}/demo-short-landscape-v3.vtt`} srcLang="en" label="English" />
              Your browser does not support embedded video. Use the link below to watch.
            </video>
            <figcaption id="short-demo-caption">
              <span>Crombot One in 10 seconds.</span>
              <a href={`${media}/demo-short-landscape-v3.mp4`}>Open demo</a>
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              This whole robot-building business has already opened my eyes to a
              growing number of beautiful nuances in the mechanical and electrical
              world around me. When I showed Crombot One to my uncle, he explained
              how the circuitry could be made much smaller, and how the ability to
              pack vast numbers of circuits into tiny chips helps explain the
              importance of Taiwan’s semiconductor industry. That kind of
              miniaturization can involve increasingly complex and costly
              manufacturing.
            </p>
            <p>
              That underscores how amateurish Crombot One’s wiring is, with its
              loose wires and poor organization. It is an educational practice
              project, after all, and as an educational practice project it has
              done its job of illuminating the potential of robotics.
            </p>
            <p>
              While flight, that is, building a drone, is the natural vision after
              sighting that drone on August 1, I reckon I should learn the basics
              before taking to the skies. Crombot 1.0 gives me a simple terrestrial
              robot to play around with. For my next robot, Crombot 2.0, I would
              like to experiment with a different body. Flight remains enticing,
              but I wonder if a swimming robot would be a better next exercise.
              It also seems as though it could be much cheaper.
            </p>
            <p>Even that is probably getting ahead of myself, though.</p>
            <p>
              I think the cheapest and most rewarding next experiment is to
              continue developing Crombot One by mounting my phone on him and
              linking it to the Arduino over Bluetooth. The phone could handle
              camera and microphone input, then send commands for Crombot to
              respond. That would allow me to dive straight into experimenting
              with audio and visual sensory recognition and response.
            </p>
            <p>
              Oh, and by the way, here is a longer demo of Crombot One I put
              together (I am practicing making videos):
            </p>
          </div>

          <figure className={styles.videoFigure}>
            <video
              controls
              playsInline
              preload="none"
              width={1920}
              height={1080}
              poster={post.image.src}
              aria-label="Crombot One full project demo"
              aria-describedby="long-demo-caption"
            >
              <source src={`${media}/demo-long.mp4`} type="video/mp4" />
              <track kind="captions" src={`${media}/demo-long.vtt`} srcLang="en" label="English" />
              Your browser does not support embedded video. Use the link below to watch.
            </video>
            <figcaption id="long-demo-caption">
              <span>Crombot One in action.</span>
              <a href={`${media}/demo-long.mp4`}>Open full demo</a>
            </figcaption>
          </figure>
        </div>
      </div>
    </article>
  );
}
