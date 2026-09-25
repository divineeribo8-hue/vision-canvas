import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { submitBookingRequest } from "@/lib/booking.functions";
import { buildBookingMessage, readBookingDraft, updateBookingDraft, type BookingDraft } from "@/lib/booking-storage";

export const Route = createFileRoute("/contact-method")({
  head: () => ({ meta: [
    { title: "Choose Contact Method — Divine Aesthetics" },
    { name: "description", content: "Send your complete session request by WhatsApp or Gmail without retyping it." },
    { property: "og:title", content: "How Would You Like to Connect?" },
    { property: "og:description", content: "Your complete booking details are ready to send." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContactMethodPage,
});

function ContactMethodPage() {
  const [draft, setDraft] = useState<BookingDraft>({});
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const submitRequest = useServerFn(submitBookingRequest);
  useEffect(() => setDraft(readBookingDraft()), []);
  const message = buildBookingMessage(draft);
  const subject = `Divine Aesthetics Session Inquiry — ${draft.service ?? "Session"}`;
  const whatsappUrl = `https://wa.me/2348162011902?text=${encodeURIComponent(message)}`;
  const gmailUrl = `mailto:divineeribo8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const complete = !!(draft.service && draft.packageName && draft.price && draft.duration && draft.deliverables && draft.date && draft.time && draft.fullName && draft.email && draft.phone && draft.locationChoice && draft.vision);

  const record = async (method: "whatsapp" | "email") => {
    if (!complete) { setError("Your booking draft is incomplete. Return to edit the missing details."); return false; }
    setError("");
    try {
      await submitRequest({ data: { service: draft.service!, packageName: draft.packageName!, price: draft.price!, duration: draft.duration!, deliverables: draft.deliverables!, preferredDate: draft.date!, preferredTime: draft.time!, fullName: draft.fullName!, email: draft.email!, phone: draft.phone!, locationChoice: draft.locationChoice!, locationDetails: draft.locationDetails, inspirationNotes: draft.inspirationNotes, inspirationFiles: draft.inspirationFiles ?? [], vision: draft.vision!, relevantNotes: draft.relevantNotes, contactMethod: method } });
      updateBookingDraft({ contactMethod: method, requestSent: true });
      setDraft(readBookingDraft());
      return true;
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The request could not be prepared."); return false; }
  };

  const copyAll = async () => {
    if (!complete) { setError("Your booking draft is incomplete. Return to edit the missing details."); return; }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch { setError("Your browser blocked copying. Select the message text manually below."); }
    await record("whatsapp");
  };

  return <PageShell><main className="page-intro">
    <p className="eyebrow">FINAL STEP</p><h1 className="page-title">HOW WOULD YOU LIKE TO CONNECT?</h1><p className="mt-8 max-w-2xl body-large">Your complete booking request is already prepared. Choose a method, review the message in your app and press send.</p>
    <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
      <a href={complete ? whatsappUrl : undefined} target="_blank" rel="noopener noreferrer" onClick={(event) => { if (!complete) { event.preventDefault(); setError("Your booking draft is incomplete. Return to edit the missing details."); return; } void record("whatsapp"); }} className="group min-h-72 bg-secondary p-8 text-left transition-colors hover:bg-accent"><MessageCircle className="size-8 text-primary" /><h2 className="mt-8 font-serif text-4xl">SEND VIA WHATSAPP</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Opens WhatsApp with every booking detail filled in. Review, then press send.</p></a>
      <a href={complete ? gmailUrl : undefined} target="_blank" rel="noopener noreferrer" onClick={(event) => { if (!complete) { event.preventDefault(); setError("Your booking draft is incomplete. Return to edit the missing details."); return; } void record("email"); }} className="group min-h-72 bg-secondary p-8 text-left transition-colors hover:bg-accent"><Mail className="size-8 text-primary" /><h2 className="mt-8 font-serif text-4xl">SEND VIA GMAIL</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Opens your email with the subject and complete request filled in, including secure links to your inspiration. Review, then send.</p></a>
    </div>
    <div className="mt-8 border border-border bg-secondary p-6">
      <p className="eyebrow">OR COPY IT YOURSELF</p>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Copy your complete enquiry, then paste it into WhatsApp or your email app.</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="button" variant="outlineEditorial" onClick={() => void copyAll()}><Copy className="mr-2 size-4" />{copied ? "COPIED TO CLIPBOARD" : "COPY COMPLETE ENQUIRY"}</Button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline decoration-primary underline-offset-4">If WhatsApp did not open, open a chat with +234 816 201 1902</a>
      </div>
      <pre className="mt-6 max-h-64 overflow-auto whitespace-pre-wrap border border-border bg-background p-4 text-xs leading-6 text-muted-foreground">{message}</pre>
    </div>
    <div className="mt-8 border border-border bg-secondary p-5 text-sm leading-7 text-muted-foreground">Your message goes directly to Divine Aesthetics on WhatsApp (+234 816 201 1902) or Gmail (divineeribo8@gmail.com). No information needs to be retyped.</div>
    {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
    <div className="mt-8 flex flex-wrap gap-4"><Button asChild variant="text"><Link to="/booking-review">BACK TO REVIEW</Link></Button>{draft.requestSent && <Button asChild variant="outlineEditorial"><Link to="/booking-request-received">I HAVE SENT MY MESSAGE</Link></Button>}</div>
  </main></PageShell>;
}

