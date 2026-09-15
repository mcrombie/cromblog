import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";
import { doodleAssets } from "@/content/doodles";

import styles from "./post.module.css";

const post = blogPosts["doodle-lab"];
const media = "/cromblog/doodle-lab";
const sentinel = doodleAssets["eye-flower-sentinel-01"];
const birdStudies = [
  {
    asset: doodleAssets["carolina-wren-01"],
    alt: "Graphite sketch of a Carolina wren perched in left-facing profile, with its compact body and tail cocked sharply upward."
  },
  {
    asset: doodleAssets["red-eyed-vireo-01"],
    alt: "Graphite sketch of a rounded red-eyed vireo perched on a thin twig and facing left."
  },
  {
    asset: doodleAssets["scissor-tailed-flycatcher-01"],
    alt: "Graphite sketch of a scissor-tailed flycatcher perched in profile, its long tail extending below the branch."
  }
];

// Drawings sit on the same plain panels as An Auspicious August.
const panelClass =
  "auspicious-media-panel m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm";
const captionClass =
  "border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-pine-900/80";

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

export default function DoodleLabPage() {
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
            <p>Digitized hand-drawn doodle integration into my website!</p>
          </div>

          <figure className={panelClass}>
            <Image
              src={`${media}/from-a-line-a-world.png`}
              alt="An open sketchbook becomes a sunlit fantasy world: pencil roots form a bridge beneath a monumental tree-crowned bird, with a traveler, trumpet turtle, and orb juggler."
              width={1672}
              height={941}
              priority
              sizes="(max-width: 860px) 90vw, 760px"
              className="block h-auto w-full"
            />
            <figcaption className={captionClass}>
              From a Line, a World: a scene of my drawings growing out of a
              notebook. The notebook is part of the illustration, not a photograph
              of my journal.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>Duh.</p>
            <p>How did I not think to do this four months ago?</p>
            <p>
              I must have gotten too distracted with all these serious,
              professional projects and whatnot to stop and smell the daffodils
              or hear the eastern wood-pewees.
            </p>
            <p>
              It turns out what I thought would be a quick and fun project break
              grew into one of my most interesting and original programming
              projects so far.
            </p>
            <p>
              For about six years I have been keeping a{" "}
              <a href="https://www.amazon.com/dp/B0DT3YRW5V">customized notebook</a>{" "}
              to keep track of my daily to-dos, thoughts, and, of course, doodles.
              I have been churning at least one out almost every day for quite a
              while now.
            </p>
          </div>

          <figure className={panelClass}>
            <Image
              src={sentinel.src}
              alt="Pencil doodle of a surreal sentinel: a flower whose bloom is a single eye, rising from a dark, round-bodied creature that stands on a shaded mound."
              width={sentinel.image.width}
              height={sentinel.image.height}
              loading="lazy"
              sizes="(max-width: 760px) 88vw, 360px"
              className="mx-auto block h-auto w-full max-w-[22rem] object-contain p-6 sm:p-9"
            />
            <figcaption className={captionClass}>
              From the notebook: an eye-flower sentinel.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              While I am no expert at drawing, I like to sketch to stretch my
              imagination. Only recently have I gotten into drawing animals
              realistically.
            </p>
          </div>

          <figure className={panelClass}>
            <div className="grid items-center gap-8 p-6 sm:grid-cols-3 sm:gap-5 sm:p-8">
              {birdStudies.map(({ asset, alt }) => (
                <Image
                  key={asset.id}
                  src={asset.src}
                  alt={alt}
                  width={asset.image.width}
                  height={asset.image.height}
                  loading="lazy"
                  sizes="(max-width: 639px) 70vw, 220px"
                  className="mx-auto block h-44 w-full object-contain sm:h-48"
                />
              ))}
            </div>
            <figcaption className={captionClass}>
              Recent bird studies: a Carolina wren, a red-eyed vireo, and a
              scissor-tailed flycatcher.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              All this drawing has left me with plenty of material for what I have
              come to call my “<Link href="/art">Doodle Lab</Link>.” Basically, I
              am using AI agents to extract and organize my personal art
              collection, turning it into my own little art world. What’s more, I
              have found agents are remarkably fast and talented at making custom
              scenes using my characters and backgrounds based on my drawing
              style.
            </p>
          </div>

          <figure className={panelClass}>
            <Image
              src={`${media}/04-winter-archive.png`}
              alt="An antlered deer and an eccentric shaggy owl study an autumn leaf in a folio beside a snowbound manor archive."
              width={1672}
              height={941}
              loading="lazy"
              sizes="(max-width: 860px) 90vw, 760px"
              className="block h-auto w-full"
            />
            <figcaption className={captionClass}>
              The Winter Archive, a scene Codex made from three of my drawings: an
              antlered deer, a shaggy owl, and a manor.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Rather than programming, the hardest part of all of this was
              photographing the doodles from five years of notebooks. That took
              several hours. It could have been done more professionally, but I
              also did not want to scan whole pages of my journals and upload
              them, so I photographed the image, not the page, except for most of
              my sketchbook, which was actually a dedicated drawing book.
            </p>
          </div>

          <aside aria-labelledby="codex-process" className={styles.codexNote}>
            <p className={styles.byline}>Originally written by Codex · edited by Claude</p>
            <h2 id="codex-process" className={styles.title}>
              How Codex got the doodles off the page
            </h2>
            <div className={styles.body}>
              <p>
                Once the photographs were done, Codex turned them into a library
                in four steps.
              </p>
              <ol>
                <li>
                  <strong>Batch and label.</strong> Each set of photographs became
                  a dated batch. The originals stayed untouched; Codex made
                  smaller, correctly rotated copies and laid them out on contact
                  sheets for review. Every drawing it kept got a stable ID and a
                  record linking it back to its photograph. The dates come from
                  the notebooks, not from when Michael took the photos.
                </li>
                <li>
                  <strong>Outline the drawing, not the writing.</strong> Codex
                  traced an outline around each doodle and masked out nearby
                  handwriting. When writing crossed a drawing and could not be
                  separated cleanly, the drawing was held back instead of
                  published. This took visual checking and correction; it is not
                  automatic text removal.
                </li>
                <li>
                  <strong>Turn the paper transparent.</strong> A Python script
                  using Pillow and NumPy estimated the brightness of the paper
                  around each drawing and used the contrast of the pencil marks to
                  build a transparent image, then trimmed it and added a clear
                  margin. It does not redraw or invent strokes, so some
                  construction lines and notebook dots remain. Full-resolution
                  cutouts are kept separately from the smaller web versions.
                </li>
                <li>
                  <strong>Sort, tag, and check.</strong> Complete, legible drawings
                  went into the curated selection; leaves, branches, and other
                  small marks became textures; rougher studies went into the
                  archive. Titles, categories, and tags make them searchable.
                  Contact sheets were checked by eye for clipped features, stray
                  writing, and duplicates, while code checked the IDs, files,
                  dimensions, and transparency. The source photographs stay off
                  the website.
                </li>
              </ol>
              <p>
                The scenes are made differently. For The Winter Archive, Codex
                gave ImageGen three drawings from the archive (the antlered deer,
                the shaggy owl, and the manor) and an earlier scene as a guide for
                the finish. The written prompt described each character’s
                distinctive features, what they are doing together, and the
                setting, composition, colors, and light. The results were checked
                against the drawings for recognizable features and complete
                silhouettes. The characters and scenery come from Michael’s
                notebooks, but the rendering, color, lighting, and much of the
                landscape are generated. Using drawings as references is not the
                same as training a model on them.
              </p>
            </div>
          </aside>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              I used Doodle Lab to create a new design option for my website, but
              I reckon I have only dipped one foot in the ocean.
            </p>
          </div>

          <figure className={panelClass}>
            <Image
              src="/cromblog/doodle-experiments/round-19/one-foot-on-the-river.png"
              alt="An antler-crowned paddler steadies a curved canoe while a leaf-horned faun steps aboard from a root-bound bank in a green pine valley."
              width={1536}
              height={1024}
              loading="lazy"
              sizes="(max-width: 860px) 90vw, 760px"
              className="block h-auto w-full"
            />
            <figcaption className={captionClass}>
              One Foot on the River, another scene made from my drawings.
            </figcaption>
          </figure>
        </div>
      </div>
    </article>
  );
}
