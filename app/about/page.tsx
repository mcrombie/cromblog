import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Michael Crombie",
  description: "I’m Michael Crombie, and this is where I share my writing, software projects, and whatever else happens to capture my imagination."
};

export default function AboutPage() {
  return (
    <article className={styles.letter} id="about-top" lang="en" aria-labelledby="about-title">
      <header className={styles.opening}>
        <h1 className={styles.label} id="about-title">About Michael Crombie</h1>
        <p className={styles.salutation}>{"Dear reader,"}</p>
        <p className={styles.welcome}>{"Welcome!"}</p>
      </header>

      <div className={styles.prose}>
        <p>{"I’m Michael Crombie, and this is where I share my writing, software projects, and whatever else happens to capture my imagination."}</p>

        <p>{"I first built Cromblog in 2019 and 2020, while learning web development and before finding my first full-time job as a software developer. While coding a website from scratch was good practical experience, I also discovered that blogging helped me organize and clarify my thoughts by giving me a structure for writing regularly. As I became absorbed in my professional work, I let the blog fall by the wayside. Then, in 2026, I revived Cromblog, overhauled its design, and made it a home for my growing collection of essays and projects."}</p>

        <p>{"Between those two incarnations of Cromblog, I decided to take my life in a rather different direction."}</p>

        <p>{"In 2022, I left my job at OpenPath Products to pursue an ambition I’d held since childhood: writing a history book. For the next several years, I devoted most of my time to researching and writing the book, supporting myself through part-time jobs and my savings."}</p>

        <p>{"The result was "}<a href="https://www.amazon.com/dp/B0HPCQGLPM"><cite>Cradle of the Empire: A Big History of Virginia</cite></a>{", an independently published book in which I brought the interdisciplinary perspective of "}<a href="https://bighistory.org/whatisbighistory/">Big History</a>{" to the story of one particular place. Rather than treating Virginia’s history as an isolated regional story, the book explores its foundational and continuing role in the emergence, expansion, and transformation of American imperial power over the last four centuries."}</p>

        <p>{"Having fulfilled my longstanding ambition of writing a history book, I began turning my attention back to software development."}</p>

        <p className={styles.aside}>{"And what a crazy time to return to programming!"}</p>

        <p>{"ChatGPT was released to the public just months after I left OpenPath in 2022. By the time my book entered the final stages of editing and publication in 2026, AI-assisted software development had evolved from conversational help with debugging to coding agents capable of helping developers build entire applications through natural-language instructions."}</p>

        <p>{"I dove back into this strange new world of software development with AI by refurbishing some of my older projects, including "}<Link href="/projects/react-chess"><cite>React-Chess</cite></Link>{" and my "}<Link href="/projects/phoneme-chart">Interactive Phoneme Chart</Link>{". Then, wanting to explore AI as a component of an application rather than simply a programming assistant, I began building a retrieval-augmented generation (RAG) system based on my book."}</p>

        <p>{"The result was "}<Link href="/projects#archivist">Archivist</Link>{", a natural bridge between my historical writing and software development. Archivist is a specialized chatbot that allows readers to ask questions about "}<cite>Cradle of the Empire</cite>{" and receive answers grounded in passages retrieved from the book. Developing it was particularly satisfying because it allowed me to put the research I’d spent years conducting to an entirely new use."}</p>

        <p>{"Since then, I have had some of the most fun of my life making applications I never dreamed I would have the time to code."}</p>

        <p>{"While the tools were new, my fascination with historical simulations was not. Since I was about twelve years old, I’ve enjoyed playing historical strategy games like "}<cite>Sid Meier’s Civilization</cite>{". Around the same time, reading the "}<cite>Harry Potter</cite>{" books had emboldened me to tackle large books, so I began reading history and never really stopped."}</p>

        <p><cite>Civilization</cite>{" was an ideal game for a kid like me, but I was particularly captivated by "}<a href="https://rhye.civfanatics.net/pages/civ4-RFC-description.php"><cite>Rhye’s and Fall of Civilization</cite></a>{", a mod that incorporated historical events and the rise and fall of actual civilizations into the game."}</p>

        <p>{"Ever since, I’ve wanted to try my hand at simulating history myself. During my final year at William & Mary, I battled my way through a course on simulations. It may have been the hardest class I have ever taken, although finite automata comes close. Over the years, I made various attempts at building my own historical simulations, but most ended up looking suspiciously like "}<cite>Risk</cite>{"."}</p>

        <p>{"That changed in 2026, when I began developing "}<Link href="/projects/clashvergence-demo">Clashvergence</Link>{", an ambitious attempt to simulate the political and economic evolution of human societies. Not coincidentally, it explores many of the same forces I examined in "}<cite>Cradle of the Empire</cite>{": geography, resources, language, social organization, trade, war, diplomacy, and so on."}</p>

        <p>{"More than anything, Clashvergence became an experiment in just how far I could push Codex to help me build complex systems. The results were remarkable, but the experience also raised questions about software architecture, testing, debugging, and how thoroughly developers need to understand the code produced by AI agents. These questions have become recurring subjects of my experiments and writing on Cromblog."}</p>

        <p>{"For a while, I resisted turning Clashvergence into a game, insisting that it remain strictly a simulation. But during a hike with a friend, a conversation about an upcoming "}<cite>Pokémon</cite>{" release inspired me to try spoofing the original Game Boy games with AI. That experiment became "}<Link href="/cromblog/cromonsters"><cite>Cromonsters</cite></Link>{", which I soon set aside for "}<Link href="/cromblog/clio"><cite>Clio</cite></Link>{", a 4X strategy game inspired by "}<cite>Civilization</cite>{". I still hope to return to "}<cite>Clio</cite>{" someday, but another idea soon captured my attention."}</p>

        <p><Link href="/projects#azhora"><cite>Azhora</cite></Link>{" is a 3D adventure game set in a fictional world I first imagined as a teenager. I spent a good deal of time, and a great deal of tokens, building a prototype that combines exploration and adventure with a larger simulated conflict unfolding around the player. There is still plenty to do, but I think I managed to create a decent initial experience. I intend to revisit it as a recreational project and an opportunity to experiment with game design, user experience, and interactive storytelling."}</p>

        <p>{"History and software development are hardly my only interests. I also enjoy drawing, birding, hiking, tinkering with robotics and Linux, and writing fiction. Some of these pursuits have already made their way onto Cromblog, and I expect others will follow."}</p>

        <p>{"Ultimately, I want Cromblog to remain more than a professional portfolio or technical journal. I want it to be a place where I can share what I’m making, organize what I’m learning, and follow my curiosity wherever it leads."}</p>

        <p>{"If you’ve made it this far, thank you for reading! Hopefully, you’ll enjoy exploring the rest of Cromblog. And if something here interests you, feel free to "}<a href="mailto:mcrombie1994@gmail.com">reach out</a>{"."}</p>
      </div>

      <footer className={styles.closing}>
        <div className={styles.signoff}>
          <p>{"Michael Crombie"}</p>
          <p>{"November 8, 2026"}</p>
        </div>
        <figure className={styles.illustration}>
          <Image
            src="/about/michael-writing-letter-v2.png"
            alt="A loose pencil drawing of Michael in his cream grid flannel, looking down as he writes in a notebook, with a laptop nearby."
            width={1536}
            height={1024}
            sizes="(max-width: 639px) 90vw, 576px"
          />
        </figure>
      </footer>
    </article>
  );
}
