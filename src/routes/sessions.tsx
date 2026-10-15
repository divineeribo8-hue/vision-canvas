import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { startBookingFromPackage } from "@/lib/booking-storage";
import { getPackagesForService, packages, motionDescription, motionConditions } from "@/lib/divine-data";

export const Route = createFileRoute("/sessions")({
  head: () => ({ meta: [
    { title: "Sessions & Pricing — Divine Aesthetics" },
    { name: "description", content: "Explore Smartphone Portrait Photography and Basic Motion Video Editing with clear prices and deliverables." },
    { property: "og:title", content: "Sessions & Pricing — Divine Aesthetics" },
    { property: "og:description", content: "Every session begins with an idea. Choose the experience built around yours." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SessionsPage,
});

function SessionsPage() {
  const navigate = useNavigate();
  const groups = [
    { title: "SMARTPHONE PORTRAIT PHOTOGRAPHY", items: getPackagesForService("portraits"), note: "Additional edited image: ₦3,000" },
    { title: "BASIC MOTION VIDEO EDITING", items: getPackagesForService("videography"), note: "STARTING FROM ₦20,000" },
  ];

  const choose = (packageId: string) => {
    const selected = packages.find((item) => item.id === packageId);
    if (!selected) return;
    startBookingFromPackage(selected);
    navigate({ to: "/session-details" });
  };

  return (
    <PageShell>
      <main>
        <header className="page-intro">
          <p className="eyebrow">SESSIONS & PRICING</p>
          <h1 className="page-title">CHOOSE YOUR EXPERIENCE.</h1>
          <p className="mt-8 max-w-2xl body-large">Every session begins with an idea. We shape that idea into a visual experience designed around you.</p>
        </header>

        {groups.map((group, index) => (
          <section key={group.title} className={index % 2 ? "border-y border-border bg-secondary" : ""}>
            <div className="section-shell">
              <div className="flex flex-col gap-3 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
                <h2 className="font-serif text-3xl md:text-4xl">{group.title}</h2>
                <p className="text-sm text-muted-foreground">{group.note}</p>
              </div>
              {index === 1 && <div className="py-8"><p className="body-large max-w-3xl">{motionDescription}</p><p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">{motionConditions}</p></div>}
              <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
                {group.items.map((pkg) => (
                  <article key={pkg.id} className="flex min-h-[25rem] flex-col bg-background p-7">
                    <p className="eyebrow">{pkg.name}</p>
                    <p className="mt-7 font-serif text-5xl">{pkg.price}</p>
                    <div className="mt-8 space-y-3 border-y border-border py-5 text-sm leading-6 text-muted-foreground">
                      <p><span className="text-foreground">Duration</span><br />{pkg.duration}</p>
                      <p><span className="text-foreground">Deliverables</span><br />{pkg.deliverables}</p>
                    </div>
                    <Button variant="outlineEditorial" className="mt-auto" onClick={() => choose(pkg.id)}>
                      BOOK THIS SESSION <ArrowRight />
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

      </main>
    </PageShell>
  );
}
