import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Mail, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { serviceLabels } from "@/lib/divine-data";
import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { buildBookingMessage, readBookingDraft, isInquiryComplete, type BookingDraft } from "@/lib/booking-storage";

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
  useEffect(() => setDraft(readBookingDraft()), []);
  const message = buildBookingMessage(draft);
  const subject = `Divine Aesthetics Session Inquiry — ${draft.service ? serviceLabels[draft.service] : "Session"}`;
  const whatsappUrl = `https://wa.me/2348162011902?text=${encodeURIComponent(message)}`;
  const gmailUrl = `mailto:divineeribo8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const complete = isInquiryComplete(draft);

  const copyAll = async () => {
    if (!complete) { setError("Your booking draft is incomplete. Return to edit the missing details."); return; }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch { setError("Your browser blocked copying. Select the message text manually below."); }
  };

  return <PageShell><main className="page-intro">
    <p className="eyebrow">FINAL STEP</p><h1 className="page-title">HOW WOULD YOU LIKE TO CONNECT?</h1><p className="mt-8 max-w-2xl body-large">Your complete booking request is already prepared. Choose a method, review the message in your app and press send.</p>
    <div className="mt-8 border-l-2 border-primary bg-secondary p-6"><p className="eyebrow">50% DEPOSIT REQUIRED</p><p className="mt-3 font-serif text-xl leading-relaxed">A 50% deposit is required to secure your selected session. Your booking request is not confirmed until the deposit has been received and your session has been confirmed by Divine Aesthetics Media Agency.</p></div>
    <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
      <a href={complete ? whatsappUrl : undefined} target="_blank" rel="noopener noreferrer" onClick={(event) => { if (!complete) { event.preventDefault(); setError("Your booking draft is incomplete. Return to edit the missing details."); return; }  }} className="group min-h-72 bg-secondary p-8 text-left transition-colors hover:bg-accent"><MessageCircle className="size-8 text-primary" /><h2 className="mt-8 font-serif text-4xl">SEND VIA WHATSAPP</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Opens WhatsApp with every booking detail filled in. Review, then press send.</p></a>
      <a href={complete ? gmailUrl : undefined} target="_blank" rel="noopener noreferrer" onClick={(event) => { if (!complete) { event.preventDefault(); setError("Your booking draft is incomplete. Return to edit the missing details."); return; }  }} className="group min-h-72 bg-secondary p-8 text-left transition-colors hover:bg-accent"><Mail className="size-8 text-primary" /><h2 className="mt-8 font-serif text-4xl">SEND VIA GMAIL</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Opens your email with the subject and complete request filled in, including secure links to your inspiration. Review, then send.</p></a>
    </div>
    <div className="mt-8 border border-border bg-secondary p-6">
      <p className="eyebrow">OR COPY IT YOURSELF</p>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Copy your complete enquiry, then paste it into WhatsApp or your email app.</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="button" variant="outlineEditorial" onClick={() => void copyAll()}><Copy className="mr-2 size-4" />{copied ? "COPIED TO CLIPBOARD" : "COPY FULL INQUIRY"}</Button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline decoration-primary underline-offset-4">If WhatsApp did not open, open a chat with +234 816 201 1902</a>
      </div>
      <pre className="mt-6 max-h-64 overflow-auto whitespace-pre-wrap border border-border bg-background p-4 text-xs leading-6 text-muted-foreground">{message}</pre>
    </div>
    <div className="mt-8 border border-border bg-secondary p-5 text-sm leading-7 text-muted-foreground">Your message goes directly to Divine Aesthetics on WhatsApp (+234 816 201 1902) or Gmail (divineeribo8@gmail.com). No information needs to be retyped.</div>
    {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
    <div className="mt-8 flex flex-wrap gap-4"><Button asChild variant="text"><Link to="/booking-review">BACK TO REVIEW</Link></Button></div>
  </main></PageShell>;
}

