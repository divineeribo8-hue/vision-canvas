import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Divine Aesthetics Media Agency" },
    { name: "description", content: "The philosophy and creative process behind Divine Aesthetics Media Agency." },
    { property: "og:title", content: "About Divine Aesthetics — From Vision to Visual" },
    { property: "og:description", content: "Visual storytelling rooted in authenticity, imagination, empathy and intention." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

const values = ["AUTHENTICITY", "CREATIVITY", "IMAGINATION", "VISUAL COMMUNICATION", "INTENTIONALITY", "EMPATHY"];
const process = [
  ["01", "UNDERSTAND", "We listen to the person, idea, story or brand."],
  ["02", "IMAGINE", "We conceptualize how the unseen vision becomes visible."],
  ["03", "CREATE", "We translate it through photography, video and visual storytelling."],
  ["04", "REFINE", "We carefully develop the final visuals while preserving the intended feeling and identity."],
];

function AboutPage() {
  return <PageShell><main>
    <header className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 hero-texture opacity-70" />
      <div className="section-shell relative min-h-[70vh] flex flex-col justify-end">
        <p className="eyebrow text-primary-foreground/65">ABOUT DIVINE AESTHETICS</p>
        <h1 className="mt-6 font-serif text-7xl leading-none md:text-[9rem]">FROM VISION<br />TO VISUAL.</h1>
      </div>
    </header>

    <section className="section-shell grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
      <p className="eyebrow">WHY WE EXIST</p>
      <div><h2 className="display-heading">To communicate what words cannot always hold.</h2><div className="mt-8 grid gap-7 body-large md:grid-cols-2"><p>We meet visual needs in an endearing and intentional way, translating feelings and unseen visions into pictorial representation.</p><p>We contribute to the evolution of the media industry by communicating beauty pure, honest and true—without boxing anyone into one definition.</p></div></div>
    </section>

    <section className="border-y border-border bg-secondary"><div className="section-shell grid gap-12 lg:grid-cols-2">
      <div><p className="eyebrow">WHO WE CREATE FOR</p><h2 className="mt-5 display-heading">People ready to be seen as they are.</h2></div>
      <ul className="divide-y divide-border border-y border-border text-sm leading-7">
        {["People who want to bring visions to life", "People who tell stories visually", "People who showcase realities and styles authentically", "People discovering and expressing their own aesthetic without being boxed in", "People inviting an audience into their reality through intentional visuals"].map((item) => <li key={item} className="py-5">{item}</li>)}
      </ul>
    </div></section>

    <section className="section-shell">
      <p className="eyebrow">OUR PHILOSOPHY</p><div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">{values.map((value, index) => <div key={value} className="min-h-44 bg-background p-7"><span className="font-serif text-2xl text-muted-foreground">0{index + 1}</span><h2 className="mt-10 font-serif text-3xl">{value}</h2></div>)}</div>
    </section>

    <section className="border-y border-border bg-primary text-primary-foreground"><div className="section-shell">
      <p className="eyebrow text-primary-foreground/65">OUR CREATIVE PROCESS</p><div className="mt-10 grid gap-px bg-primary-foreground/25 md:grid-cols-2 lg:grid-cols-4">{process.map(([n, title, text]) => <article key={n} className="min-h-80 bg-primary p-7"><p className="font-serif text-3xl text-primary-foreground/50">{n}</p><h2 className="mt-14 font-serif text-4xl">{title}</h2><p className="mt-5 text-sm leading-7 text-primary-foreground/70">{text}</p></article>)}</div></div></section>

    <section className="section-shell grid gap-16 lg:grid-cols-2">
      <article><p className="eyebrow">CULTURAL NARRATIVE</p><h2 className="mt-5 font-serif text-5xl">Stories with context.</h2><p className="mt-6 body-large">We create visual stories that respect people’s realities, identities, culture and context. Representation becomes meaningful when it stays close to truth.</p></article>
      <article><p className="eyebrow">COMMUNITY ENGAGEMENT</p><h2 className="mt-5 font-serif text-5xl">Creative work that grows outward.</h2><p className="mt-6 body-large">This chapter grows over time as Divine Aesthetics participates in creative and community projects that make visual expression more accessible and connected.</p></article>
    </section>

    <section className="border-t border-border"><div className="section-shell text-center"><h2 className="font-serif text-6xl md:text-8xl">Tell us what you see.</h2><Button asChild variant="editorial" size="lg" className="mt-8"><Link to="/booking">LET’S CREATE <ArrowRight /></Link></Button></div></section>
  </main></PageShell>;
}
