import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/SiteChrome";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { Button } from "@/components/ui/button";
import { portfolioItems, services } from "@/lib/divine-data";

export const Route = createFileRoute("/the-work")({
  head: () => ({ meta: [
    { title: "The Work — Divine Aesthetics Media Agency" },
    { name: "description", content: "Explore portraits, personal branding, products, concepts, cinematic events and videography." },
    { property: "og:title", content: "The Work — Divine Aesthetics" },
    { property: "og:description", content: "Experience the art of visual storytelling." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <PageShell>
      <main>
        <header className="page-intro">
          <p className="eyebrow">THE WORK</p>
          <h1 className="page-title">EXPERIENCE THE ART OF VISUAL STORYTELLING.</h1>
          <p className="mt-8 max-w-2xl body-large">A growing archive of personality, identity, atmosphere and imagination—created with intention.</p>
          <div className="mt-9 border-l border-primary pl-5 text-sm leading-7 text-muted-foreground">
            Development note: every frame below is a replaceable placeholder. No placeholder is presented as completed Divine Aesthetics work.
          </div>
        </header>

        {services.map((service, serviceIndex) => {
          const items = portfolioItems.filter((item) => item.section === service.key);
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
                <div className="mt-12 grid auto-rows-[20rem] gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, index) => (
                    <VisualPlaceholder
                      key={item.id}
                      label={item.title}
                      type={item.type}
                      className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
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
