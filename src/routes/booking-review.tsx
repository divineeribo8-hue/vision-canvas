import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { readBookingDraft, type BookingDraft } from "@/lib/booking-storage";
import { serviceLabels } from "@/lib/divine-data";

export const Route = createFileRoute("/booking-review")({
  head: () => ({ meta: [
    { title: "Review Your Session — Divine Aesthetics" },
    { name: "description", content: "Review every detail of your Divine Aesthetics booking request before proceeding." },
    { property: "og:title", content: "Review Your Session — Divine Aesthetics" },
    { property: "og:description", content: "Check your session, location, inspiration and creative brief." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReviewPage,
});

function ReviewPage() {
  const [draft, setDraft] = useState<BookingDraft>({});
  useEffect(() => setDraft(readBookingDraft()), []);
  const rows = [
    ["Client", draft.fullName], ["Session", draft.service ? serviceLabels[draft.service] : undefined], ["Package", draft.packageName], ["Price", draft.price], ["Duration", draft.duration], ["Deliverables", draft.deliverables], ["Preferred date", draft.date], ["Preferred time", draft.time], ["Location", draft.locationChoice === "recommend" ? "Location recommendation requested" : draft.locationDetails], ["Phone", draft.phone], ["Email", draft.email],
  ];
  if (!draft.packageId) return <PageShell><main className="page-intro"><h1 className="page-title">REVIEW YOUR SESSION.</h1><p className="mt-7 body-large">There is no booking draft to review yet.</p><Button asChild className="mt-6"><Link to="/booking">START BOOKING</Link></Button></main></PageShell>;
  return <PageShell><main className="page-intro">
    <p className="eyebrow">BOOKING REVIEW</p><h1 className="page-title">REVIEW YOUR SESSION.</h1>
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="border-y border-border">{rows.map(([label, value]) => <div key={label} className="grid gap-2 border-b border-border py-4 sm:grid-cols-[10rem_1fr]"><dt className="eyebrow text-muted-foreground">{label}</dt><dd className="text-sm leading-6">{value || "Not provided"}</dd></div>)}</section>
      <section className="space-y-8">
        <div className="bg-secondary p-7"><p className="eyebrow">INSPIRATION / REFERENCES</p><p className="mt-4 text-sm leading-7">{draft.inspirationNotes || "No inspiration notes provided."}</p><div className="mt-4 space-y-2">{draft.inspirationFiles?.length ? draft.inspirationFiles.map((file) => <p key={file.name} className="text-sm">{file.name} — <span className={file.status === "stored" ? "text-primary" : "text-destructive"}>{file.status === "stored" ? "successfully stored" : "not stored or transmitted"}</span></p>) : <p className="text-sm text-muted-foreground">No files attached.</p>}</div></div>
        <div className="border border-border p-7"><p className="eyebrow">CREATIVE BRIEF</p><p className="mt-4 whitespace-pre-wrap font-serif text-2xl leading-relaxed">{draft.vision}</p>{draft.relevantNotes && <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">{draft.relevantNotes}</p>}</div>
        <div className="border-l-2 border-primary pl-5 text-sm leading-7 text-muted-foreground">Proceeding sends you to a contact choice. It does not confirm the requested date or session.</div>
      </section>
    </div>
    <div className="mt-10 flex flex-wrap gap-4"><Button asChild variant="outlineEditorial" size="lg"><Link to="/booking">EDIT DETAILS</Link></Button><Button asChild variant="editorial" size="lg"><Link to="/contact-method">PROCEED WITH YOUR SESSION</Link></Button></div>
  </main></PageShell>;
}
