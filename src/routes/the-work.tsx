import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";

import { PageShell } from "@/components/SiteChrome";
import { PortfolioEditor } from "@/components/PortfolioEditor";
import { PortfolioVisual } from "@/components/PortfolioVisual";
import { Button } from "@/components/ui/button";
import { portfolioItems, services } from "@/lib/divine-data";
import { getPublishedPortfolio } from "@/lib/portfolio.functions";

const portfolioQuery = queryOptions({ queryKey: ["published-portfolio"], queryFn: () => getPublishedPortfolio() });

export const Route = createFileRoute("/the-work")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQuery),
  head: () => ({ meta: [
    { title: "The Work — Divine Aesthetics Media Agency" },
    { name: "description", content: "Explore Smartphone Portrait Photography and Basic Motion Video Editing by Divine Aesthetics." },
    { property: "og:title", content: "The Work — Divine Aesthetics" },
    { property: "og:description", content: "Experience the art of visual storytelling." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WorkPage,
});

function WorkPage() {
  const { data: published } = useSuspenseQuery(portfolioQuery);
  return (
    <PageShell>
      <main>
        <header className="page-intro">
          <p className="eyebrow">THE WORK</p>
          <h1 className="page-title">EXPERIENCE THE ART OF VISUAL STORYTELLING.</h1>
          <p className="mt-8 max-w-2xl body-large">A growing archive of personality, identity, atmosphere and imagination—created with intention.</p>
          <div className="mt-9 border-l border-primary pl-5 text-sm leading-7 text-muted-foreground">
            Frames marked as placeholders are reserved for upcoming work and are not presented as completed Divine Aesthetics work.
          </div>
          <PortfolioEditor items={published} />
        </header>

        {services.map((service, serviceIndex) => {
          const media = published.filter((item) => item.section === service.key);
          const slots = portfolioItems.filter((item) => item.section === service.key);
          const items = Array.from({ length: Math.max(slots.length, media.length) }, (_, index) => ({ slot: slots[index], media: media[index] }));
          return (
            <section key={service.key} className={serviceIndex % 2 ? "border-y border-border bg-secondary" : ""}>
              <div className="section-shell">
                <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr]">
                  <p className="font-serif text-4xl text-muted-foreground">0{serviceIndex + 1}</p>
                  <div>
                    <h2 className="display-heading">{service.title}</h2>
                    <p className="mt-5 max-w-2xl body-large">{service.description}</p>
                  </div>
                </div>
                <div className="portfolio-grid mt-12">
                  {items.map(({ slot, media: project }, index) => (
                    <PortfolioVisual
                      key={project?.id ?? slot?.id ?? index}
                      item={project}
                      placeholderLabel="Awaiting new work"
                      placeholderType={service.key === "videography" ? "video" : "image"}
                      className={`portfolio-entry ${slot?.orientation === "landscape" ? "portfolio-landscape" : slot?.orientation === "square" ? "portfolio-square" : "portfolio-portrait"}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section className="section-shell text-center">
          <h2 className="font-serif text-5xl md:text-7xl">See yourself here.</h2>
          <Button asChild variant="editorial" size="lg" className="mt-8"><Link to="/sessions">EXPLORE SESSIONS</Link></Button>
        </section>
      </main>
    </PageShell>
  );
}
