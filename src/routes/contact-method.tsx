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
  const [sending, setSending] = useState<"whatsapp" | "email" | null>(null);
  const [error, setError] = useState("");
  const submitRequest = useServerFn(submitBookingRequest);
  useEffect(() => setDraft(readBookingDraft()), []);
  const message = buildBookingMessage(draft);

  const open = async (method: "whatsapp" | "email") => {
    if (!draft.service || !draft.packageName || !draft.price || !draft.duration || !draft.deliverables || !draft.date || !draft.time || !draft.fullName || !draft.email || !draft.phone || !draft.locationChoice || !draft.vision) { setError("Your booking draft is incomplete. Return to edit the missing details."); return; }
    setSending(method); setError("");
    try {
      await submitRequest({ data: { service: draft.service, packageName: draft.packageName, price: draft.price, duration: draft.duration, deliverables: draft.deliverables, preferredDate: draft.date, preferredTime: draft.time, fullName: draft.fullName, email: draft.email, phone: draft.phone, locationChoice: draft.locationChoice, locationDetails: draft.locationDetails, inspirationNotes: draft.inspirationNotes, inspirationFiles: draft.inspirationFiles ?? [], vision: draft.vision, relevantNotes: draft.relevantNotes, contactMethod: method } });
      updateBookingDraft({ contactMethod: method, requestSent: true });
      const subject = `Divine Aesthetics Session Inquiry — ${draft.service}`;
      const url = method === "whatsapp" ? `https://wa.me/?text=${encodeURIComponent(message)}` : `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = url;
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The request could not be prepared."); }
    finally { setSending(null); }
  };

  return <PageShell><main className="page-intro">
    <p className="eyebrow">FINAL STEP</p><h1 className="page-title">HOW WOULD YOU LIKE TO CONNECT?</h1><p className="mt-8 max-w-2xl body-large">Your complete booking request is already prepared. Choose a method, review the message in your app and press send.</p>
    <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
      <button type="button" onClick={() => open("whatsapp")} disabled={!!sending} className="group min-h-72 bg-secondary p-8 text-left transition-colors hover:bg-accent disabled:opacity-60"><MessageCircle className="size-8 text-primary" /><h2 className="mt-8 font-serif text-4xl">SEND VIA WHATSAPP</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Opens WhatsApp with every booking detail filled in. Select Divine Aesthetics as the recipient, review, then send.</p></button>
      <button type="button" onClick={() => open("email")} disabled={!!sending} className="group min-h-72 bg-secondary p-8 text-left transition-colors hover:bg-accent disabled:opacity-60"><Mail className="size-8 text-primary" /><h2 className="mt-8 font-serif text-4xl">SEND VIA GMAIL</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Opens your email with the subject and complete request filled in, including secure links to your inspiration. Review, then send.</p></button>
    </div>
    <div className="mt-8 border border-border bg-secondary p-5 text-sm leading-7 text-muted-foreground"><strong className="text-foreground">Contact details needed:</strong> the agency’s final WhatsApp number and email address have not been provided, so the appropriate app opens without a fixed recipient. No client information needs to be retyped.</div>
    {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
    <div className="mt-8 flex flex-wrap gap-4"><Button asChild variant="text"><Link to="/booking-review">BACK TO REVIEW</Link></Button>{draft.requestSent && <Button asChild variant="outlineEditorial"><Link to="/booking-request-received">I HAVE SENT MY MESSAGE</Link></Button>}</div>
  </main></PageShell>;
}
