import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { readBookingDraft, type BookingDraft } from "@/lib/booking-storage";
import { findPackage, serviceLabels } from "@/lib/divine-data";

export const Route = createFileRoute("/session-details")({
  head: () => ({ meta: [
    { title: "Session Details — Divine Aesthetics" },
    { name: "description", content: "Review your selected session, price, duration, deliverables and preparation." },
    { property: "og:title", content: "Session Details — Divine Aesthetics" },
    { property: "og:description", content: "Know exactly what your chosen visual experience includes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SessionDetailsPage,
});

function SessionDetailsPage() {
  const [draft, setDraft] = useState<BookingDraft>({});
  useEffect(() => setDraft(readBookingDraft()), []);
  const selected = findPackage(draft.packageId);

  return <PageShell><main className="page-intro">
    <p className="eyebrow">SESSION DETAILS</p>
    <h1 className="page-title">YOUR CHOSEN EXPERIENCE.</h1>
    {!selected ? (
      <div className="mt-12 border border-border bg-secondary p-8">
        <p className="body-large">Choose a package first so we can show its complete details.</p>
        <Button asChild variant="editorial" className="mt-6"><Link to="/sessions">VIEW SESSIONS</Link></Button>
      </div>
    ) : (
      <div className="mt-12 grid gap-px bg-border lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-primary p-8 text-primary-foreground md:p-12">
          <p className="eyebrow text-primary-foreground/70">{serviceLabels[selected.service]}</p>
          <h2 className="mt-5 font-serif text-5xl">{selected.name}</h2>
          <p className="mt-8 font-serif text-6xl">{selected.price}</p>
          <dl className="mt-10 grid gap-6 border-t border-primary-foreground/25 pt-7 sm:grid-cols-2">
            <div><dt className="eyebrow text-primary-foreground/60">Duration</dt><dd className="mt-2">{selected.duration}</dd></div>
            <div><dt className="eyebrow text-primary-foreground/60">Deliverables</dt><dd className="mt-2">{selected.deliverables}</dd></div>
          </dl>
        </section>
        <section className="bg-secondary p-8 md:p-12">
          <h3 className="font-serif text-3xl">What’s included</h3>
          <ul className="mt-6 space-y-4">{selected.included.map((item) => <li key={item} className="flex gap-3 text-sm leading-7"><Check className="mt-1 size-4 shrink-0 text-primary" />{item}</li>)}</ul>
          <h3 className="mt-10 font-serif text-3xl">Preparation</h3>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{selected.preparation}</p>
          <Button asChild variant="editorial" size="lg" className="mt-9"><Link to="/booking">CONTINUE TO BOOKING</Link></Button>
        </section>
      </div>
    )}
  </main></PageShell>;
}
