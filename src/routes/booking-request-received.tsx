import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { readBookingDraft, type BookingDraft } from "@/lib/booking-storage";

export const Route = createFileRoute("/booking-request-received")({
  head: () => ({ meta: [
    { title: "Booking Request Received — Divine Aesthetics" },
    { name: "description", content: "Your booking request is ready for personal review and confirmation." },
    { property: "og:title", content: "Your Vision Is Now in Our Hands" },
    { property: "og:description", content: "What happens after your Divine Aesthetics booking request is sent." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReceivedPage,
});
function ReceivedPage() {
  const [draft, setDraft] = useState<BookingDraft>({});
  useEffect(() => setDraft(readBookingDraft()), []);
  const received = ["Session details received", "Date and time received", "Location received", draft.inspirationFiles?.some((file) => file.status === "stored") ? "Stored inspiration received" : "Inspiration notes received; no file receipt claimed", "Creative brief received"];
  const steps = [["01", "WE REVIEW", "Divine Aesthetics reviews the submitted information."], ["02", "WE CONFIRM", "The session is personally confirmed with you."], ["03", "WE PREPARE", "References and creative direction are reviewed before the session."], ["04", "WE CREATE", "Your vision becomes visual."]];
  return <PageShell><main>
    <header className="bg-primary text-primary-foreground"><div className="section-shell"><p className="eyebrow text-primary-foreground/65">BOOKING REQUEST SENT — NOT YET CONFIRMED</p><h1 className="mt-6 max-w-5xl font-serif text-6xl leading-none md:text-8xl">YOUR VISION IS NOW IN OUR HANDS.</h1><div className="mt-10 grid gap-3 sm:grid-cols-2">{received.map((item) => <p key={item} className="flex gap-3 text-sm"><Check className="size-4 shrink-0" />{item}</p>)}</div></div></header>
    <section className="section-shell"><p className="eyebrow">WHAT HAPPENS NEXT?</p><div className="mt-8 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">{steps.map(([n, title, text]) => <article key={n} className="min-h-64 bg-secondary p-7"><p className="font-serif text-3xl text-muted-foreground">{n}</p><h2 className="mt-10 font-serif text-3xl">{title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{text}</p></article>)}</div><p className="mt-16 text-center font-serif text-5xl md:text-7xl">WE CAN’T WAIT TO CREATE WITH YOU.</p><div className="mt-8 text-center"><Button asChild variant="outlineEditorial"><Link to="/">RETURN HOME</Link></Button></div></section>
  </main></PageShell>;
}
