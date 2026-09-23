import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, Quote } from "lucide-react";

import { PageShell } from "@/components/SiteChrome";
import { PortfolioVisual } from "@/components/PortfolioVisual";
import { Button } from "@/components/ui/button";
import { selectedWork, services } from "@/lib/divine-data";
import { getPublishedPortfolio } from "@/lib/portfolio.functions";

const selectedPortfolioQuery = queryOptions({ queryKey: ["published-portfolio"], queryFn: () => getPublishedPortfolio() });

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(selectedPortfolioQuery),
  head: () => ({
    meta: [
      { title: "Divine Aesthetics Media Agency — From Vision to Visual" },
      { name: "description", content: "Intentional photography, videography and visual storytelling in Nigeria." },
      { property: "og:title", content: "Divine Aesthetics Media Agency" },
      { property: "og:description", content: "Your vision deserves to be seen through intentional visual storytelling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: published } = useSuspenseQuery(selectedPortfolioQuery);
  return (
    <PageShell>
      <main>
        <section className="relative min-h-[82vh] overflow-hidden border-b border-border bg-primary text-primary-foreground">
          <div className="absolute inset-0 hero-texture opacity-90" />
          <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 lg:px-8 lg:pb-20">
            <p className="eyebrow text-primary-foreground/70">FROM VISION TO VISUAL.</p>
            <h1 className="mt-6 max-w-5xl font-serif text-6xl leading-[0.94] sm:text-7xl lg:text-[7.5rem]">
              YOUR VISION DESERVES TO BE SEEN.
            </h1>
            <div className="mt-10 grid gap-8 border-t border-primary-foreground/25 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <p className="max-w-2xl text-base leading-8 text-primary-foreground/78 lg:text-lg">
                Divine Aesthetics Media Agency creates intentional photography, videography and visual stories that translate vision, identity and feeling into imagery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="ivory" size="lg"><Link to="/the-work">EXPLORE THE WORK</Link></Button>
                <Button asChild variant="ghostLight" size="lg"><Link to="/booking">BOOK A SESSION</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div><p className="eyebrow">ABOUT DIVINE AESTHETICS</p></div>
          <div>
            <h2 className="display-heading">We make the unseen visible.</h2>
            <p className="mt-7 max-w-3xl body-large">
              Divine Aesthetics exists to meet visual needs in a personal and intentional way—translating unseen visions, feelings, stories and ideas into visual representation that feels honest and true.
            </p>
            <Button asChild variant="text" className="mt-8"><Link to="/about">DISCOVER OUR STORY <ArrowRight /></Link></Button>
          </div>
        </section>

        <section className="border-y border-border bg-secondary">
          <div className="section-shell">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">SELECTED WORK</p>
                <h2 className="mt-4 display-heading">A place for the work to speak.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-muted-foreground">
                These are development placeholders. Your own photography and films can replace each one without changing the editorial layout.
              </p>
            </div>
            <div className="mt-12 grid auto-rows-[18rem] gap-4 md:grid-cols-3">
              {selectedWork.map((item, index) => (
                <PortfolioVisual
                  key={item.id}
                  item={published[index]}
                  placeholderLabel={item.title}
                  placeholderType={item.type}
                  className={index === 0 || index === 7 ? "md:col-span-2 md:row-span-2" : ""}
                />
              ))}
            </div>
            <Button asChild variant="outlineEditorial" size="lg" className="mt-10"><Link to="/the-work">VIEW FULL PORTFOLIO</Link></Button>
          </div>
        </section>

        <section className="section-shell">
          <p className="eyebrow">WHAT WE CREATE</p>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {services.map((service, index) => (
              <Link key={service.key} to="/the-work" className="group grid gap-5 py-7 md:grid-cols-[4rem_1fr_1fr_auto] md:items-center">
                <span className="font-serif text-2xl text-muted-foreground">0{index + 1}</span>
                <h3 className="font-serif text-3xl text-foreground md:text-4xl">{service.title}</h3>
                <p className="max-w-md text-sm leading-7 text-muted-foreground">{service.description}</p>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-secondary">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.55fr_1.45fr]">
            <div>
              <Quote className="size-9 text-primary" />
              <p className="mt-5 eyebrow">CLIENT WORDS</p>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              <blockquote className="border-l border-primary pl-7">
                <p className="font-serif text-3xl leading-snug">“The process felt thoughtful from the first conversation. I felt seen, not styled into someone else.”</p>
                <footer className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Portrait client</footer>
              </blockquote>
              <blockquote className="border-l border-primary pl-7">
                <p className="font-serif text-3xl leading-snug">“The final visuals carried the exact feeling I had struggled to explain.”</p>
                <footer className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Creative concept client</footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="section-shell text-center">
          <p className="eyebrow">READY WHEN YOU ARE</p>
          <h2 className="mx-auto mt-5 max-w-4xl font-serif text-6xl leading-none md:text-8xl">HAVE A VISION IN MIND?</h2>
          <p className="mt-5 font-serif text-3xl text-muted-foreground">Let’s bring it to life.</p>
          <Button asChild variant="editorial" size="lg" className="mt-9"><Link to="/booking">LET’S CREATE</Link></Button>
        </section>
      </main>
    </PageShell>
  );
}
