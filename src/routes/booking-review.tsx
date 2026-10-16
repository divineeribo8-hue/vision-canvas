import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Mail, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { buildBookingMessage, readBookingDraft, isInquiryComplete, type BookingDraft } from "@/lib/booking-storage";
import { serviceLabels } from "@/lib/divine-data";

export const Route = createFileRoute("/booking-review")({
  head: () => ({ meta: [
    { title: "Review Your Session — Divine Aesthetics" },
    { name: "description", content: "Review every detail of your Divine Aesthetics booking request before sending it." },
    { property: "og:title", content: "Review Your Session — Divine Aesthetics" },
    { property: "og:description", content: "Check your session, location, inspiration and creative brief." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReviewPage,
});

function ReviewPage() {
  const [draft, setDraft] = useState<BookingDraft>({});
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setDraft(readBookingDraft()), []);

  if (!isInquiryComplete(draft)) return <PageShell><main className="page-intro"><h1 className="page-title">REVIEW YOUR SESSION.</h1><p className="mt-7 body-large">There is no booking draft to review yet.</p><Button asChild className="mt-6"><Link to="/booking">START BOOKING</Link></Button></main></PageShell>;

  const message = buildBookingMessage(draft);
  const sessionLabel = draft.service ? serviceLabels[draft.service] : "Session";
  const whatsappUrl = `https://wa.me/2348162011902?text=${encodeURIComponent(message)}`;
  const gmailUrl = `mailto:divineeribo8@gmail.com?subject=${encodeURIComponent(`Divine Aesthetics Session Inquiry — ${sessionLabel}`)}&body=${encodeURIComponent(message)}`;

  const copyAll = async () => {
    setError("");
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch { setError("Your browser blocked copying. Select the message text below and copy it manually."); }
  };

  const groups: [string, [string, string | undefined][]][] = [
    ["CLIENT INFORMATION", [["Name", draft.fullName], ["Phone / WhatsApp", draft.phone], ["Email", draft.email]]],
    ["SESSION", [["Session", sessionLabel], ["Package", draft.packageName], ["Price", draft.price], ["Duration", draft.duration], ["Deliverables", draft.deliverables]]],
    ["SESSION DETAILS", [["Preferred date", draft.service === "videography" ? "Not applicable — editing project" : draft.date], ["Preferred time", draft.service === "videography" ? "Not applicable — editing project" : draft.time], ["Location", draft.service === "videography" ? "Not applicable — editing project" : draft.locationChoice === "recommend" ? "Please recommend a location" : draft.locationDetails]]],
    ["CREATIVE DIRECTION", [["Creative vision", draft.vision], ["Additional notes", draft.relevantNotes]]],
  ];

  return <PageShell><main className="page-intro">
    <p className="eyebrow">BOOKING REVIEW</p><h1 className="page-title">REVIEW YOUR SESSION.</h1>
    <div className="mt-12 border border-border">
      <p className="border-b border-border bg-secondary px-6 py-4 eyebrow">DIVINE AESTHETICS SESSION INQUIRY</p>
      {groups.map(([title, rows]) => <section key={title} className="border-b border-border px-6 py-6">
        <p className="eyebrow text-primary">{title}</p>
        <dl className="mt-3">{rows.map(([label, value]) => <div key={label} className="grid gap-1 py-2 sm:grid-cols-[11rem_1fr]"><dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="whitespace-pre-wrap text-sm leading-6">{value || "Not provided"}</dd></div>)}</dl>
      </section>)}
      <section className="px-6 py-6">
        <p className="eyebrow text-primary">INSPIRATION</p>
        <p className="mt-3 text-sm leading-6">{draft.inspirationNotes || "No inspiration notes provided."}</p>
        <div className="mt-3 space-y-2">{draft.inspirationFiles?.length ? draft.inspirationFiles.map((file) => <p key={file.name} className="text-sm">{file.status === "stored" && file.shareUrl ? <a href={file.shareUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-primary underline-offset-4">{file.name}</a> : file.name} — <span className={file.status === "stored" ? "text-primary" : "text-destructive"}>{file.status === "stored" ? (file.shareUrl ? "uploaded (secure link)" : "stored; link unavailable") : "not uploaded"}</span></p>) : <p className="text-sm text-muted-foreground">No files attached.</p>}</div>
      </section>
    </div>

    <div className="mt-8 border-l-2 border-primary bg-secondary p-6"><p className="eyebrow">50% DEPOSIT REQUIRED</p><p className="mt-3 font-serif text-xl leading-relaxed">A 50% deposit is required to secure your selected session. Your booking request is not confirmed until the deposit has been received and your session has been confirmed by Divine Aesthetics Media Agency.</p></div>

    <section className="mt-10">
      <p className="eyebrow">SEND YOUR INQUIRY</p>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">Copy your full inquiry first, then choose WhatsApp or Gmail. If the message doesn't appear filled in, just paste it.</p>
      <div className="mt-6 grid gap-3 xl:grid-cols-3">
        <Button type="button" variant="editorial" size="lg" onClick={() => void copyAll()}><Copy className="mr-2 size-4" />COPY FULL INQUIRY</Button>
        <Button asChild variant="outlineEditorial" size="lg"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 size-4" />SEND VIA WHATSAPP</a></Button>
        <Button asChild variant="outlineEditorial" size="lg"><a href={gmailUrl} target="_blank" rel="noopener noreferrer"><Mail className="mr-2 size-4" />SEND VIA GMAIL</a></Button>
      </div>
      {copied && <p role="status" className="mt-4 text-sm text-primary">Inquiry copied to clipboard.</p>}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <p className="mt-4 text-sm text-muted-foreground">WhatsApp: +234 816 201 1902 · Gmail: divineeribo8@gmail.com</p>
      <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap border border-border bg-background p-4 text-xs leading-6 text-muted-foreground">{message}</pre>
    </section>

    <div className="mt-10 flex flex-wrap gap-4"><Button asChild variant="text"><Link to="/booking">EDIT DETAILS</Link></Button><Button asChild variant="outlineEditorial"><Link to="/contact-method">PROCEED WITH YOUR SESSION</Link></Button></div>
  </main></PageShell>;
}
