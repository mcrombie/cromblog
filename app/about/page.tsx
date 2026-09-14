import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { doodleVibeMarks } from "@/content/doodle-vibe";

export const metadata: Metadata = {
  title: "De Me"
};

export default function AboutPage() {
  return (
    <div className="content-flow" lang="la">
      <SectionHeading
        doodle={doodleVibeMarks.about}
        eyebrow="De Me"
        title="Michael Crombie"
        description="Programmator qui instrumenta interactiva, simulationes experientiasque editorias a fundamentis exstruere solet."
      />

      <section className="editorial-panel">
        <h2 className="sr-only">Curriculum et communicatio</h2>
        <div className="about-layout">
          <div className="about-story">
            <p>
              Programmator sum. Per omnes structurae partes opera exstruo — a
              simulationibus lingua Python scriptis usque ad applicationes
              TypeScript et React — praecipue eis studens operibus quae vim
              interactivam vel experiendi facultatem prae se ferunt. Quae in hoc
              situ posita sunt eam varietatem ostendunt: editor mapparum
              hexagonalium ad mundos fingendos, tabula phonematum quae sonos
              linguarum audire permittit, simulatio civilizationis per plures
              menses gradatim exstructa.
            </p>
            <p>
              Filum quod per pleraque opera mea pertinet curiositas est: fere ab
              ea quaestione incipio cui respondere non possum nisi aliquid
              aedificando. Qui processus et opus ipsum gignit et scripta quae
              illud testantur; qua de causa hic situs et pinacothecam operum et
              diarium coniungit.
            </p>
          </div>

          <aside className="about-aside">
            <h3 className="about-aside-heading">Aditus</h3>
            <ul className="about-facts">
              <li>Programmata et systemata</li>
              <li>Historia et lingua</li>
              <li>Mundi et simulationes</li>
            </ul>
            <h3 className="about-aside-heading" style={{ marginTop: "1.5rem" }}>
              Epistulae
            </h3>
            <a href="mailto:mcrombie1994@gmail.com" className="about-contact">
              mcrombie1994@gmail.com
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}
